"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { getLocalDate } from "@utils/date";

const InvoiceUpdater = () => {
  const hasRun = Cookies.get("invoice-update-ran") === "true";

  useEffect(() => {
    if (!hasRun) {
      fetch("/api/invoices/update-routine", { method: "POST" })
        .then((res) => {
          if (res.ok) {
            const expires = getLocalDate();
            expires.setHours(24, 0, 0, 0);

            Cookies.set("invoice-update-ran", "true", {
              expires,
              path: "/",
            });
          } else {
            console.error("Error updating invoices");
          }
        })
        .catch((err) => console.error("Error in the request:", err));
    }
  }, [hasRun]);

  return null;
};

export default InvoiceUpdater;
