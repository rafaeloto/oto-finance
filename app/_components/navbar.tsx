"use client";

import { leagueSpartan } from "@/app/_styles/fonts";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="flex justify-between border-b border-solid px-8 py-4">
      <div className="flex items-center gap-10">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image
              src="/favicon.ico"
              alt="Oto Finance"
              width={40}
              height={40}
            />
            <h1 className={`${leagueSpartan.className} text-2xl font-bold`}>
              Oto Finance
            </h1>
          </div>
        </Link>

        <Link
          href="/"
          className={
            pathname === "/"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
        >
          Dashboard
        </Link>

        <Link
          href="/transactions"
          className={
            pathname === "/transactions"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
        >
          Transações
        </Link>

        <Link
          href="/accounts"
          className={
            pathname === "/accounts"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
        >
          Contas
        </Link>

        <Link
          href="/credit-cards"
          className={
            pathname === "/credit-cards"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
        >
          Cartões
        </Link>

        <Link
          href="/subscription"
          className={
            pathname === "/subscription"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
        >
          Assinatura
        </Link>
      </div>

      <UserButton showName />
    </nav>
  );
};

export default Navbar;
