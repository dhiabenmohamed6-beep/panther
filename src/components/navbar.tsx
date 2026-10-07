"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Menu, X, LogOut, LayoutDashboard, Package, ChevronDown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { getTotalItems, toggleCart } = useCartStore();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [accountOpen, setAccountOpen] = React.useState(false);
  const hydrated = useHydrated();
  const cartCount = hydrated ? getTotalItems() : 0;
  const accountRef = React.useRef<HTMLDivElement>(null);
  const isAdmin = session?.user?.role === "ADMIN";

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAccountOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!accountOpen) return;
    const onClick = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountOpen]);

  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/shop", label: "SHOP" },
    { href: "/story", label: "STORY" },
    { href: "/contact", label: "CONTACT" },
  ];

  return (
    <>
      <header
        className={cn(
          "relative left-0 right-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-white/80 backdrop-blur-md border-b border-black/10"
            : "bg-transparent"
        )}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Navigation principale">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-black font-bold tracking-widest text-xl"
              aria-label="PANTHER - Accueil"
            >
              <img
                src="/images/logo.png"
                alt="PANTHER"
                className="h-12 w-auto"
                aria-hidden="true"
              />
              PANTHER
            </Link>

            <div className="hidden md:flex md:items-center md:gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium tracking-wider uppercase transition-colors duration-200 relative",
                    pathname === link.href
                      ? "text-purple-600"
                      : "text-black/70 hover:text-black"
                  )}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span
                      className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-600"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              ))}
            </div>

             <div className="flex items-center gap-4">
               <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen((open) => !open)}
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                  aria-label={session?.user ? "Mon compte" : "Se connecter ou créer un compte"}
                  className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-black/5"
                >
                  <User className="h-5 w-5 text-black" aria-hidden="true" />
                </button>

                {accountOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-xl border border-black/10 bg-white shadow-xl"
                  >
                    {status === "loading" ? (
                      <p className="px-4 py-3 text-sm text-black/40">Chargement…</p>
                    ) : session?.user ? (
                      <>
                        <div className="border-b border-black/10 px-4 py-3">
                          <p className="truncate text-sm font-semibold text-black">
                            {session.user.name || "Client"}
                          </p>
                          <p className="truncate text-xs text-black/50">{session.user.email}</p>
                        </div>
                        <div className="p-1.5">
                          {isAdmin && (
                            <Link
                              href="/admin"
                              role="menuitem"
                              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-black/70 transition-colors hover:bg-black/5 hover:text-black"
                            >
                              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                              Administration
                            </Link>
                          )}
                          <Link
                            href="/account/orders"
                            role="menuitem"
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-black/70 transition-colors hover:bg-black/5 hover:text-black"
                          >
                            <Package className="h-4 w-4" aria-hidden="true" />
                            Mes commandes
                          </Link>
                          <button
                            type="button"
                            role="menuitem"
onClick={() => signOut({ callbackUrl: "/login" })}
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-black/70 transition-colors hover:bg-red-50 hover:text-red-700"
                          >
                            <LogOut className="h-4 w-4" aria-hidden="true" />
                            Se déconnecter
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-1.5">
                        <Link
                          href="/login"
                          role="menuitem"
                          className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700"
                        >
                          <LogOut className="h-4 w-4 rotate-180" aria-hidden="true" />
                          Se connecter
                        </Link>
                        <Link
                          href="/signup"
                          role="menuitem"
                          className="mt-1.5 flex items-center justify-center gap-2 rounded-lg border border-black/15 px-3 py-2.5 text-sm font-medium text-black transition-colors hover:bg-black/5"
                        >
                          Créer un compte
                          <ChevronDown className="h-4 w-4 -rotate-90" aria-hidden="true" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCart}
                aria-label={`Panier${cartCount > 0 ? `, ${cartCount} article${cartCount > 1 ? "s" : ""}` : " vide"}`}
                className="relative"
              >
                <ShoppingBag className="h-5 w-5 text-black" aria-hidden="true" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white"
                    aria-label={`${cartCount} article${cartCount > 1 ? "s" : ""} dans le panier`}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Button>

              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              >
                {mobileMenuOpen ? <X className="h-6 w-6 text-black" /> : <Menu className="h-6 w-6 text-black" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-30 md:hidden bg-white/95 backdrop-blur-sm animate-in slide-in-from-top-4"
          role="navigation"
          aria-label="Menu mobile"
        >
          <div className="flex h-full flex-col items-center justify-center gap-8 px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-2xl font-medium tracking-widest uppercase text-black/70 hover:text-black transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-4 w-full max-w-xs mt-8 pt-8 border-t border-black/10">
              {session?.user ? (
                <>
                  <p className="text-center text-sm text-black/50">
                    Connecté en tant que{" "}
                    <span className="font-semibold text-black">
                      {session.user.name || session.user.email}
                    </span>
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/account/orders" onClick={() => setMobileMenuOpen(false)}>
                      Mes commandes
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button className="w-full" asChild>
                      <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                        Administration
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Se déconnecter
                  </Button>
                </>
              ) : (
                <>
                  <Button className="w-full" asChild>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      Se connecter
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      Créer un compte
                    </Link>
                  </Button>
                </>
              )}
              <Button variant="premium" className="w-full" onClick={toggleCart}>
                <span className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Panier {cartCount > 0 ? `(${cartCount})` : ""}
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}