"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { clearStorefrontCache } from "@/hooks/use-storefront";
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
  TextArea,
  Select,
  Toggle,
  useAdminResource,
  adminRequest,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Package, Search, Upload, X, ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Variant {
  id: string;
  size: string;
  sku: string;
  stock: number;
  price: number | null;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  position: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  discountPercent: number;
  discountActive: boolean;
  status: string;
  featured: boolean;
  images: ProductImage[];
  variants: Variant[];
}

interface FormState {
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAtPrice: string;
  discountPercent: string;
  discountActive: boolean;
  status: string;
  featured: boolean;
}

const emptyForm: FormState = {
  name: "",
  slug: "",
  description: "",
  price: "",
  compareAtPrice: "",
  discountPercent: "",
  discountActive: false,
  status: "DRAFT",
  featured: false,
};

const statusTone: Record<string, "neutral" | "green" | "yellow" | "blue" | "purple" | "red"> = {
  PUBLISHED: "green",
  DRAFT: "neutral",
  ARCHIVED: "yellow",
};

export function ProductsContent() {
  const searchParams = useSearchParams();
  const { data, loading, error, reload } = useAdminResource<{ products: Product[] }>("/api/admin/products");

  const [query, setQuery] = React.useState(() => searchParams.get("q") ?? "");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [editing, setEditing] = React.useState<Product | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [deleting, setDeleting] = React.useState<Product | null>(null);
  const [saving, setSaving] = React.useState(false);

  const products = data?.products ?? [];
  const filtered = products.filter((product) => {
    const matchesQuery =
      !query ||
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.slug.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || product.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  React.useEffect(() => {
    if (searchParams.get("new") === "1") setCreating(true);
  }, [searchParams]);

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await adminRequest(`/api/admin/products/${deleting.id}`, { method: "DELETE" });
      toast({ title: "Product deleted", variant: "success" });
      clearStorefrontCache();
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
          <h1 className="text-2xl font-bold tracking-tight text-purple-950">Products</h1>
          <p className="mt-1 text-sm text-purple-950/50">
            {products.length} product{products.length === 1 ? "" : "s"} in the catalog
          </p>
        </div>
        <Button variant="light" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Product
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Panel>
        <PanelHeader
          title="Catalog"
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
                  placeholder="Search products"
                  aria-label="Search products"
                  className="pl-9 sm:w-56"
                />
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
                className="w-auto"
              >
                <option value="ALL">All statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </Select>
            </div>
          }
        />

        {loading ? (
          <div className="p-10 text-center text-sm text-purple-950/40">Loading…</div>
        ) : !filtered.length ? (
          <EmptyState
            title={products.length ? "No matching products" : "No products yet"}
            description={
              products.length
                ? "Try a different search or status filter."
                : "Add your first product to start selling."
            }
            icon={Package}
            action={
              <Button variant="light" onClick={() => setCreating(true)}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add Product
              </Button>
            }
          />
        ) : (
          <TableShell>
            <thead>
              <tr>
                <Th>Product</Th>
                <Th>Price</Th>
                <Th>Discount</Th>
                <Th>Stock</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const stock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
                const effective =
                  product.discountActive && product.discountPercent > 0
                    ? product.price * (1 - product.discountPercent / 100)
                    : product.price;

                return (
                  <tr key={product.id} className="transition-colors hover:bg-purple-50/60">
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-purple-200/70 bg-black/[0.03]">
                          {product.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.images[0].url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ImageIcon className="h-4 w-4 text-purple-950/20" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-purple-950">{product.name}</p>
                          <p className="truncate text-xs text-purple-950/45">{product.slug}</p>
                          {product.featured && (
                            <Badge tone="purple" className="mt-1">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <p className="font-semibold text-purple-950">{formatPrice(effective)}</p>
                      {product.discountActive && product.discountPercent > 0 && (
                        <p className="text-xs text-purple-950/40 line-through">
                          {formatPrice(product.price)}
                        </p>
                      )}
                    </Td>
                    <Td>
                      {product.discountActive && product.discountPercent > 0 ? (
                        <Badge tone="purple">-{product.discountPercent}%</Badge>
                      ) : (
                        <span className="text-xs text-purple-950/35">—"</span>
                      )}
                    </Td>
                    <Td>
                      <span
                        className={
                          stock === 0
                            ? "font-semibold text-red-600"
                            : stock <= 5
                              ? "font-semibold text-amber-600"
                              : "font-semibold text-purple-950"
                        }
                      >
                        {stock}
                      </span>
                      <span className="ml-1 text-xs text-purple-950/40">
                        / {product.variants.length} sizes
                      </span>
                    </Td>
                    <Td>
                      <Badge tone={statusTone[product.status] ?? "neutral"}>{product.status}</Badge>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditing(product)}
                          aria-label={`Edit ${product.name}`}
                          className="rounded-lg p-2 text-purple-950/50 transition-colors hover:bg-purple-600/10 hover:text-purple-700"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleting(product)}
                          aria-label={`Delete ${product.name}`}
                          className="rounded-lg p-2 text-purple-950/50 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </TableShell>
        )}
      </Panel>

      {(creating || editing) && (
        <ProductFormModal
          product={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={() => {
            setCreating(false);
            setEditing(null);
            reload();
          }}
        />
      )}

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete product"
        description="This cannot be undone"
        size="sm"
        footer={
          <>
            <Button variant="light" onClick={() => setDeleting(null)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} loading={saving}>
              Delete product
            </Button>
          </>
        }
      >
        <p className="text-sm text-purple-950/70">
          Are you sure you want to delete <span className="font-semibold text-purple-950">{deleting?.name}</span>?
          All of its variants and images will be removed.
        </p>
      </Modal>
    </div>
  );
}

function ProductFormModal({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = React.useState<FormState>(() =>
    product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description ?? "",
          price: String(product.price),
          compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
          discountPercent: product.discountPercent ? String(product.discountPercent) : "",
          discountActive: product.discountActive,
          status: product.status,
          featured: product.featured,
        }
      : emptyForm
  );
  const [variants, setVariants] = React.useState<Variant[]>(product?.variants ?? []);
  const [images, setImages] = React.useState<ProductImage[]>(product?.images ?? []);
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [newImageUrl, setNewImageUrl] = React.useState("");

  const isEdit = Boolean(product);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const finalPrice =
    form.discountActive && Number(form.discountPercent) > 0
      ? Number(form.price || 0) * (1 - Number(form.discountPercent) / 100)
      : Number(form.price || 0);

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}-${prev.length}`,
        size: "",
        sku: "",
        stock: 0,
        price: null,
      },
    ]);
  };

  const updateVariant = (id: string, patch: Partial<Variant>) => {
    setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  };

  const removeVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload-image", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Upload failed");
      setImages((prev) => [
        ...prev,
        { id: `tmp-${Date.now()}`, url: json.url, alt: form.name, position: prev.length },
      ]);
      setNewImageUrl("");
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : undefined,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    if (form.price === "" || Number.isNaN(Number(form.price))) {
      toast({ title: "Enter a valid price", variant: "destructive" });
      return;
    }

    const cleanVariants = variants.filter((v) => v.size.trim());
    if (!cleanVariants.length) {
      toast({ title: "Add at least one size", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        description: form.description,
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
        discountPercent: form.discountPercent ? Number(form.discountPercent) : 0,
        discountActive: form.discountActive,
        status: form.status,
        featured: form.featured,
        variants: cleanVariants.map((v) => ({
          size: v.size,
          stock: Number(v.stock) || 0,
          price: v.price,
          sku: v.sku,
        })),
        images: images.map((img) => ({ url: img.url, alt: img.alt })),
      };

      if (isEdit && product) {
        await adminRequest(`/api/admin/products/${product.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });

        for (const variant of cleanVariants) {
          if (variant.id.startsWith("new-")) {
            await adminRequest(`/api/admin/products/${product.id}/variants`, {
              method: "POST",
              body: JSON.stringify({ size: variant.size, stock: variant.stock, price: variant.price, sku: variant.sku }),
            });
          } else {
            await adminRequest(`/api/admin/variants/${variant.id}`, {
              method: "PATCH",
              body: JSON.stringify({ size: variant.size, stock: variant.stock, price: variant.price }),
            });
          }
        }

        const removed = (product.variants ?? []).filter(
          (original) => !cleanVariants.some((v) => v.id === original.id)
        );
        for (const variant of removed) {
          await adminRequest(`/api/admin/variants/${variant.id}`, { method: "DELETE" }).catch(() => null);
        }

        await adminRequest(`/api/admin/products/${product.id}/images`, {
          method: "PATCH",
          body: JSON.stringify({
            action: "replace-images",
            images: images.map((img) => ({ url: img.url, alt: img.alt })),
          }),
        });
      } else {
        await adminRequest("/api/admin/products", { method: "POST", body: JSON.stringify(payload) });
      }

      toast({ title: isEdit ? "Product updated" : "Product created", variant: "success" });
      clearStorefrontCache();
      onSaved();
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

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={isEdit ? "Edit product" : "New product"}
      description={isEdit ? product!.slug : "Add a product to your catalog"}
      footer={
        <>
          <Button variant="light" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="admin" onClick={handleSave} loading={saving}>
            {isEdit ? "Save changes" : "Create product"}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" htmlFor="product-name" className="sm:col-span-2">
            <TextInput
              id="product-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="PANTHER OVERSIZED T-SHIRT"
            />
          </Field>

          <Field label="Slug" htmlFor="product-slug" hint="Leave blank to generate from the name">
            <TextInput
              id="product-slug"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="panther-oversized-tee"
            />
          </Field>

          <Field label="Status" htmlFor="product-status">
            <Select
              id="product-status"
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </Field>

          <Field label="Description" htmlFor="product-description" className="sm:col-span-2">
            <TextArea
              id="product-description"
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Heavyweight premium cotton. Oversized silhouette."
            />
          </Field>
        </div>

        <div className="rounded-lg border border-purple-200/70 p-4">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-purple-950/60">Pricing</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Price (DT)" htmlFor="product-price">
              <TextInput
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="89.00"
              />
            </Field>

            <Field label="Compare at price (DT)" htmlFor="product-compare" hint="Shown struck through">
              <TextInput
                id="product-compare"
                type="number"
                min="0"
                step="0.01"
                value={form.compareAtPrice}
                onChange={(e) => set("compareAtPrice", e.target.value)}
                placeholder="119.00"
              />
            </Field>

            <Field label="Discount (%)" htmlFor="product-discount">
              <TextInput
                id="product-discount"
                type="number"
                min="0"
                max="90"
                value={form.discountPercent}
                onChange={(e) => set("discountPercent", e.target.value)}
                placeholder="20"
              />
            </Field>

            <div className="flex items-end">
              <Toggle
                id="product-discount-active"
                checked={form.discountActive}
                onChange={(v) => set("discountActive", v)}
                label="Discount active"
                hint="Applies on the storefront"
              />
            </div>
          </div>

          {form.discountActive && Number(form.discountPercent) > 0 && (
            <p className="mt-4 rounded-md bg-purple-600/5 px-3 py-2 text-sm text-purple-950/70">
              Customers pay <span className="font-semibold text-purple-700">{formatPrice(finalPrice)}</span>
              {form.compareAtPrice ? (
                <>
                  {" "}
                  instead of <span className="line-through">{formatPrice(Number(form.compareAtPrice))}</span>
                </>
              ) : null}
            </p>
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-950/60">
              Sizes &amp; stock
            </p>
            <Button variant="light" size="sm" onClick={addVariant}>
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Add size
            </Button>
          </div>

          {!variants.length ? (
            <p className="rounded-lg border border-dashed border-purple-200 px-4 py-6 text-center text-sm text-purple-950/45">
              No sizes yet. Add at least one.
            </p>
          ) : (
            <div className="space-y-2">
              {variants.map((variant) => (
                <div key={variant.id} className="flex items-center gap-2">
                  <TextInput
                    value={variant.size}
                    onChange={(e) => updateVariant(variant.id, { size: e.target.value })}
                    placeholder="XL"
                    aria-label="Size"
                    className="w-24 uppercase"
                  />
                  <TextInput
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) => updateVariant(variant.id, { stock: Number(e.target.value) })}
                    placeholder="0"
                    aria-label={`Stock for ${variant.size || "size"}`}
                    className="w-24"
                  />
                  <TextInput
                    type="number"
                    min="0"
                    step="0.01"
                    value={variant.price ?? ""}
                    onChange={(e) =>
                      updateVariant(variant.id, {
                        price: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    placeholder={Number(form.price || 0).toFixed(2)}
                    aria-label={`Override price for ${variant.size || "size"}`}
                    className="w-32"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(variant.id)}
                    aria-label={`Remove size ${variant.size || ""}`}
                    className="rounded-lg p-2 text-purple-950/40 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <p className="text-xs text-purple-950/40">
                Leave the price override blank to use the base price.
              </p>
            </div>
          )}
        </div>

        <div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-purple-950/60">Images</p>
          <div className="flex flex-wrap gap-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative h-20 w-20 overflow-hidden rounded-lg border border-purple-200/70"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((i) => i.id !== image.id))}
                  aria-label="Remove image"
                  className="absolute right-1 top-1 rounded-md bg-black/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-black/20 text-purple-950/40 transition-colors hover:border-purple-600 hover:text-purple-600">
              <Upload className="h-4 w-4" />
              <span className="text-[10px] font-medium">
                {uploading ? "Uploading" : "Upload"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                  e.target.value = "";
                }}
              />
            </label>
          </div>

          <div className="mt-3 flex gap-2">
            <TextInput
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="/images/shirt-front.jpg"
              aria-label="Image URL"
            />
            <Button
              variant="light"
              onClick={() => {
                const url = newImageUrl.trim();
                if (!url) return;
                setImages((prev) => [
                  ...prev,
                  { id: `tmp-${Date.now()}`, url, alt: form.name, position: prev.length },
                ]);
                setNewImageUrl("");
              }}
            >
              Add URL
            </Button>
          </div>
        </div>

        <Toggle
          id="product-featured"
          checked={form.featured}
          onChange={(v) => set("featured", v)}
          label="Featured product"
          hint="Highlights this product in the catalog"
        />
      </div>
    </Modal>
  );
}
