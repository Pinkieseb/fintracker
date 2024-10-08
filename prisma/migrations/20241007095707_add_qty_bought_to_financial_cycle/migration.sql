/*
  Warnings:

  - You are about to drop the `DebtIncurred` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DebtRepayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsageEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `totalQuantityBought` on the `FinancialCycle` table. All the data in the column will be lost.
  - You are about to drop the column `amountCharged` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `amountPaid` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `profit` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `qtyCost` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `revenue` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `spending` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `qtyBought` to the `FinancialCycle` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "DebtIncurred_transactionId_key";

-- DropIndex
DROP INDEX "DebtRepayment_transactionId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DebtIncurred";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DebtRepayment";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UsageEntry";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FinancialCycle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "supplierDebt" REAL NOT NULL,
    "qtyBought" REAL NOT NULL,
    "totalCost" REAL NOT NULL,
    "unitCost" REAL NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_FinancialCycle" ("id", "supplierDebt", "timestamp", "totalCost", "unitCost") SELECT "id", "supplierDebt", "timestamp", "totalCost", "unitCost" FROM "FinancialCycle";
DROP TABLE "FinancialCycle";
ALTER TABLE "new_FinancialCycle" RENAME TO "FinancialCycle";
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "financialCycleId" INTEGER NOT NULL,
    "customerId" INTEGER,
    "transactionType" TEXT NOT NULL,
    "isDebt" BOOLEAN NOT NULL DEFAULT false,
    "amtBalance" REAL NOT NULL DEFAULT 0,
    "qtyBalance" REAL NOT NULL DEFAULT 0,
    "debtBalance" REAL NOT NULL DEFAULT 0,
    "costProfit" REAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_financialCycleId_fkey" FOREIGN KEY ("financialCycleId") REFERENCES "FinancialCycle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("customerId", "financialCycleId", "id", "isDebt", "notes", "timestamp", "transactionType") SELECT "customerId", "financialCycleId", "id", "isDebt", "notes", "timestamp", "transactionType" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
