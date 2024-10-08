import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater, UpdateInfo } from 'electron-updater';
import path from 'path';
import { PrismaClient, FinancialCycle, Transaction, Customer } from '@prisma/client';
import log from 'electron-log';

const { execSync } = require('child_process');
const updateElectronApp = require('update-electron-app');

app.commandLine.appendSwitch('no-sandbox');

// Set up auto-updates
updateElectronApp({
  repo: 'Pinkieseb/fintracker',
  updateInterval: '1 hour',
  logger: log
});

// Configure autoUpdater
autoUpdater.logger = log;
// @ts-ignore: Property 'transports' does not exist on type 'Logger'
autoUpdater.logger.transports.file.level = 'info';

// Set the DATABASE_URL environment variable
const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'fintracker.db');
process.env.DATABASE_URL = `file:${dbPath}`;

let prisma: PrismaClient;

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.maximize();

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Handle update events
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('app_version', app.getVersion());
  });
};

async function generatePrismaClient() {
  log.info('Generating Prisma client...');
  const prismaBinary = app.isPackaged 
    ? path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules', '.bin', 'prisma')
    : 'npx prisma';
  try {
    execSync(`${prismaBinary} generate`, { 
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL }
    });
    log.info('Prisma client generated successfully');
  } catch (error) {
    log.error('Failed to generate Prisma client:', error);
    throw error;
  }
}

async function applyDatabaseMigrations() {
  log.info('Applying database migrations...');
  const prismaBinary = app.isPackaged 
    ? path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules', '.bin', 'prisma')
    : 'npx prisma';
  try {
    execSync(`${prismaBinary} migrate deploy`, { 
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL }
    });
    log.info('Migrations applied successfully');
  } catch (error) {
    log.error('Failed to apply database migrations:', error);
    throw error;
  }
}

app.whenReady().then(async () => {
  try {
    await generatePrismaClient();
    await applyDatabaseMigrations();

    // Initialize PrismaClient after generating and migrating
    prisma = new PrismaClient();
    await prisma.$connect();
    log.info('Database connected successfully');

    createWindow();
    setupIpcHandlers();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    // Check for updates after app is ready
    autoUpdater.checkForUpdatesAndNotify();
  } catch (error) {
    log.error('Failed to initialize the application:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

type HandlerFunction = (...args: any[]) => Promise<any>;

function setupIpcHandlers() {
  const handlers: Record<string, HandlerFunction> = {
    'get-financial-cycles': () => prisma.financialCycle.findMany({ orderBy: { timestamp: 'desc' } }),
    'get-transactions': () => prisma.transaction.findMany({ orderBy: { timestamp: 'desc' } }),
    'save-financial-cycle': (_, data: Omit<FinancialCycle, 'id' | 'timestamp'>) => prisma.financialCycle.create({ data }),
    'get-latest-financial-cycle': () => prisma.financialCycle.findFirst({ orderBy: { timestamp: 'desc' } }),
    'save-transaction': (_, data: Omit<Transaction, 'id' | 'timestamp'>) => prisma.transaction.create({ data }),
    'get-customers': () => prisma.customer.findMany({ orderBy: { name: 'asc' } }),
    'save-customer': (_, data: Omit<Customer, 'id'>) => prisma.customer.create({ data }),
    'get-consolidation-data': async () => {
      const latestCycle = await prisma.financialCycle.findFirst({ orderBy: { timestamp: 'desc' } });
      if (!latestCycle) {
        throw new Error('No financial cycle found');
      }
      return {
        inventory: latestCycle.qtyBought,
        balance: latestCycle.supplierDebt,
        unitCost: latestCycle.unitCost,
      };
    },
    'update-consolidation-data': async (_, data: { inventory: number; balance: number }) => {
      const latestCycle = await prisma.financialCycle.findFirst({ orderBy: { timestamp: 'desc' } });
      if (!latestCycle) {
        throw new Error('No financial cycle found');
      }
      return prisma.financialCycle.update({
        where: { id: latestCycle.id },
        data: {
          qtyBought: data.inventory,
          supplierDebt: data.balance,
        },
      });
    },
    'get-transactions-by-cycle': async (_, cycleId: number, page: number, itemsPerPage: number) => {
      const skip = (page - 1) * itemsPerPage;
      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where: { financialCycleId: cycleId },
          orderBy: { timestamp: 'desc' },
          skip,
          take: itemsPerPage,
        }),
        prisma.transaction.count({
          where: { financialCycleId: cycleId },
        }),
      ]);
      return { transactions, total };
    },
    'get-all-transactions-by-cycle': (_, cycleId: number) =>
      prisma.transaction.findMany({
        where: { financialCycleId: cycleId },
        orderBy: { timestamp: 'desc' },
      }),
    'get-version': async () => Promise.resolve(app.getVersion()),
  };

  for (const [channel, handler] of Object.entries(handlers)) {
    ipcMain.handle(channel, async (event, ...args) => {
      try {
        const result = await handler(event, ...args);
        log.info(`Successfully executed ${channel}`);
        return result;
      } catch (error) {
        log.error(`Error in ${channel}:`, error);
        if (error instanceof Error) {
          return { error: true, message: error.message };
        } else {
          return { error: true, message: 'An unknown error occurred' };
        }
      }
    });
  }

  // Add update-related IPC handlers
  ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', app.getVersion());
  });

  ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
  });
}

app.on('before-quit', async () => {
  try {
    await prisma.$disconnect();
    log.info('Database disconnected successfully');
  } catch (error) {
    log.error('Error disconnecting from the database:', error);
  }
});

// Handle update events
autoUpdater.on('update-available', (info: UpdateInfo) => {
  log.info('Update available', info);
  const mainWindow = BrowserWindow.getFocusedWindow();
  if (mainWindow) {
    mainWindow.webContents.send('update_available', info);
  }
});

autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
  log.info('Update downloaded', info);
  const mainWindow = BrowserWindow.getFocusedWindow();
  if (mainWindow) {
    mainWindow.webContents.send('update_downloaded', info);
  }
});

autoUpdater.on('error', (err: Error) => {
  log.error('AutoUpdater error', err);
});
