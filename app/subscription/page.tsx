import { auth, clerkClient } from "@clerk/nextjs/server";
import Navbar from "@molecules/Navbar";
import { redirect } from "next/navigation";
import PlanCard from "./_components/PlanCard";
import { ScrollArea } from "@shadcn/scroll-area";
import { getCurrentMonthTransactions } from "../_data/get-current-month-transactions";

const SubscriptionPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const user = await clerkClient().users.getUser(userId);
  const hasPremiumPlan = user?.publicMetadata.subscriptionPlan === "premium";
  const currentMonthTransactions = await getCurrentMonthTransactions();

  return (
    <>
      <Navbar />
      <div className="flex h-dvh flex-col gap-6 overflow-y-hidden px-6 py-6 md:px-20 md:py-10">
        <h1 className="text-2xl font-bold">Assinatura</h1>

        <ScrollArea className="h-0 flex-1">
          <div className="flex flex-col flex-wrap gap-6 md:flex-row md:gap-10">
            <PlanCard
              isActive={!hasPremiumPlan}
              title="Plano Básico"
              value={0}
              includedFeatures={[
                `Apenas 10 transações por mês (${currentMonthTransactions}/10)`,
              ]}
              notIncludedFeatures={["Relatórios de IA"]}
            />

            <PlanCard
              isActive={hasPremiumPlan}
              title="Plano Premium"
              value={19}
              includedFeatures={["Transações ilimitadas", "Relatórios de IA"]}
              showAquirePlanButton
            />
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default SubscriptionPage;
