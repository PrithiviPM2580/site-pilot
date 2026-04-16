"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Logo from "./logo";
import ModeToggle from "./mode-toggle";

function Header() {
  const pathname = usePathname();
  const isProjectPage = pathname.startsWith("/project/");

  return (
    <header className="w-full">
      <div
        className={cn(
          "w-full flex py-3.5 px-8 items-center justify-between",
          isProjectPage && "absolute top-0 z-50 px-2 py-1 right-0 w-auto",
        )}
      >
        <div className="">{!isProjectPage && <Logo />}</div>
        <div className="flex items-center justify-end gap-3">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;
