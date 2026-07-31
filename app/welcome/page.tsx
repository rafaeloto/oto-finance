import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import WelcomeLanding from "./_components/WelcomeLanding";

type WelcomePageProps = {
  searchParams: Promise<{ redirect_url?: string }>;
};

const WelcomePage = async ({ searchParams }: WelcomePageProps) => {
  const { redirect_url } = await searchParams;
  const redirectUrl = redirect_url || "/";

  const { userId } = await auth();

  if (userId) {
    redirect(redirectUrl);
  }

  return <WelcomeLanding redirectUrl={redirectUrl} />;
};

export default WelcomePage;
