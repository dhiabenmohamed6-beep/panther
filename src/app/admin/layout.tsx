"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Boxes,
  Users,
  ShoppingBag,
  Settings,
  LogOut,
  TicketPercent,
  Ruler,
  MessageSquareDashed,
  ImagePlus,
  ExternalLink,
  Menu,
  X,
  Search,
  MessageSquare,
} from "lucide-react";

const navigation = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/stock", label: "Stock", icon: Boxes },
  { href: "/admin/coupons", label: "Discounts", icon: TicketPercent },
  { href: "/admin/athletes", label: "Athletes", icon: Users },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/size-guide", label: "Size Guide", icon: Ruler },
  { href: "/admin/marquee", label: "Marquee", icon: MessageSquareDashed },
  { href: "/admin/upload", label: "Media", icon: ImagePlus },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const groups: { label: string; hrefs: string[] }[] = [
  { label: "Overview", hrefs: ["/admin"] },
  {
    label: "Store",
    hrefs: ["/admin/orders", "/admin/products", "/admin/stock", "/admin/coupons"],
  },
  {
    label: "Content",
    hrefs: ["/admin/athletes", "/admin/size-guide", "/admin/marquee", "/admin/upload"],
  },
  { label: "People", hrefs: ["/admin/customers", "/admin/messages"] },
  { label: "System", hrefs: ["/admin/settings"] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    setSearchQuery("");
  }, [pathname]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const term = searchQuery.trim();
    if (!term) return;
    router.push(`/admin/products?q=${encodeURIComponent(term)}`);
  };

  const currentLabel =
    navigation.find((item) => pathname === item.href || pathname.startsWith(item.href + "/"))?.label ??
    "Admin";

  const navLinks = (
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5" aria-label="Admin navigation">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-purple-200/60">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {group.hrefs.map((href) => {
              const item = navigation.find((entry) => entry.href === href);
              if (!item) return null;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-purple-500 text-white shadow-sm shadow-black/40"
                      : "text-purple-100/75 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  const sidebarFooter = (
    <div className="space-y-1 border-t border-white/10 p-3">
      <Link
        href="/"
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-purple-100/75 transition-colors hover:bg-white/10 hover:text-white"
      >
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
        View Store
      </Link>
      <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-500 text-sm font-bold text-white">
          {(session?.user?.name || session?.user?.email || "A").charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-white">
            {session?.user?.name || "Admin"}
          </p>
          <p className="truncate text-[11px] text-purple-200/70">{session?.user?.email}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-purple-100/70 transition-colors hover:bg-rose-500/20 hover:text-rose-200"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Sign out
      </button>
    </div>
  );

  const sidebarBrand = (
    <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
      <Link href="/admin" className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
          <img src="/images/logo.png" alt="" className="h-6 w-auto" aria-hidden="true" />
        </span>
        <span className="flex flex-col leading-none">
          <span className="text-sm font-bold tracking-[0.18em] text-white">PANTHER</span>
          <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.16em] text-purple-300">
            Admin
          </span>
        </span>
      </Link>
      <button
        type="button"
        onClick={() => setMobileOpen(false)}
        aria-label="Close menu"
        className="ml-auto rounded-lg p-1.5 text-purple-100/70 hover:bg-white/10 lg:hidden"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-purple-50/40">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col bg-gradient-to-b from-[#2E0A4E] via-[#1D0533] to-[#10021C] lg:flex">
        {sidebarBrand}
        {navLinks}
        {sidebarFooter}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-purple-950/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-64 flex-col bg-gradient-to-b from-[#2E0A4E] via-[#1D0533] to-[#10021C]">
            {sidebarBrand}
            {navLinks}
            {sidebarFooter}
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 border-b border-purple-200/60 bg-white/90 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="rounded-lg p-2 text-purple-800 transition-colors hover:bg-purple-100 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-sm font-bold uppercase tracking-widest text-purple-950 sm:text-base">
                  {currentLabel}
                </h1>
                <p className="hidden text-[11px] text-purple-800/60 sm:block">
                  PANTHER store administration
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <form role="search" onSubmit={handleSearchSubmit} className="relative hidden sm:block">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-700/40"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search store"
                  aria-label="Search store"
                  className="h-9 w-56 rounded-lg border border-purple-200 bg-purple-50/60 pl-9 pr-3 text-sm text-purple-950 placeholder:text-purple-800/40 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </form>
              <Link
                href="/"
                className="hidden rounded-lg border border-purple-200 px-3 py-2 text-xs font-medium uppercase tracking-wider text-purple-800 transition-colors hover:bg-purple-50 sm:block"
              >
                View Store
              </Link>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}