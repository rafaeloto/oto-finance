"use client";

import { useRouter } from "@hooks/useRouter";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Button } from "@shadcn/button";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <section className="flex min-h-screen items-center justify-center">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full text-center sm:w-10/12 md:w-8/12">
            <div className="h-[200px] md:h-[300px]" aria-hidden="true">
              <DotLottieReact
                src="https://lottie.host/6e0de40d-2bb6-4926-93cc-e1bddd74517a/xsuFBbQDYK.lottie"
                loop
                autoplay
              />
            </div>

            <div className="space-y-4 px-10 md:space-y-6 md:px-0">
              <h3 className="text-2xl font-bold md:text-4xl">Oops!</h3>
              <p className="text-lg md:text-2xl">
                A página que está procurando não existe ou foi removida
              </p>

              <div className="space-x-4">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="text-base"
                >
                  Voltar
                </Button>
                <Button onClick={() => router.push("/")} className="text-base">
                  Ir para a home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
