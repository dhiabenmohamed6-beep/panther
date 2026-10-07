"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Marquee } from "@/components/marquee";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedBackground } from "@/components/animated-background";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Search, Loader2 } from "lucide-react";
import type { StorefrontProduct } from "@/hooks/use-storefront";

const FALLBACK_IMAGE = "/images/list1.png";

export function SearchContent() {
  const [query, setQuery] = React.useState("");
  const [submitted, setSubmitted] = React.useState("");
  const [results, setResults] = React.useState<StorefrontProduct[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);
  const { addItem, openCart } = useCartStore();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;

    setSubmitted(term);
    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/products?q=${encodeURIComponent(term)}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Search failed");
      const json = await res.json();
      setResults(
        (json.products ?? []).map((product: StorefrontProduct) => ({
          ...product,
          images: (product.images ?? []).map((image) => ({ ...image, alt: image.alt || product.name })),
          variants: product.variants ?? [],
        })),
      );
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = (product: StorefrontProduct) => {
    const variant = product.variants.find((v) => v.stock > 0);
    if (!variant) return;
    addItem({
      variantId: variant.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.url || FALLBACK_IMAGE,
      size: variant.size,
      price: variant.price ?? product.price,
      quantity: 1,
      stock: variant.stock,
    });
    openCart();
  };

  return (
    <AnimatedBackground>
      <>
        <Marquee />
        <Navbar />
        <main id="main-content" className="min-h-screen bg-white pt-16 pb-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <header className="py-16">
              <span className="text-xs font-medium tracking-widest uppercase text-purple-600">Search</span>
              <h1 className="mt-2 font-bold tracking-tight uppercase text-4xl md:text-5xl text-black leading-[1.05]">
                Find Your <span className="text-purple-600">Kit</span>
              </h1>

              <form onSubmit={handleSubmit} role="search" className="mt-8 flex max-w-xl gap-3">
                <div className="relative flex-1">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40"
                    aria-hidden="true"
                  />
                  <Input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search products"
                    aria-label="Search products"
                    className="pl-9"
                  />
                </div>
                <Button type="submit" disabled={isLoading || !query.trim()}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                  Search
                </Button>
              </form>
            </header>

            {isLoading ? (
              <p className="py-20 text-center text-black/50">Searching…</p>
            ) : !hasSearched ? (
              <div className="py-16 text-center">
                <Search className="mx-auto h-12 w-12 text-black/20" aria-hidden="true" />
                <p className="mt-6 text-black/50">Type a search above to find products.</p>
              </div>
            ) : results.length === 0 ? (
              <div className="py-16 text-center">
                <Search className="mx-auto h-12 w-12 text-black/20" aria-hidden="true" />
                <h2 className="mt-6 font-bold tracking-tight uppercase text-xl text-black">NO RESULTS</h2>
                <p className="mt-2 text-black/50">
                  Nothing matched &ldquo;{submitted}&rdquo;. Try a different term or browse the shop.
                </p>
                <Button size="lg" className="mt-8" asChild>
                  <Link href="/shop">BROWSE THE SHOP</Link>
                </Button>
              </div>
            ) : (
              <>
                <p className="mb-6 text-sm text-black/50">
                  {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{submitted}&rdquo;
                </p>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {results.map((product) => {
                    const inStock = product.variants.some((v) => v.stock > 0);
                    const variantPrices = product.variants
                      .filter((v) => v.price !== null)
                      .map((v) => v.price as number);
                    const lowestPrice =
                      variantPrices.length > 0 ? Math.min(...variantPrices) : product.price;
                    const priceFromPrice =
                      variantPrices.length > 0 && lowestPrice !== product.price;
                    return (
                      <article
                        key={product.id}
                        className="flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white"
                      >
                        <Link
                          href={`/shop?product=${product.slug}`}
                          className="relative block aspect-[3/4] bg-black/5"
                        >
                          <Image
                            src={product.images[0]?.url || FALLBACK_IMAGE}
                            alt={product.images[0]?.alt || product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        </Link>
                        <div className="flex flex-1 flex-col p-5">
                          <h2 className="font-bold tracking-tight uppercase text-base text-black">
                            <Link href={`/shop?product=${product.slug}`}>{product.name}</Link>
                          </h2>
                          <p className="mt-1 text-black/70">
                            {priceFromPrice ? "From " : ""}
                            {formatPrice(lowestPrice)}
                          </p>
                          <div className="mt-4 flex flex-1 items-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAdd(product)}
                              disabled={!inStock}
                              className="flex-1"
                            >
                              {inStock ? "ADD TO CART" : "SOLD OUT"}
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/shop?product=${product.slug}`}>View</Link>
                            </Button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </main>
        <Footer />
      </>
    </AnimatedBackground>
  );
}