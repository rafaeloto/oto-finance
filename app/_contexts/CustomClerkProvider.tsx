"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { getCustomAppearance, customPtBR } from "@/app/_lib/clerk";

export const CustomClerkProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { theme } = useTheme();

  return (
    <ClerkProvider
      appearance={getCustomAppearance(theme === "dark" ? "dark" : "light")}
      localization={customPtBR}
    >
      {children}
    </ClerkProvider>
  );
};
