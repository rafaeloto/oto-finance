import { leagueSpartan } from "@styles/fonts";
import Image from "next/image";
import { Button } from "@shadcn/button";
import Icon from "@atoms/Icon";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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

  return (
    <div className="relative flex h-full flex-col md:grid md:grid-cols-2">
      {/* Background image for mobile */}
      <div className="absolute inset-0 bg-[url('/welcome.png')] bg-cover bg-center opacity-10 md:hidden" />

      {/* Info and button */}
      <div className="relative z-10 mx-auto flex h-full max-w-[550px] flex-col justify-center p-8">
        <div className="mb-8 flex items-center gap-3 md:mb-6">
          <Image src="/favicon.ico" alt="Oto Finance" width={60} height={60} />
          <h1
            className={`${leagueSpartan.className} font-spartan text-4xl font-bold`}
          >
            Oto Finance
          </h1>
        </div>
        <h1 className="mb-8 text-4xl font-bold md:mb-3">Bem-vindo</h1>
        <p className="mb-8 text-muted-foreground">
          A Oto Finance é uma plataforma de gestão financeira que permite que
          você tenha um controle completo sobre suas financas, utilizando IA
          para monitorar suas movimentações, e oferecer insights personalizados,
          facilitando o controle do seu orçamento.
        </p>
        {/* Signin button */}
        <div className="flex w-full flex-col gap-4">
          <SignInButton forceRedirectUrl={redirectUrl} mode="modal">
            <Button>
              <Icon name="LogIn" className="mr-2" />
              Entrar
            </Button>
          </SignInButton>

          {/* Signup button */}
          <SignUpButton forceRedirectUrl={redirectUrl} mode="modal">
            <Button variant="outline">
              <Icon name="UserPlus" className="mr-2" />
              Cadastrar
            </Button>
          </SignUpButton>
        </div>
      </div>

      {/* Image to the right for desktop */}
      <div className="relative hidden h-full w-full md:block">
        <Image
          src="/welcome.png"
          alt="Faça login"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default WelcomePage;
