import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import Providers from "./_contexts/Providers";
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
        <Providers>
          <div className="flex h-full flex-col overflow-hidden">{children}</div>
        </Providers>

        <Toaster />
      </body>
    </html>
  );
}
