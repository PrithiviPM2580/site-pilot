"use client";

import React from "react";
import {
  InsforgeBrowserProvider,
  type InitialAuthState,
  type InsforgeBrowserProviderProps,
} from "@insforge/nextjs";
import { insforge } from "@/lib/inforge-client";

function InforgeProvider({ children }: { children: React.ReactNode }) {
  const providerClient =
    insforge as unknown as InsforgeBrowserProviderProps["client"];

  return (
    <InsforgeBrowserProvider client={providerClient} afterSignInUrl="/">
      {children}
    </InsforgeBrowserProvider>
  );
}

export default InforgeProvider;
