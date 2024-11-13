/*
  Warnings:

  - You are about to drop the column `category` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "category",
ADD COLUMN     "expenseCategory" "ExpenseTransactionCategory",
ADD COLUMN     "gainCategory" "GainTransactionCategory",
ADD COLUMN     "investmentCategory" "InvestmentTransactionCategory",
ADD COLUMN     "transferCategory" "TransferTransactionCategory";
