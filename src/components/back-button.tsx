"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Floating back control shown on every page except the storefront home.
 * Uses browser history when there is somewhere to go back to, otherwise
 * falls back to the home page.
 */
export function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();

  if (!pathname || pathname === "/") return null;

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="Go back"
      title="Go back"
      className={cn(
        "fixed bottom-6 left-6 z-40 flex h-11 items-center gap-2 rounded-full border border-black/10 bg-white/90 px-3.5 text-sm font-medium text-black shadow-lg backdrop-blur-md transition-colors hover:border-purple-600 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600/40",
        className
      )}
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">Back</span>
    </button>
  );
}