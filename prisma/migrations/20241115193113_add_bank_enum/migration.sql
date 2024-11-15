/*
  Warnings:

  - You are about to drop the column `type` on the `Account` table. All the data in the column will be lost.
  - Added the required column `bank` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Bank" AS ENUM ('PAY_99', 'BANCO_DO_BRASIL', 'BRADESCO', 'CAIXA_ECONOMICA', 'INTER', 'ITAU', 'MERCADO_PAGO', 'NEON', 'NUBANK', 'PICPAY', 'SANTANDER');

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "type",
ADD COLUMN     "bank" "Bank" NOT NULL;

-- DropEnum
DROP TYPE "AccountType";
