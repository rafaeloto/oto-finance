"use client";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
// eslint-disable-next-line no-restricted-imports
import { useRouter as useNextRouter } from "next/navigation";
import { useWaitForRefresh } from "./useWaitForRefresh";

export const useRouter = (): AppRouterInstance => {
  const nextRouter = useNextRouter();
  const { runAfterRefresh } = useWaitForRefresh();

  return {
    ...nextRouter,
    push(href, options) {
      runAfterRefresh(() => nextRouter.push(href, options));
    },
    replace(href, options) {
      runAfterRefresh(() => nextRouter.replace(href, options));
    },
    back() {
      runAfterRefresh(() => nextRouter.back());
    },
    forward() {
      runAfterRefresh(() => nextRouter.forward());
    },
  };
};
