"use client";

import * as React from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import {
  Panel,
  PanelHeader,
  StatCard,
  Badge,
  TableShell,
  Th,
  Td,
  EmptyState,
  useAdminResource,
} from "@/components/admin/ui";
import {
  RevenueAreaChart,
  OrdersBarChart,
  StatusDonutChart,
  RangePicker,
  type AnalyticsPoint,
} from "@/components/admin/charts";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  Boxes,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  TicketPercent,
} from "lucide-react";

interface Stats {
  revenue: number;
  totalOrders: number;
  unitsSold: number;
  totalCustomers: number;
  totalProducts: number;
  totalStock: number;
  lowStock: number;
  outOfStock: number;
  pendingOrders: number;
  orderChange: number;
}

interface RecentOrder {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  guestEmail: string | null;
  user: { name: string | null; email: string | null } | null;
  items: { id: string; quantity: number; productName: string; size: string }[];
}

interface TopProduct {
  productName: string;
  _sum: { quantity: number | null; price: number | null };
}

const statusTone: Record<string, "neutral" | "green" | "yellow" | "blue" | "purple" | "red"> = {
  PENDING: "yellow",
  CONFIRMED: "blue",
  PROCESSING: "purple",
  SHIPPED: "blue",
  DELIVERED: "green",
  CANCELLED: "red",
};

