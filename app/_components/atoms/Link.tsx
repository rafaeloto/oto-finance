"use client";

import { useRouter } from "@hooks/useRouter";
// eslint-disable-next-line no-restricted-imports
import NextLink from "next/link";
import { ReactNode, ComponentProps, MouseEvent } from "react";
import { useWaitForRefresh } from "@hooks/useWaitForRefresh";

type ProgressLinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & {
  href: string;
  children?: ReactNode;
};

const Link = ({ href, children, ...rest }: ProgressLinkProps) => {
  const router = useRouter();

  const { runAfterRefresh } = useWaitForRefresh();

  function handleLeftClick(e: MouseEvent<HTMLAnchorElement>) {
    // If ctrl or command is pressed, the user means to open link in new tab.
    if (e.metaKey || e.ctrlKey) {
      runAfterRefresh(() => window.open(href, "_blank"));
      return;
    }

    router.push(href);
  }

  return (
    <NextLink
      onClick={(e) => {
        e.preventDefault();

        handleLeftClick(e);
      }}
      href={href}
      {...rest}
    >
      {children}
    </NextLink>
  );
};

export default Link;
