import { contextBridge, ipcRenderer } from 'electron';
import { ElectronAPI } from './types/electron';

const electronAPI: ElectronAPI = {
  getFinancialCycles: () => ipcRenderer.invoke('get-financial-cycles'),
  saveFinancialCycle: (data) => ipcRenderer.invoke('save-financial-cycle', data),
  getTransactions: () => ipcRenderer.invoke('get-transactions'),
  getTransactionsByCycle: (cycleId, page, itemsPerPage) => 
    ipcRenderer.invoke('get-transactions-by-cycle', cycleId, page, itemsPerPage),
  getAllTransactionsByCycle: (cycleId) => 
    ipcRenderer.invoke('get-all-transactions-by-cycle', cycleId),
  saveTransaction: (data) => ipcRenderer.invoke('save-transaction', data),
  getCustomers: () => ipcRenderer.invoke('get-customers'),
  getCustomer: (id) => ipcRenderer.invoke('get-customer', id),
  getCustomerTransactions: (customerId) => ipcRenderer.invoke('get-customer-transactions', customerId),
  saveCustomer: (data) => ipcRenderer.invoke('save-customer', data),
  getLatestFinancialCycle: () => ipcRenderer.invoke('get-latest-financial-cycle'),
  getConsolidationData: () => ipcRenderer.invoke('get-consolidation-data'),
  updateConsolidationData: (data) => ipcRenderer.invoke('update-consolidation-data', data),
  getVersion: () => ipcRenderer.invoke('get-version'),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

console.log('Preload script has loaded');
