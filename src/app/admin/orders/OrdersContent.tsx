"use client";

import * as React from "react";
import { formatPrice } from "@/lib/utils";
import {
  Panel,
  PanelHeader,
  Badge,
  TableShell,
  Th,
  Td,
  EmptyState,
  Modal,
  TextArea,
  TextInput,
  Select,
  useAdminResource,
  adminRequest,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search, Trash2, Eye, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  productName: string;
  slug: string;
  size: string;
  productImage: string | null;
}

interface Order {
  id: string;
  status: string;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  notes: string | null;
  shippingName: string | null;
  shippingPhone: string | null;
  shippingAddress: string;
  createdAt: string;
  guestEmail: string | null;
  user: { id: string; name: string | null; email: string | null } | null;
  items: OrderItem[];
  athleteDiscount: { athleteId: string; athleteName: string; code: string } | null;
}

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusTone: Record<string, "neutral" | "green" | "yellow" | "blue" | "purple" | "red"> = {
  PENDING: "yellow",
  CONFIRMED: "blue",
  PROCESSING: "purple",
  SHIPPED: "blue",
  DELIVERED: "green",
  CANCELLED: "red",
};

export function OrdersContent() {
  const { data, loading, error, reload } = useAdminResource<{ orders: Order[] }>("/api/admin/orders");

  const [status, setStatus] = React.useState("ALL");
  const [query, setQuery] = React.useState("");
  const [viewing, setViewing] = React.useState<Order | null>(null);
  const [deleting, setDeleting] = React.useState<Order | null>(null);
  const [saving, setSaving] = React.useState(false);

  const orders = data?.orders ?? [];
  const filtered = orders.filter((order) => {
    const matchesStatus = status === "ALL" || order.status === status;
    const haystack = `${order.id} ${order.guestEmail ?? ""} ${order.user?.name ?? ""} ${
      order.user?.email ?? ""
    } ${order.shippingName ?? ""}`.toLowerCase();
    return matchesStatus && (!query || haystack.includes(query.toLowerCase()));
  });

  const updateStatus = async (order: Order, nextStatus: string) => {
    setSaving(true);
    try {
      await adminRequest(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      toast({ title: `Order marked ${nextStatus.toLowerCase()}`, variant: "success" });
      setViewing(null);
      reload();
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveNotes = async (order: Order, notes: string) => {
    setSaving(true);
    try {
      await adminRequest(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        body: JSON.stringify({ notes }),
      });
      toast({ title: "Notes saved", variant: "success" });
      setViewing(null);
      reload();
    } catch (err) {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await adminRequest(`/api/admin/orders/${deleting.id}`, { method: "DELETE" });
      toast({ title: "Order deleted and stock restored", variant: "success" });
      setDeleting(null);
      reload();
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-purple-950">Orders</h1>
          <p className="mt-1 text-sm text-purple-950/50">
            {orders.length} order{orders.length === 1 ? "" : "s"} total
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Panel>
        <PanelHeader
          title="All orders"
          action={
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-950/35"
                  aria-hidden="true"
                />
                <TextInput
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search orders"
                  aria-label="Search orders"
                  className="pl-9 sm:w-56"
                />
              </div>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                aria-label="Filter by status"
                className="w-auto"
              >
                <option value="ALL">All statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </div>
          }
        />

        {loading ? (
          <div className="p-10 text-center text-sm text-purple-950/40">Loading…</div>
        ) : !filtered.length ? (
          <EmptyState
            title={orders.length ? "No matching orders" : "No orders yet"}
            description={
              orders.length ? "Try a different search or status." : "Orders will show up here automatically."
            }
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
                <Th>Payment</Th>
                <Th>Status</Th>
                <Th>Date</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-purple-50/60">
                  <Td className="font-mono text-xs text-purple-950">#{order.id.slice(-8).toUpperCase()}</Td>
                  <Td>
                    <span className="block font-medium text-purple-950">
                      {order.user?.name || order.shippingName || "Guest"}
                    </span>
                    <span className="block text-xs text-purple-950/45">
                      {order.user?.email || order.guestEmail || "—"}
                    </span>
                  </Td>
                  <Td className="text-xs">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} unit(s)
                  </Td>
                  <Td className="font-semibold text-purple-950">
                    {formatPrice(order.total)}
                    {order.athleteDiscount && (
                      <span className="ml-2 inline-block">
                        <Badge tone="green" className="text-[10px]">
                          Athlete: {order.athleteDiscount.athleteName}
                        </Badge>
                      </span>
                    )}
                  </Td>
                  <Td>
                    <Badge tone={order.paymentMethod === "COD" ? "yellow" : "blue"}>
                      {order.paymentMethod}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge tone={statusTone[order.status] ?? "neutral"}>{order.status}</Badge>
                  </Td>
                  <Td className="whitespace-nowrap text-xs text-purple-950/45">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setViewing(order)}
                        aria-label="View order"
                        className="rounded-lg p-2 text-purple-950/50 transition-colors hover:bg-purple-600/10 hover:text-purple-700"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(order)}
                        aria-label="Delete order"
                        className="rounded-lg p-2 text-purple-950/50 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        )}
      </Panel>

      {viewing && (
        <OrderDetailModal
          order={viewing}
          saving={saving}
          onClose={() => setViewing(null)}
          onStatus={(next) => updateStatus(viewing, next)}
          onNotes={(notes) => saveNotes(viewing, notes)}
        />
      )}

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete order"
        description="Stock will be restored"
        size="sm"
        footer={
          <>
            <Button variant="light" onClick={() => setDeleting(null)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} loading={saving}>
              Delete order
            </Button>
          </>
        }
      >
        <p className="text-sm text-purple-950/70">
          Delete order <span className="font-mono">#{deleting?.id.slice(-8).toUpperCase()}</span>? Items
          will be returned to stock.
        </p>
      </Modal>
    </div>
  );
}

function OrderDetailModal({
  order,
  saving,
  onClose,
  onStatus,
  onNotes,
}: {
  order: Order;
  saving: boolean;
  onClose: () => void;
  onStatus: (status: string) => void;
  onNotes: (notes: string) => void;
}) {
  const [notes, setNotes] = React.useState(order.notes ?? "");

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={`Order #${order.id.slice(-8).toUpperCase()}`}
      description={new Date(order.createdAt).toLocaleString()}
      footer={
        <>
          <Button variant="light" onClick={onClose} disabled={saving}>
            Close
          </Button>
          <Button variant="light" onClick={() => onNotes(notes)} disabled={saving}>
            Save notes
          </Button>
          {order.status === "CANCELLED" ? (
            <Button variant="admin" onClick={() => onStatus("CONFIRMED")} loading={saving}>
              Restore order
            </Button>
          ) : (
            <Select
              value={order.status}
              onChange={(e) => onStatus(e.target.value)}
              disabled={saving}
              aria-label="Update order status"
              className="w-auto"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  Mark as {s.toLowerCase()}
                </option>
              ))}
            </Select>
          )}
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-purple-200/70 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-950/50">Customer</p>
            <p className="mt-2 text-sm font-medium text-purple-950">
              {order.user?.name || order.shippingName || "Guest"}
            </p>
            <p className="text-sm text-purple-950/50">{order.user?.email || order.guestEmail || "—"}</p>
            {order.shippingPhone && <p className="text-sm text-purple-950/50">{order.shippingPhone}</p>}
          </div>
          <div className="rounded-lg border border-purple-200/70 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-950/50">
              Shipping address
            </p>
            <p className="mt-2 whitespace-pre-line text-sm text-purple-950/70">{order.shippingAddress}</p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-purple-950/50">Items</p>
          <ul className="divide-y divide-purple-100 rounded-lg border border-purple-200/70">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 p-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-purple-200/70 bg-black/[0.03]">
                  {item.productImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.productImage} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-purple-950">{item.productName}</p>
                  <p className="text-xs text-purple-950/45">
                    Size {item.size} · Qty {item.quantity} · {formatPrice(item.price)} each
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-purple-950">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 rounded-lg border border-purple-200/70 p-4 text-sm">
          <div className="flex justify-between text-purple-950/60">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-purple-600">
              <span>
                Discount
                {order.athleteDiscount && (
                  <span className="ml-2 text-xs font-normal text-green-700">
                    (Athlete: {order.athleteDiscount.athleteName} — {order.athleteDiscount.code})
                  </span>
                )}
              </span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-purple-950/60">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between border-t border-purple-200/70 pt-2 text-base font-bold text-purple-950">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div>
          <label
            htmlFor="order-notes"
            className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-purple-950/60"
          >
            Internal notes
          </label>
          <TextArea
            id="order-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add a note for your team"
          />
        </div>
      </div>
    </Modal>
  );
}
