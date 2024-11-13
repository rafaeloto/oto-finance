-- Passo 1: Adicionar a CHECK constraint para garantir que pelo menos uma categoria seja preenchida dependendo do tipo de transação
ALTER TABLE "Transaction"
  ADD CONSTRAINT "check_category"
  CHECK (
    ("gainCategory" IS NOT NULL AND "type" = 'GAIN') OR
    ("expenseCategory" IS NOT NULL AND "type" = 'EXPENSE') OR
    ("investmentCategory" IS NOT NULL AND "type" = 'INVESTMENT') OR
    ("transferCategory" IS NOT NULL AND "type" = 'TRANSFER')
  );