export function DashboardContent() {
  const { data, loading, error, reload } = useAdminResource<{ stats: Stats; recentOrders: RecentOrder[]; topProducts: TopProduct[] }>(
    "/api/admin/stats"
  );

  const [range, setRange] = React.useState(30);
  const [analytics, setAnalytics] = React.useState<AnalyticsPoint[] | null>(null);
  const [statusBreakdown, setStatusBreakdown] = React.useState<{ label: string; value: number }[]>([]);

  React.useEffect(() => {
    let active = true;
    setAnalytics(null);

    (async () => {
      try {
        const res = await fetch(`/api/admin/analytics?range=${range}`, { cache: "no-store" });
        const json = await res.json();
        if (active && res.ok && Array.isArray(json.series)) {
          setAnalytics(json.series);
        }
      } catch {
        if (active) setAnalytics([]);
      }
    })();

    return () => {
      active = false;
    };
  }, [range]);

  React.useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await fetch("/api/admin/orders", { cache: "no-store" });
        const json = await res.json();
        if (!active || !res.ok || !Array.isArray(json.orders)) return;

        const counts = new Map<string, number>();
        for (const order of json.orders as { status: string }[]) {
          counts.set(order.status, (counts.get(order.status) ?? 0) + 1);
        }
        setStatusBreakdown(
          Array.from(counts.entries())
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value)
        );
      } catch {
        if (active) setStatusBreakdown([]);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const stats = data?.stats;
  const changePositive = (stats?.orderChange ?? 0) >= 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="hidden h-12 w-12 items-center justify-center rounded-xl border border-purple-200 bg-white lg:flex">
            <img src="/images/logo.png" alt="" className="h-8 w-auto" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-purple-950">Dashboard</h1>
            <p className="mt-1 text-sm text-purple-950/50">Live overview of your store</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <RangePicker value={range} onChange={setRange} />
          <Link
            href="/admin/products"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-purple-200 bg-white px-4 text-sm font-medium text-purple-950 transition-colors hover:bg-purple-50"
          >
            <Package className="h-4 w-4" aria-hidden="true" />
            Products
          </Link>
          <Link
            href="/admin/products?new=1"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-purple-700 px-4 text-sm font-medium text-white transition-colors hover:bg-purple-800"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Product
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        {analytics ? (
          <>
            <RevenueAreaChart data={analytics} />
            <OrdersBarChart data={analytics} />
          </>
        ) : (
          <>
            <Panel className="p-5">
              <div className="flex h-72 items-center justify-center text-sm text-purple-500">
                Loading revenue…
              </div>
            </Panel>
            <Panel className="p-5">
              <div className="flex h-72 items-center justify-center text-sm text-purple-500">
                Loading orders…
              </div>
            </Panel>
          </>
        )}
      </div>

      <StatusDonutChart data={statusBreakdown} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Revenue"
          value={loading ? "—" : formatPrice(stats?.revenue ?? 0)}
          hint={stats ? `Last 30 days: ${stats.orderChange >= 0 ? "+" : ""}${stats.orderChange}% orders` : undefined}
          icon={DollarSign}
        />
        <StatCard
          label="Orders"
          value={loading ? "—" : (stats?.totalOrders ?? 0)}
          hint={`${stats?.pendingOrders ?? 0} awaiting fulfilment`}
          icon={ShoppingBag}
        />
        <StatCard label="Units sold" value={loading ? "—" : (stats?.unitsSold ?? 0)} icon={Package} />
        <StatCard
          label="Customers"
          value={loading ? "—" : (stats?.totalCustomers ?? 0)}
          hint={`${stats?.totalProducts ?? 0} products live`}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Units in stock" value={loading ? "—" : (stats?.totalStock ?? 0)} icon={Boxes} />
        <StatCard
          label="Low stock"
          value={loading ? "—" : (stats?.lowStock ?? 0)}
          hint="5 units or fewer"
          tone={(stats?.lowStock ?? 0) > 0 ? "warning" : "neutral"}
          icon={AlertTriangle}
        />
        <StatCard
          label="Out of stock"
          value={loading ? "—" : (stats?.outOfStock ?? 0)}
          tone={(stats?.outOfStock ?? 0) > 0 ? "danger" : "neutral"}
          icon={AlertTriangle}
        />
        <StatCard
          label="Order trend"
          value={
            loading ? (
              "—"
            ) : (
              <span className="inline-flex items-center gap-1.5">
                {changePositive ? (
                  <TrendingUp className="h-5 w-5 text-purple-600" aria-hidden="true" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" aria-hidden="true" />
                )}
                {stats?.orderChange}%
              </span>
            )
          }
          hint="vs previous 30 days"
          tone={changePositive ? "positive" : "danger"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader
            title="Recent orders"
            description="Latest activity across the store"
            action={
              <Link
                href="/admin/orders"
                className="text-xs font-semibold uppercase tracking-wider text-purple-600 hover:text-purple-700"
              >
                View all
              </Link>
            }
          />
          {loading ? (
            <div className="p-10 text-center text-sm text-purple-950/40">Loading…</div>
          ) : !data?.recentOrders.length ? (
            <EmptyState
              title="No orders yet"
              description="Orders will appear here as soon as customers check out."
              icon={ShoppingBag}
            />
          ) : (
            <TableShell>
              <thead>
                <tr>
                  <Th>Order</Th>
                  <Th>Customer</Th>
                  <Th>Items</Th>
                  <Th>Total</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-purple-50/60">
                    <Td className="font-mono text-xs text-purple-950">#{order.id.slice(-8).toUpperCase()}</Td>
                    <Td>
                      <span className="block font-medium text-purple-950">
                        {order.user?.name || order.guestEmail || "Guest"}
                      </span>
                      <span className="block text-xs text-purple-950/45">
                        {order.user?.email || order.guestEmail || "—"}
                      </span>
                    </Td>
                    <Td className="text-xs">
                      {order.items.length} item{order.items.length === 1 ? "" : "s"}
                    </Td>
                    <Td className="font-semibold text-purple-950">{formatPrice(order.total)}</Td>
                    <Td>
                      <Badge tone={statusTone[order.status] ?? "neutral"}>{order.status}</Badge>
                    </Td>
                    <Td className="whitespace-nowrap text-xs text-purple-950/45">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
          )}
        </Panel>

        <div className="space-y-6">
          <Panel>
            <PanelHeader title="Top products" description="By units sold" />
            {!loading && !data?.topProducts.length ? (
              <EmptyState title="No sales yet" icon={Package} />
            ) : (
              <ul className="divide-y divide-purple-100">
                {data?.topProducts.map((product, index) => (
                  <li key={product.productName} className="flex items-center gap-3 px-5 py-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-600/10 text-xs font-bold text-purple-700">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-purple-950">{product.productName}</span>
                    <span className="shrink-0 text-sm font-semibold text-purple-950">
                      {product._sum.quantity ?? 0}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel>
            <PanelHeader title="Quick actions" />
            <div className="space-y-2 p-4">
              {[
                { href: "/admin/products?new=1", label: "Add new product", icon: Plus },
                { href: "/admin/orders", label: "Process orders", icon: ShoppingBag },
                { href: "/admin/stock", label: "Manage stock", icon: Boxes },
                { href: "/admin/coupons", label: "Create discount code", icon: TicketPercent },
                { href: "/admin/athletes", label: "Manage athletes", icon: Users },
                { href: "/admin/settings", label: "Store settings", icon: SettingsIcon },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 rounded-lg border border-purple-200/70 px-3 py-2.5 text-sm text-purple-950/70 transition-colors hover:border-purple-300 hover:bg-purple-50 hover:text-purple-950"
                >
                  <action.icon className="h-4 w-4 text-purple-600" aria-hidden="true" />
                  {action.label}
                </Link>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h.01a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.01a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"
      />
    </svg>
  );
}
