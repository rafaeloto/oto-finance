"use client";

import { useProgressBar } from "@molecules/ProgressBar";
import { startTransition } from "react";

type UseWaitForRefreshReturn = {
  runAfterRefresh: (callback: () => void) => void;
};

/**
 * This hook returns a function that will handle the logic for waiting
 * for the refresh router before running a callback function.
 */
export const useWaitForRefresh = (): UseWaitForRefreshReturn => {
  const { start, done } = useProgressBar();

  const runAfterRefresh = (onRefreshFinished: () => void) => {
    start();

    startTransition(() => {
      onRefreshFinished?.();
      done();
    });
  };

  return { runAfterRefresh };
};
