import { auth, clerkClient } from "@clerk/nextjs/server";
import Navbar from "../_components/_molecules/navbar";
import { redirect } from "next/navigation";
import PlanCard from "./_components/PlanCard";
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
      <div className="h-screen space-y-6 px-20 py-10">
        <h1 className="text-2xl font-bold">Assinatura</h1>

        <div className="flex gap-10">
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
      </div>
    </>
  );
};

export default SubscriptionPage;
