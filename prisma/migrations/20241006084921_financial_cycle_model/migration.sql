/*
  Warnings:

  - You are about to drop the `InitialData` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `financialCycleId` to the `UsageEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "InitialData";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "FinancialCycle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "supplierDebt" REAL NOT NULL,
    "totalQuantityBought" REAL NOT NULL,
    "totalCost" REAL NOT NULL,
    "unitCost" REAL NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UsageEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" REAL NOT NULL,
    "cost" REAL NOT NULL,
    "notes" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "financialCycleId" INTEGER NOT NULL,
    CONSTRAINT "UsageEntry_financialCycleId_fkey" FOREIGN KEY ("financialCycleId") REFERENCES "FinancialCycle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UsageEntry" ("amount", "cost", "id", "notes", "timestamp") SELECT "amount", "cost", "id", "notes", "timestamp" FROM "UsageEntry";
DROP TABLE "UsageEntry";
ALTER TABLE "new_UsageEntry" RENAME TO "UsageEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
