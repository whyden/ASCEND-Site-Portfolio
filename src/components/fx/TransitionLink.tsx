"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { scrollToId, scrollToStart } from "@/lib/scroll";
import { coverPage } from "@/lib/transition";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

// Works like a usual link: on the same page it scrolls smoothly to the section,
// or to the top if the link has no section. On another page it plays the curtain first.
export function TransitionLink({ href, onClick, ...rest }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

    const [path, hash] = href.split("#");
    const targetPath = path || pathname;
    event.preventDefault();

    if (targetPath === pathname) {
      if (hash) {
        scrollToId(hash);
        window.history.replaceState(null, "", `#${hash}`);
      } else {
        scrollToStart();
        window.history.replaceState(null, "", pathname);
      }
      return;
    }

    await coverPage();
    router.push(href, { scroll: false });
  };

  return <Link href={href} onClick={handleClick} {...rest} />;
}
