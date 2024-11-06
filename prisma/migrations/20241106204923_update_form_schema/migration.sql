/*
  Warnings:

  - The values [INVESTMENT,RETURN_ON_INVESTMENT] on the enum `TransactionCategory` will be removed. If these variants are still used in the database, this will fail.
  - The values [RESCUE] on the enum `TransactionType` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `paymentMethod` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionPaymentMethod" AS ENUM ('CREDIT', 'DEBIT');

-- AlterEnum
BEGIN;
CREATE TYPE "TransactionCategory_new" AS ENUM ('CASHBACK', 'CLOTHING', 'EDUCATION', 'ENTERTAINMENT', 'FOOD', 'GIFT', 'GOALS', 'HEALTH', 'INVESTMENT_DEPOSIT', 'INVESTMENT_RETURN', 'INVESTMENT_WITHDRAW', 'LIVING', 'LOAN', 'OTHER', 'PERSONAL', 'PET', 'REWARD', 'SALE', 'SALARY', 'SUBSCRIPTION', 'TAXES', 'TRANSPORTATION', 'TRAVEL', 'VARIABLE');
ALTER TABLE "Transaction" ALTER COLUMN "category" TYPE "TransactionCategory_new" USING ("category"::text::"TransactionCategory_new");
ALTER TYPE "TransactionCategory" RENAME TO "TransactionCategory_old";
ALTER TYPE "TransactionCategory_new" RENAME TO "TransactionCategory";
DROP TYPE "TransactionCategory_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TransactionType_new" AS ENUM ('GAIN', 'EXPENSE', 'TRANSFER', 'INVESTMENT');
ALTER TABLE "Transaction" ALTER COLUMN "type" TYPE "TransactionType_new" USING ("type"::text::"TransactionType_new");
ALTER TYPE "TransactionType" RENAME TO "TransactionType_old";
ALTER TYPE "TransactionType_new" RENAME TO "TransactionType";
DROP TYPE "TransactionType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "TransactionPaymentMethod" NOT NULL;

-- DropEnum
DROP TYPE "PaymentMethod";
