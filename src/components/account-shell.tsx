"use client";

import * as React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Marquee } from "@/components/marquee";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/animated-background";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Package, User, LogOut, LayoutDashboard } from "lucide-react";

export const ACCOUNT_NAV = [
  { href: "/account/orders", label: "Orders", icon: Package, description: "View your order history" },
];

interface AccountShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  callbackUrl?: string;
}

export function AccountShell({ title, description, children, callbackUrl }: AccountShellProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session?.user) {
    return (
      <AnimatedBackground>
        <>
          <Marquee />
          <Navbar />
          <main id="main-content" className="min-h-screen bg-white pt-16 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-md mx-auto text-center py-20">
                <h1 className="font-bold tracking-tight uppercase text-3xl text-black mb-4">SIGN IN REQUIRED</h1>
                <p className="text-black/60 mb-8">Please sign in to access your account.</p>
                <Button asChild>
                  <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl || pathname)}`}>SIGN IN</Link>
                </Button>
              </div>
            </div>
          </main>
          <Footer />
        </>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <>
        <Marquee />
        <Navbar />
        <main id="main-content" className="min-h-screen bg-white pt-16 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <h1 className="font-bold tracking-tight uppercase text-3xl md:text-4xl text-black">{title}</h1>
              {description && <p className="mt-2 text-black/60">{description}</p>}
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              <aside className="lg:col-span-1">
                <div className="bg-white border border-black/10 p-6 space-y-4 sticky top-24">
                  <div className="flex items-center gap-4 p-4 bg-black/5 rounded-lg border border-black/10">
                    <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center shrink-0">
                      <User className="h-6 w-6 text-purple-600" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-black truncate">{session.user.name || "Customer"}</p>
                      <p className="text-sm text-black/50 truncate">{session.user.email}</p>
                    </div>
                  </div>

                  <nav className="space-y-1" aria-label="Account navigation">
                    {ACCOUNT_NAV.map((item) => {
                      const isActive =
                        item.href === "/account" ? pathname === "/account" : pathname.startsWith(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                            isActive
                              ? "bg-purple-600 text-white"
                              : "text-black/70 hover:text-black hover:bg-black/5",
                          )}
                        >
                          <item.icon className="h-5 w-5" aria-hidden="true" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                    {session.user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-black/70 hover:text-black hover:bg-black/5 transition-colors"
                      >
                        <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
                        <span className="font-medium">Admin</span>
                      </Link>
                    )}
                  </nav>

                  <Button variant="outline" className="w-full" onClick={() => signOut({ callbackUrl: "/" })}>
                    <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                    SIGN OUT
                  </Button>
                </div>
              </aside>

              <div className="lg:col-span-3 space-y-6">{children}</div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    </AnimatedBackground>
  );
}