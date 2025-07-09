"use client";

import { leagueSpartan } from "@styles/fonts";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shadcn/dropdown-menu";
import Icon from "@atoms/Icon";
import useIsDesktop from "@utils/useIsDesktop";
import { cn } from "@/app/_lib/utils";
import ThemeToggle from "@atoms/ThemeToggle";

const Navbar = () => {
  const pathname = usePathname();
  const isDesktop = useIsDesktop();

  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/transactions", label: "Transações" },
    { href: "/accounts", label: "Contas" },
    { href: "/credit-cards", label: "Cartões" },
    { href: "/control", label: "Controle Financeiro" },
    { href: "/subscription", label: "Assinatura" },
  ];

  const optionColor = (href: string) => {
    if (pathname === href) return "font-bold text-primary";

    if (!isDesktop) return;

    return "text-muted-foreground";
  };

  return (
    <nav className="flex justify-between border-b border-solid px-6 py-4 md:px-8">
      <div className="flex items-center gap-10">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image
              src="/favicon.ico"
              alt="Oto Finance"
              width={isDesktop ? 40 : 30}
              height={40}
            />
            <h1
              className={`${leagueSpartan.className} text-xl font-bold md:text-2xl`}
            >
              Oto Finance
            </h1>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-10 md:flex">
          {navItems.map(({ href, label }) => (
            <Link key={href} href={href} className={optionColor(href)}>
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="flex items-center gap-5">
        <ThemeToggle className="hidden md:block" />

        <UserButton showName />

        <div className="flex items-center md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button aria-label="Abrir menu">
                <Icon name="Menu" className="h-6 w-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 p-3 shadow-sm shadow-primary"
            >
              <ThemeToggle />

              {navItems.map(({ href, label }) => (
                <DropdownMenuItem key={href} asChild>
                  <Link href={href} className="w-full">
                    <p className={cn("text-lg", optionColor(href))}>{label}</p>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
