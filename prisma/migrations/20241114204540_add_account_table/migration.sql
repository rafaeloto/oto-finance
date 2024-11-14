/*
  Warnings:

  - The values [INVESTMENT_DEPOSIT,INVESTMENT_WITHDRAW] on the enum `InvestmentTransactionCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CHECKING_ACCOUNT', 'INVESTMENT_ACCOUNT');

-- AlterEnum
BEGIN;
CREATE TYPE "InvestmentTransactionCategory_new" AS ENUM ('INVESTMENT_NEGATIVE_RETURN', 'INVESTMENT_POSITIVE_RETURN');
ALTER TABLE "Transaction" ALTER COLUMN "investmentCategory" TYPE "InvestmentTransactionCategory_new" USING ("investmentCategory"::text::"InvestmentTransactionCategory_new");
ALTER TYPE "InvestmentTransactionCategory" RENAME TO "InvestmentTransactionCategory_old";
ALTER TYPE "InvestmentTransactionCategory_new" RENAME TO "InvestmentTransactionCategory";
DROP TYPE "InvestmentTransactionCategory_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransferTransactionCategory" ADD VALUE 'INVESTMENT_DEPOSIT';
ALTER TYPE "TransferTransactionCategory" ADD VALUE 'INVESTMENT_WITHDRAW';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "accountId" TEXT,
ADD COLUMN     "fromAccountId" TEXT,
ADD COLUMN     "toAccountId" TEXT;

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AccountType" NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromAccountId_fkey" FOREIGN KEY ("fromAccountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toAccountId_fkey" FOREIGN KEY ("toAccountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
