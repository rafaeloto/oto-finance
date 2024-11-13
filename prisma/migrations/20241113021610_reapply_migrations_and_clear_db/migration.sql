/*
  Warnings:

  - You are about to drop the column `expenseCategory` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `gainCategory` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `investmentCategory` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `transferCategory` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `category` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "expenseCategory",
DROP COLUMN "gainCategory",
DROP COLUMN "investmentCategory",
DROP COLUMN "transferCategory",
ADD COLUMN     "category" TEXT NOT NULL;
