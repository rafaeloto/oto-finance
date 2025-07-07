"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { getLocalDate } from "@utils/date";
import { usePathname } from "next/navigation";

/**
 * A component that runs the invoice update routine once per day when the user navigates to any page.
 * It skips execution on the welcome page and prevents multiple runs within the same day using a cookie.
 *
 * @returns {null} Renders nothing (null)
 *
 * @behavior
 * - Checks if the current path is '/welcome' and skips execution if true
 * - Uses a cookie 'invoice-update-ran' to track if the routine has already run
 * - Makes a POST request to '/api/invoices/update-routine' if not already run
 * - Sets a cookie that expires at midnight after successful execution
 * - Logs errors to console without blocking the application
 */
const InvoiceUpdater = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Skip if on welcome page (user isn't authenticated)
    if (pathname === "/welcome") return;

    // Gets the cookie to check if the update routine has already run
    const hasRun = Cookies.get("invoice-update-ran") === "true";

    const updateInvoices = async () => {
      try {
        await fetch("/api/invoices/update-routine", { method: "POST" });

        const expires = getLocalDate();
        expires.setHours(24, 0, 0, 0);

        Cookies.set("invoice-update-ran", "true", {
          expires,
          path: "/",
        });
      } catch (err) {
        console.error("Error updating invoices:", err);
      }
    };

    if (!hasRun) {
      updateInvoices();
    }
  }, [pathname]);

  return null;
};

export default InvoiceUpdater;
