/*
  Warnings:

  - You are about to drop the column `expenseCategory` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `gainCategory` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `investmentCategory` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `transferCategory` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "expenseCategory",
DROP COLUMN "gainCategory",
DROP COLUMN "investmentCategory",
DROP COLUMN "transferCategory";

-- DropEnum
DROP TYPE "ExpenseTransactionCategory";

-- DropEnum
DROP TYPE "GainTransactionCategory";

-- DropEnum
DROP TYPE "InvestmentTransactionCategory";

-- DropEnum
DROP TYPE "TransferTransactionCategory";
