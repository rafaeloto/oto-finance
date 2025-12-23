"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/app/_lib/utils";
import { useTheme } from "next-themes";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";

    // Use View Transitions API if available
    if ("startViewTransition" in document) {
      (document as Document).startViewTransition(() => {
        setTheme(newTheme);
      });
    } else {
      setTheme(newTheme);
    }
  };

  return (
    <div
      className={cn(
        "flex h-10 w-20 cursor-pointer rounded-full p-1 transition-all duration-300",
        isDark
          ? "border border-zinc-800 bg-zinc-950"
          : "border border-zinc-200 bg-white",
        className,
      )}
      onClick={toggleTheme}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleTheme();
        }
      }}
    >
      <div className="flex w-full items-center justify-between">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300",
            isDark
              ? "translate-x-0 transform bg-zinc-800"
              : "translate-x-10 transform bg-zinc-200",
          )}
        >
          {isDark ? (
            <Moon
              className="h-5 w-5 fill-blue-500 text-blue-500"
              strokeWidth={1.5}
            />
          ) : (
            <Sun
              className="h-5 w-5 fill-yellow-500 text-yellow-500"
              strokeWidth={1.5}
            />
          )}
        </div>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300",
            isDark ? "bg-transparent" : "-translate-x-10 transform",
          )}
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-gray-500" strokeWidth={1.5} />
          ) : (
            <Moon className="h-5 w-5 text-black" strokeWidth={1.5} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
