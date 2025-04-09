import { leagueSpartan } from "@styles/fonts";
import Image from "next/image";
import { Button } from "@shadcn/button";
import { LogInIcon } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const { userId } = await auth();

  if (userId) {
    redirect("/");
  }

  return (
    <div className="relative flex h-full flex-col md:grid md:grid-cols-2">
      {/* BACKGROUND IMAGE FOR MOBILE */}
      <div className="absolute inset-0 bg-[url('/login.png')] bg-cover bg-center opacity-10 md:hidden" />

      {/* INFO AND BUTTON */}
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
        <SignInButton>
          <Button variant="outline">
            <LogInIcon className="mr-2" />
            Fazer login ou criar conta
          </Button>
        </SignInButton>
      </div>

      {/* IMAGE TO THE RIGHT FOR DESKTOP */}
      <div className="relative hidden h-full w-full md:block">
        <Image
          src="/login.png"
          alt="Faça login"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;
