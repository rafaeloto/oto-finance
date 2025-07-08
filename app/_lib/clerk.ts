import { ptBR } from "@clerk/localizations";
import { dark } from "@clerk/themes";

export const customPtBR = {
  ...ptBR,
  formFieldLabel__emailAddress: "E-mail",
  signIn: {
    ...ptBR.signIn,
    start: {
      ...ptBR.signIn?.start,
      title: "Oto Finance",
      subtitle: "Entre com a sua conta para continuar",
    },
  },
  signUp: {
    ...ptBR.signUp,
    start: {
      ...ptBR.signUp?.start,
      title: "Oto Finance",
      subtitle: "Crie sua conta para continuar",
    },
  },
};

export const getCustomAppearance = (theme: "dark" | "light") => ({
  elements: {
    modalBackdrop: "flex items-start justify-center md:items-center",
    // FYI: the headerTitle style is set in the global.css file
    headerSubtitle: "text-base",
    button: "text-base",
    socialButtonsBlockButtonText: "text-base",
    formFieldLabel: "text-base",
    formFieldInput: "text-base",
    formFieldRow__name: "flex-col gap-6",
  },
  variables: {
    colorPrimary: "hsl(102 59% 44%)",
  },
  ...(theme === "dark" && { baseTheme: dark }),
});
