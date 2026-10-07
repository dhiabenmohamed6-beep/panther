"use client";

import * as React from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { CartDrawer } from "@/components/cart-drawer";
import { FloatingInstagram } from "@/components/floating-instagram";
import { CustomCursor } from "@/components/custom-cursor";
import { BackButton } from "@/components/back-button";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <BackButton />
      <Toaster />
      <CartDrawer />
      <FloatingInstagram />
      <CustomCursor />
    </SessionProvider>
  );
}