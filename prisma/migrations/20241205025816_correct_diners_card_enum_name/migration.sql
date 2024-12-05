/*
  Warnings:

  - The values [DINNERS] on the enum `CreditCardFlag` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CreditCardFlag_new" AS ENUM ('ALELO', 'AMEX', 'DINERS', 'ELO', 'HIPERCARD', 'MASTERCARD', 'VISA');
ALTER TABLE "CreditCard" ALTER COLUMN "flag" TYPE "CreditCardFlag_new" USING ("flag"::text::"CreditCardFlag_new");
ALTER TYPE "CreditCardFlag" RENAME TO "CreditCardFlag_old";
ALTER TYPE "CreditCardFlag_new" RENAME TO "CreditCardFlag";
DROP TYPE "CreditCardFlag_old";
COMMIT;
