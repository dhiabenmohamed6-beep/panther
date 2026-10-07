"use client";

import * as React from "react";
import {
  Panel,
  PanelHeader,
  StatCard,
  TableShell,
  Th,
  Td,
  Badge,
  useAdminResource,
  adminRequest,
  TextInput,
} from "@/components/admin/ui";
import { Boxes, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Variant {
  id: string;
  size: string;
  sku: string;
  stock: number;
  price: number | null;
  productId: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  status: string;
  variants: Variant[];
}

export function StockContent() {
  const { data, loading, error, reload } = useAdminResource<{ products: Product[] }>("/api/admin/stock");
  const [drafts, setDrafts] = React.useState<Record<string, number>>({});
  const [saving, setSaving] = React.useState<string | null>(null);

  const products = data?.products ?? [];
  const totalUnits = products.reduce(
    (sum, product) => sum + product.variants.reduce((s, v) => s + (drafts[v.id] ?? v.stock), 0),
    0
  );
  const lowCount = products.reduce(
    (sum, product) =>
      sum + product.variants.filter((v) => (drafts[v.id] ?? v.stock) > 0 && (drafts[v.id] ?? v.stock) <= 5)
        .length,
    0
  );
  const outCount = products.reduce(
    (sum, product) => sum + product.variants.filter((v) => (drafts[v.id] ?? v.stock) <= 0).length,
    0
  );

  const saveVariant = async (variant: Variant) => {
    setSaving(variant.id);
    try {
      await adminRequest(`/api/admin/variants/${variant.id}`, {
        method: "PATCH",
        body: JSON.stringify({ stock: drafts[variant.id] ?? variant.stock }),
      });
      toast({ title: `${variant.size} stock updated`, variant: "success" });
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[variant.id];
        return next;
      });
      reload();
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-purple-950">Stock</h1>
        <p className="mt-1 text-sm text-purple-950/50">Adjust inventory levels per size</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total units" value={loading ? "—" : totalUnits} icon={Boxes} />
        <StatCard
          label="Low stock"
          value={loading ? "—" : lowCount}
          tone={lowCount > 0 ? "warning" : "neutral"}
        />
        <StatCard
          label="Sold out"
          value={loading ? "—" : outCount}
          tone={outCount > 0 ? "danger" : "neutral"}
        />
      </div>

      {loading ? (
        <div className="p-10 text-center text-sm text-purple-950/40">Loading…</div>
      ) : (
        products.map((product) => (
          <Panel key={product.id}>
            <PanelHeader
              title={product.name}
              description={product.slug}
              action={
                <Badge tone={product.status === "PUBLISHED" ? "green" : "neutral"}>
                  {product.status}
                </Badge>
              }
            />
            <TableShell className="min-w-0">
              <thead>
                <tr>
                  <Th>Size</Th>
                  <Th>SKU</Th>
                  <Th>Current stock</Th>
                  <Th>New quantity</Th>
                  <Th>Status</Th>
                  <Th />
                </tr>
              </thead>
              <tbody>
                {product.variants.map((variant) => {
                  const value = drafts[variant.id] ?? variant.stock;
                  const dirty = drafts[variant.id] !== undefined && drafts[variant.id] !== variant.stock;
                  return (
                    <tr key={variant.id}>
                      <Td className="font-semibold text-purple-950 uppercase">{variant.size}</Td>
                      <Td className="font-mono text-xs">{variant.sku}</Td>
                      <Td>{variant.stock}</Td>
                      <Td>
                        <TextInput
                          type="number"
                          min="0"
                          value={value}
                          onChange={(e) =>
                            setDrafts((prev) => ({ ...prev, [variant.id]: Number(e.target.value) }))
                          }
                          aria-label={`New stock for size ${variant.size}`}
                          className="w-28"
                        />
                      </Td>
                      <Td>
                        {value <= 0 ? (
                          <Badge tone="red">Sold out</Badge>
                        ) : value <= 5 ? (
                          <Badge tone="yellow">Low</Badge>
                        ) : (
                          <Badge tone="green">In stock</Badge>
                        )}
                      </Td>
                      <Td>
                        <button
                          type="button"
                          disabled={!dirty || saving === variant.id}
                          onClick={() => saveVariant(variant)}
                          className="inline-flex items-center gap-1.5 rounded-md bg-purple-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Save className="h-3.5 w-3.5" aria-hidden="true" />
                          Save
                        </button>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </TableShell>
          </Panel>
        ))
      )}
    </div>
  );
}
