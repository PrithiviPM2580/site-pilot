"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Logo from "./logo";
import ModeToggle from "./mode-toggle";
import { SignedIn, SignedOut, useAuth, UserButton } from "@insforge/nextjs";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import Link from "next/link";

function Header() {
  const pathname = usePathname();
  const { isLoaded } = useAuth();
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

          {!isLoaded ? (
            <Spinner className="w-8 h-8" />
          ) : (
            <>
              <SignedOut>
                <Button asChild variant="outline">
                  <Link href="/sign-in">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">Sign up</Link>
                </Button>
              </SignedOut>

              <SignedIn>
                <UserButton mode="simple" afterSignOutUrl="/" showProfile />
              </SignedIn>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
