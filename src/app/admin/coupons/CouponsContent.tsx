"use client";

import * as React from "react";
import {
  Panel,
  PanelHeader,
  Badge,
  TableShell,
  Th,
  Td,
  EmptyState,
  Modal,
  Field,
  TextInput,
  Select,
  Toggle,
  useAdminResource,
  adminRequest,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Plus, TicketPercent, Trash2, Power } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export function CouponsContent() {
  const { data, loading, error, reload } = useAdminResource<{ coupons: Coupon[] }>("/api/admin/coupons");
  const [creating, setCreating] = React.useState(false);
  const [deleting, setDeleting] = React.useState<Coupon | null>(null);
  const [saving, setSaving] = React.useState(false);

  const coupons = data?.coupons ?? [];

  const toggleActive = async (coupon: Coupon) => {
    try {
      await adminRequest(`/api/admin/coupons/${coupon.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !coupon.active }),
      });
      reload();
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await adminRequest(`/api/admin/coupons/${deleting.id}`, { method: "DELETE" });
      toast({ title: "Discount code deleted", variant: "success" });
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
          <h1 className="text-2xl font-bold tracking-tight text-purple-950">Discounts</h1>
          <p className="mt-1 text-sm text-purple-950/50">Promo codes and percentage-off campaigns</p>
        </div>
        <Button variant="light" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          New code
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Panel>
        <PanelHeader title="Discount codes" description={`${coupons.length} code(s)`} />
        {loading ? (
          <div className="p-10 text-center text-sm text-purple-950/40">Loading…</div>
        ) : !coupons.length ? (
          <EmptyState
            title="No discount codes"
            description="Create a code to run a promotion."
            icon={TicketPercent}
            action={
              <Button variant="light" onClick={() => setCreating(true)}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                New code
              </Button>
            }
          />
        ) : (
          <TableShell>
            <thead>
              <tr>
                <Th>Code</Th>
                <Th>Type</Th>
                <Th>Value</Th>
                <Th>Min order</Th>
                <Th>Used</Th>
                <Th>Expires</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="transition-colors hover:bg-purple-50/60">
                  <Td className="font-mono font-semibold text-purple-950">{coupon.code}</Td>
                  <Td>
                    <Badge tone={coupon.type === "PERCENT" ? "purple" : "blue"}>{coupon.type}</Badge>
                  </Td>
                  <Td className="font-semibold text-purple-950">
                    {coupon.type === "PERCENT" ? `${coupon.value}%` : formatPrice(coupon.value)}
                  </Td>
                  <Td>{formatPrice(coupon.minOrder)}</Td>
                  <Td>
                    {coupon.usedCount}
                    {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                  </Td>
                  <Td className="whitespace-nowrap text-xs text-purple-950/45">
                    {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "No expiry"}
                  </Td>
                  <Td>
                    <Badge tone={coupon.active ? "green" : "neutral"}>
                      {coupon.active ? "Active" : "Paused"}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => toggleActive(coupon)}
                        aria-label={coupon.active ? "Pause code" : "Activate code"}
                        className="rounded-lg p-2 text-purple-950/50 transition-colors hover:bg-purple-600/10 hover:text-purple-700"
                      >
                        <Power className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(coupon)}
                        aria-label={`Delete ${coupon.code}`}
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

      {creating && (
        <CouponModal
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            reload();
          }}
        />
      )}

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete discount code"
        size="sm"
        footer={
          <>
            <Button variant="light" onClick={() => setDeleting(null)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} loading={saving}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-purple-950/70">
          Delete code <span className="font-mono font-semibold">{deleting?.code}</span>?
        </p>
      </Modal>
    </div>
  );
}

function CouponModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [code, setCode] = React.useState("");
  const [type, setType] = React.useState("PERCENT");
  const [value, setValue] = React.useState("");
  const [minOrder, setMinOrder] = React.useState("0");
  const [maxDiscount, setMaxDiscount] = React.useState("");
  const [usageLimit, setUsageLimit] = React.useState("");
  const [expiresAt, setExpiresAt] = React.useState("");
  const [active, setActive] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    if (!code.trim()) {
      toast({ title: "Code is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await adminRequest("/api/admin/coupons", {
        method: "POST",
        body: JSON.stringify({
          code,
          type,
          value: Number(value),
          minOrder: Number(minOrder) || 0,
          maxDiscount: maxDiscount ? Number(maxDiscount) : null,
          usageLimit: usageLimit ? Number(usageLimit) : null,
          expiresAt: expiresAt || null,
          active,
        }),
      });
      toast({ title: "Discount code created", variant: "success" });
      onSaved();
    } catch (err) {
      toast({
        title: "Create failed",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="New discount code"
      description="Customers enter this code at checkout"
      footer={
        <>
          <Button variant="light" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="admin" onClick={handleSave} loading={saving}>
            Create code
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Code" htmlFor="coupon-code" className="sm:col-span-2">
          <TextInput
            id="coupon-code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="PANTHER20"
            className="font-mono uppercase"
          />
        </Field>

        <Field label="Type" htmlFor="coupon-type">
          <Select id="coupon-type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="PERCENT">Percentage off</option>
            <option value="FIXED">Fixed amount off</option>
          </Select>
        </Field>

        <Field label={type === "PERCENT" ? "Discount (%)" : "Amount (DT)"} htmlFor="coupon-value">
          <TextInput
            id="coupon-value"
            type="number"
            min="0"
            step={type === "PERCENT" ? "1" : "0.01"}
            max={type === "PERCENT" ? "100" : undefined}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={type === "PERCENT" ? "20" : "15"}
          />
        </Field>

        <Field label="Minimum order (DT)" htmlFor="coupon-min">
          <TextInput
            id="coupon-min"
            type="number"
            min="0"
            step="0.01"
            value={minOrder}
            onChange={(e) => setMinOrder(e.target.value)}
          />
        </Field>

        <Field label="Max discount (DT)" htmlFor="coupon-max" hint="Optional cap for percentage codes">
          <TextInput
            id="coupon-max"
            type="number"
            min="0"
            step="0.01"
            value={maxDiscount}
            onChange={(e) => setMaxDiscount(e.target.value)}
            placeholder="No cap"
          />
        </Field>

        <Field label="Usage limit" htmlFor="coupon-limit" hint="Blank = unlimited">
          <TextInput
            id="coupon-limit"
            type="number"
            min="0"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
            placeholder="Unlimited"
          />
        </Field>

        <Field label="Expires on" htmlFor="coupon-expiry">
          <TextInput
            id="coupon-expiry"
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </Field>

        <div className="sm:col-span-2">
          <Toggle
            id="coupon-active"
            checked={active}
            onChange={setActive}
            label="Active"
            hint="Customers can redeem this code right away"
          />
        </div>
      </div>
    </Modal>
  );
}
