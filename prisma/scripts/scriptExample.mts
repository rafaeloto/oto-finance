import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

/**
 * Script example for transaction migration.
 * Adapt the criteria, data and transformations as needed.
 */
async function main() {
  console.log(isDryRun ? '🔍 Modo Dry Run ativo — nenhuma alteração será aplicada.' : '🚀 Executando script de migração...');

  // Adjust the query below based on your migration logic
  const transactions = await prisma.transaction.findMany({
    where: {
      // Example: where -> some field needs to be migrated
      categoryId: null,
    },
  });

  console.log(`Encontradas ${transactions.length} transações para processamento`);

  for (const tx of transactions) {
    // Implement logic to define the new value
    const newCategoryId = null;

    if (!newCategoryId) continue;

    if (isDryRun) {
      // In dry-run mode, only displays what would be done, without doing it
      console.log(`🟡 [DryRun] Transação ${tx.id} receberia categoryId = ${newCategoryId}`);
    } else {
      // Apply real logic
      // await prisma.transaction.update({
      //   where: { id: tx.id },
      //   data: { categoryId: newCategoryId },
      // });
      console.log(`✅ Atualizado: ${tx.id} → ${newCategoryId}`);
    }
  }

  console.log(isDryRun ? '✅ Simulação finalizada' : '🎉 Migração concluída!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a migração:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
