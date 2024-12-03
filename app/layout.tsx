import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AccountsProvider } from "./_contexts/AccountsContext";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";

const mulish = Mulish({
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: "Oto Finance",
  description: "Software for finance control",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mulish.className} dark backdrop:antialiased`}>
        <ClerkProvider appearance={{ baseTheme: dark }}>
          <AccountsProvider>
            <div className="flex h-full flex-col overflow-hidden">
              {children}
            </div>
          </AccountsProvider>
        </ClerkProvider>

        <Toaster />
      </body>
    </html>
  );
}
