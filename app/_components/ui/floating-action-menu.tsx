"use client";

import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@shadcn/button";
import { Plus } from "lucide-react";
import { cn } from "@/app/_lib/utils";

type FloatingActionMenuProps = {
  options: {
    label: string;
    onClick: () => void;
    Icon?: React.ReactNode;
  }[];
  className?: string;
  disabled?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
  triggerLabel?: string;
};

const FloatingActionMenu = ({
  options,
  className,
  disabled = false,
  size,
  triggerLabel,
}: FloatingActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + 8,
        left: rect.right - 140,
      });
    }

    setIsOpen(true);
  };

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={toggleMenu}
        className={cn(className, "gap-0")}
        disabled={disabled}
        {...(size && { size })}
      >
        {triggerLabel && <span className="mr-2">{triggerLabel}</span>}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          <Plus className="h-6 w-6" />
        </motion.div>
      </Button>

      {typeof window !== "undefined" &&
        isOpen &&
        buttonPosition &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
              transition={{
                duration: 0.6,
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.1,
              }}
              className="fixed z-50"
              style={{
                top: buttonPosition.top,
                left: buttonPosition.left,
              }}
            >
              <div className="flex flex-col items-end gap-2">
                {options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                    }}
                  >
                    <Button
                      onClick={() => {
                        option.onClick();
                        toggleMenu();
                      }}
                      size="sm"
                      className="flex items-center gap-2 rounded-full border-none bg-muted shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm"
                    >
                      {option.Icon}
                      <span>{option.label}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};

export default FloatingActionMenu;
