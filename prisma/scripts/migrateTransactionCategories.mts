import { PrismaClient, TransactionType } from '@prisma/client';
import { expenseMap, gainMap, investmentMap, transferMap } from '@constants/category';

const prisma = new PrismaClient();

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

async function main() {
  console.log(isDryRun ? '🔍 Modo Dry Run ativo — nenhuma alteração será aplicada.' : '🚀 Executando migração de categorias...');

  const transactions = await prisma.transaction.findMany({
    where: { categoryId: null },
  });

  console.log(`Encontradas ${transactions.length} transações sem categoryId`);

  for (const tx of transactions) {
    let newCategoryId: string | null = null;

    if (tx.type === TransactionType.EXPENSE && tx.expenseCategory) {
      newCategoryId = expenseMap[tx.expenseCategory];
    } else if (tx.type === TransactionType.GAIN && tx.gainCategory) {
      newCategoryId = gainMap[tx.gainCategory];
    } else if (tx.type === TransactionType.INVESTMENT && tx.investmentCategory) {
      newCategoryId = investmentMap[tx.investmentCategory];
    } else if (tx.type === TransactionType.TRANSFER && tx.transferCategory) {
      newCategoryId = transferMap[tx.transferCategory];
    }

    if (!newCategoryId) continue;

    if (isDryRun) {
      console.log(`🟡 [DryRun] Transação ${tx.id} receberia categoryId = ${newCategoryId}`);
    } else {
      await prisma.transaction.update({
        where: { id: tx.id },
        data: { categoryId: newCategoryId },
      });
      console.log(`✅ Atualizado: ${tx.id} → ${newCategoryId}`);
    }
  }

  console.log(isDryRun ? '✅ Simulação finalizada' : '🎉 Migração concluída!');
}

main()
  .catch((e) => {
    console.error('Erro durante a migração:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
