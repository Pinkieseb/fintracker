-- CreateTable
CREATE TABLE "InitialData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "supplierDebt" REAL NOT NULL,
    "totalQuantityBought" REAL NOT NULL,
    "totalCost" REAL NOT NULL,
    "unitCost" REAL NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UsageEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" REAL NOT NULL,
    "cost" REAL NOT NULL,
    "notes" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
