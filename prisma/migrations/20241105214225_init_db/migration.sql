-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('GAIN', 'EXPENSE', 'TRANSFER', 'INVESTMENT', 'RESCUE');

-- CreateEnum
CREATE TYPE "TransactionCategory" AS ENUM ('CASHBACK', 'CLOTHING', 'EDUCATION', 'ENTERTAINMENT', 'FOOD', 'GIFT', 'GOALS', 'HEALTH', 'INVESTMENT', 'LIVING', 'LOAN', 'OTHER', 'PERSONAL', 'PET', 'REWARD', 'RETURN_ON_INVESTMENT', 'SALE', 'SALARY', 'SUBSCRIPTION', 'TAXES', 'TRANSPORTATION', 'TRAVEL', 'VARIABLE');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT', 'DEBIT');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "category" "TransactionCategory" NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
