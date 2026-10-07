"use client";

import * as React from "react";
import { useCartStore } from "@/store/cart";
import type { StorefrontProduct } from "@/hooks/use-storefront";

/**
 * Carts are persisted in localStorage, so they can outlive the catalogue they
 * were built from: a variant may be deleted, unpublished, or repriced in the
 * admin after the item was added. This reconciles the stored cart against the
 * live catalogue and drops anything that can no longer be ordered.
 */
export function useCartReconciliation(): { checked: boolean; removedCount: number } {
  const items = useCartStore((state) => state.items);
  const removeItems = useCartStore((state) => state.removeItems);
  const [checked, setChecked] = React.useState(false);
  const [removedCount, setRemovedCount] = React.useState(0);
  const signature = items.map((item) => item.variantId).sort().join(",");

  React.useEffect(() => {
    if (items.length === 0) {
      const timer = setTimeout(() => {
        setChecked(true);
        setRemovedCount(0);
      }, 0);
      return () => clearTimeout(timer);
    }

    let active = true;

    (async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load catalogue");
        const json = await res.json();
        const products: StorefrontProduct[] = json.products ?? [];

        const byVariantId = new Map<
          string,
          { product: StorefrontProduct; variant: StorefrontProduct["variants"][number] }
        >();
        for (const product of products) {
          for (const variant of product.variants ?? []) {
            byVariantId.set(variant.id, { product, variant });
          }
        }

        if (!active) return;

        const current = useCartStore.getState().items;
        const removed: string[] = [];
        const kept = current.filter((item) => {
          const match = byVariantId.get(item.variantId);
          if (!match || match.variant.stock <= 0) {
            removed.push(item.variantId);
            return false;
          }
          return true;
        });

        if (removed.length > 0) removeItems(removed);

        // Re-price anything that survived so the cart matches the database.
        const drifted = kept.filter((item) => {
          const match = byVariantId.get(item.variantId);
          if (!match) return false;
          const price = match.variant.price ?? match.product.price;
          return price !== item.price || item.stock !== match.variant.stock;
        });

        if (drifted.length > 0) {
          useCartStore.setState({
            items: kept.map((item) => {
              const match = byVariantId.get(item.variantId);
              if (!match) return item;
              const price = match.variant.price ?? match.product.price;
              return {
                ...item,
                price,
                stock: match.variant.stock,
                name: match.product.name,
                slug: match.product.slug,
                image: match.product.images[0]?.url || item.image,
                quantity: Math.min(item.quantity, match.variant.stock),
              };
            }),
          });
        }

        setRemovedCount(removed.length);
      } catch {
        // A failed catalogue fetch should never block checkout; the server
        // remains the authority on what can actually be ordered.
      } finally {
        if (active) setChecked(true);
      }
    })();

    return () => {
      active = false;
    };
    // `signature` changes only when the set of variant IDs changes, so we do
    // not re-run the reconciliation for every quantity or price tweak.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  return { checked, removedCount };
}
