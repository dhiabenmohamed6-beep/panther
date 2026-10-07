import { Metadata } from "next";
import { Suspense } from "react";
import { ProductsContent } from "./ProductsContent";

export const metadata: Metadata = {
  title: "Products",
  description: "Manage products, pricing and discounts",
};

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-black/40">Loading…</div>}>
      <ProductsContent />
    </Suspense>
  );
}
