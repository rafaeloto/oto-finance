import { auth, clerkClient } from "@clerk/nextjs/server";

export const getUser = async () => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await clerkClient().users.getUser(userId);

  return user || undefined;
};
