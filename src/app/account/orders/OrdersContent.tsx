"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AccountShell } from "@/components/account-shell";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Package, Loader2, ChevronDown } from "lucide-react";

interface OrderItem {
  id: string;
  productName: string;
  productImage: string | null;
  size: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: string;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-700 border-yellow-500/30",
  PAID: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  SHIPPED: "bg-purple-500/10 text-purple-700 border-purple-500/30",
  DELIVERED: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  CANCELLED: "bg-red-500/10 text-red-700 border-red-500/30",
  REFUNDED: "bg-black/5 text-black/60 border-black/10",
};

const FALLBACK_IMAGE = "/images/list1.png";

export function OrdersContent() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/account/orders", { cache: "no-store" });
        if (!res.ok) throw new Error("Could not load your orders");
        const json = await res.json();
        if (active) setOrders(json.orders ?? []);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Could not load your orders");
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <AccountShell
      title="My Orders"
      description="Track your order history and review past purchases."
    >
      {isLoading ? (
        <div className="flex items-center gap-3 rounded-lg border border-black/10 bg-white p-6 text-black/50">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          Loading your orders…
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6 text-red-700">{error}</div>
      ) : orders.length === 0 ? (
        <div className="rounded-lg border border-black/10 bg-white overflow-hidden">
          <div className="p-10 text-center text-black/50">
            <Package className="h-12 w-12 mx-auto mb-4 text-black/20" aria-hidden="true" />
            <p className="mb-4">No orders yet</p>
            <Button asChild variant="outline">
              <Link href="/shop">START SHOPPING</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isOpen = expanded === order.id;
            const statusClass = STATUS_STYLES[order.status] ?? "bg-black/5 text-black/60 border-black/10";
            return (
              <article key={order.id} className="overflow-hidden rounded-lg border border-black/10 bg-white">
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left hover:bg-black/[0.02] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="truncate font-mono text-sm text-black">{order.id}</p>
                    <p className="mt-1 text-xs text-black/50">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClass}`}>
                      {order.status}
                    </span>
                    <span className="hidden text-sm font-bold text-black sm:inline">
                      {formatPrice(order.total)}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-black/40 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-black/10 p-5">
                    <ul className="space-y-3">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex items-center gap-4">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-black/5">
                            <Image
                              src={item.productImage || FALLBACK_IMAGE}
                              alt={item.productName}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-black">{item.productName}</p>
                            <p className="text-xs text-black/50">
                              Size {item.size} · Qty {item.quantity}
                            </p>
                          </div>
                          <span className="shrink-0 text-sm text-black/70">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <dl className="mt-5 space-y-2 border-t border-black/10 pt-4 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-black/50">Subtotal</dt>
                        <dd className="text-black/70">{formatPrice(order.subtotal)}</dd>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between">
                          <dt className="text-black/50">Discount</dt>
                          <dd className="text-emerald-600">-{formatPrice(order.discount)}</dd>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <dt className="text-black/50">Shipping</dt>
                        <dd className="text-black/70">
                          {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
                        </dd>
                      </div>
                      <div className="flex justify-between border-t border-black/10 pt-2 font-bold">
                        <dt>Total</dt>
                        <dd>{formatPrice(order.total)}</dd>
                      </div>
                      <div className="flex justify-between pt-2 text-black/50">
                        <dt>Payment</dt>
                        <dd>{order.paymentMethod === "COD" ? "Cash on delivery" : order.paymentMethod}</dd>
                      </div>
                      <div className="pt-2 text-black/50">
                        <dt className="font-medium text-black/70">Shipping address</dt>
                        <dd className="mt-1 whitespace-pre-line">{order.shippingAddress}</dd>
                      </div>
                    </dl>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </AccountShell>
  );
}