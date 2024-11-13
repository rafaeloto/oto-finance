-- Criação dos novos enums para categorias
CREATE TYPE "GainTransactionCategory" AS ENUM ('CASHBACK', 'GIFT', 'LOAN', 'OTHER', 'REWARD', 'SALE', 'SALARY', 'VARIABLE');
CREATE TYPE "ExpenseTransactionCategory" AS ENUM ('CLOTHING', 'EDUCATION', 'ENTERTAINMENT', 'FOOD', 'GIFT', 'GOALS', 'HEALTH', 'LIVING', 'LOAN', 'OTHER', 'PERSONAL', 'PET', 'SUBSCRIPTION', 'TAXES', 'TRANSPORTATION', 'TRAVEL');
CREATE TYPE "InvestmentTransactionCategory" AS ENUM ('INVESTMENT_DEPOSIT', 'INVESTMENT_NEGATIVE_RETURN', 'INVESTMENT_POSITIVE_RETURN', 'INVESTMENT_WITHDRAW');
CREATE TYPE "TransferTransactionCategory" AS ENUM ('TRANSFER');

-- Passo 2: Alterar a coluna "category" para TEXT temporariamente
ALTER TABLE "Transaction" ALTER COLUMN "category" TYPE TEXT;

-- Passo 3: Criar colunas para os novos enums, inicialmente como opcionais (permitir NULL)
ALTER TABLE "Transaction" 
    ADD COLUMN "gainCategory" "GainTransactionCategory" NULL,
    ADD COLUMN "expenseCategory" "ExpenseTransactionCategory" NULL,
    ADD COLUMN "investmentCategory" "InvestmentTransactionCategory" NULL,
    ADD COLUMN "transferCategory" "TransferTransactionCategory" NULL;

-- Passo 4: Migrar os dados da coluna "category" para as novas colunas
UPDATE "Transaction" SET "gainCategory" = "category"::"GainTransactionCategory"
WHERE "category" IN ('CASHBACK', 'GIFT', 'LOAN', 'OTHER', 'REWARD', 'SALE', 'SALARY', 'VARIABLE');

UPDATE "Transaction" SET "expenseCategory" = "category"::"ExpenseTransactionCategory"
WHERE "category" IN ('CLOTHING', 'EDUCATION', 'ENTERTAINMENT', 'FOOD', 'GIFT', 'GOALS', 'HEALTH', 'LIVING', 'LOAN', 'OTHER', 'PERSONAL', 'PET', 'SUBSCRIPTION', 'TAXES', 'TRANSPORTATION', 'TRAVEL');

UPDATE "Transaction" SET "investmentCategory" = "category"::"InvestmentTransactionCategory"
WHERE "category" IN ('INVESTMENT_DEPOSIT', 'INVESTMENT_NEGATIVE_RETURN', 'INVESTMENT_POSITIVE_RETURN', 'INVESTMENT_WITHDRAW');

UPDATE "Transaction" SET "transferCategory" = "category"::"TransferTransactionCategory"
WHERE "category" = 'TRANSFER';

-- Passo 5: Remover a coluna antiga "category" e tornar as novas colunas obrigatórias
ALTER TABLE "Transaction" DROP COLUMN "category";

-- Agora, altere as colunas para NOT NULL
ALTER TABLE "Transaction" 
    ALTER COLUMN "gainCategory" SET NOT NULL,
    ALTER COLUMN "expenseCategory" SET NOT NULL,
    ALTER COLUMN "investmentCategory" SET NOT NULL,
    ALTER COLUMN "transferCategory" SET NOT NULL;

-- Passo 6: Remover o antigo enum "TransactionCategory"
DROP TYPE "TransactionCategory";
