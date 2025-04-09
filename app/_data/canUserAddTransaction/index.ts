import { auth } from "@clerk/nextjs/server";
import { getCurrentMonthTransactions } from "@data/getCurrentMonthTransactions";
import { getUser } from "@data/getUser";

export const canUserAddTransaction = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await getUser();
  if (user.publicMetadata.subscriptionPlan === "premium") {
    return true;
  }

  const currentMonthTransactions = await getCurrentMonthTransactions();

  if (currentMonthTransactions >= 10) {
    return false;
  }

  return true;
};
