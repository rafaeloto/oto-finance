/*
  Warnings:

  - Added the required column `closingDate` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN "closingDate" INTEGER;
ALTER TABLE "Invoice" ADD COLUMN "dueDate" INTEGER;

UPDATE "Invoice"
SET "closingDate" = (SELECT "closingDate" FROM "CreditCard" WHERE "CreditCard"."id" = "Invoice"."creditCardId"),
    "dueDate" = (SELECT "dueDate" FROM "CreditCard" WHERE "CreditCard"."id" = "Invoice"."creditCardId")
WHERE "creditCardId" IS NOT NULL;

ALTER TABLE "Invoice" ALTER COLUMN "closingDate" SET NOT NULL;
ALTER TABLE "Invoice" ALTER COLUMN "dueDate" SET NOT NULL;