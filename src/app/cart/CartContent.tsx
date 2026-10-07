"use client";

import React, { Suspense } from "react";
import { Marquee } from "@/components/marquee";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Trash2, Plus, Minus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { AnimatedBackground } from "@/components/animated-background";
import { useHydrated } from "@/hooks/use-hydrated";
import { useStoreSettings } from "@/hooks/use-storefront";
import { useCartReconciliation } from "@/hooks/use-cart-reconciliation";

function NavbarSuspenseFallback() {
  return <nav className="h-16" aria-hidden="true" />;
}

export function CartContent() {
  const { items, removeItem, updateQuantity, getSubtotal, getTotalItems, clearCart } = useCartStore();
  const hydrated = useHydrated();
  const settings = useStoreSettings();
  const { removedCount } = useCartReconciliation();
  const subtotal = hydrated ? getSubtotal() : 0;
  const totalItems = hydrated ? getTotalItems() : 0;
  const shipping = subtotal >= settings.freeShippingOver ? 0 : settings.shippingPrice;
  const total = subtotal + shipping;

  const displayItems = hydrated ? items : [];

  return (
    <AnimatedBackground>
      <>
        <Marquee />
        <Suspense fallback={<NavbarSuspenseFallback />}>
          <Navbar />
        </Suspense>
        <main id="main-content" className="min-h-screen pt-16 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-8 font-bold tracking-tight uppercase text-3xl md:text-4xl text-black">
              CART
            </h1>

            {removedCount > 0 && (
              <div
                className="mb-6 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
                role="status"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {removedCount === 1
                    ? "1 item was removed because it is no longer available."
                    : `${removedCount} items were removed because they are no longer available.`}
                </span>
              </div>
            )}

            {displayItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-black/10 flex items-center justify-center">
                  <svg className="w-10 h-10 text-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a6 6 0 00-12 0v5m16 0v5a6 6 0 01-12 0v-5M7 17h10a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="font-bold tracking-tight uppercase text-2xl text-black mb-2">YOUR CART IS EMPTY</h2>
                <p className="text-black/50 mb-8 max-w-xs mx-auto">Looks like you haven&apos;t added anything yet.</p>
                <Button size="lg" asChild>
                  <Link href="/shop">CONTINUE SHOPPING</Link>
                </Button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {displayItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-white border border-black/10 hover:border-black/20 transition-colors">
                      <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden bg-white border border-black/10">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-medium text-black truncate">{item.name}</h3>
                            <p className="text-black/50 text-sm">Size: {item.size}</p>
                            <p className="font-medium text-black mt-1">{formatPrice(item.price)}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="p-2 text-black/40 hover:text-red-400 transition-colors flex-shrink-0"
                            aria-label={`Supprimer ${item.name} taille ${item.size}`}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-2 bg-white border border-black/10 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-2 text-black/50 hover:text-black transition-colors disabled:opacity-30"
                              aria-label="Diminuer la quantité"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-3 font-mono text-black w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="p-2 text-black/50 hover:text-black transition-colors disabled:opacity-30"
                              aria-label="Augmenter la quantité"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <span className="font-medium text-black ml-auto">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-1">
                  <div className="sticky top-24 bg-white border border-black/10 p-6 space-y-4">
                    <h2 className="font-bold tracking-tight uppercase text-lg text-black border-b border-black/10 pb-4">ORDER SUMMARY</h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between text-black/70">
                        <span>Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
                        <span className="font-medium">{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-black/70">
                        <span>Shipping</span>
                        <span className="font-medium">
                          {shipping === 0 ? (
                            <span className="text-green-600">FREE</span>
                          ) : (
                            formatPrice(shipping)
                          )}
                        </span>
                      </div>
                      {shipping > 0 && (
                        <p className="text-xs text-purple-600 text-center">
                          Add {formatPrice(150 - subtotal)} more for free shipping
                        </p>
                      )}
                      <div className="border-t border-black/10 pt-3 flex justify-between text-lg font-bold text-black">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>
                    <Button size="lg" className="w-full group" asChild>
                      <Link href="/checkout">
                        <span className="flex items-center justify-center gap-2">
                          PROCEED TO CHECKOUT
                          <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" onClick={clearCart}>
                      CLEAR CART
                    </Button>
                    <p className="text-xs text-black/40 text-center">
                      Secure checkout • Free returns within 30 days
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer
          instagramUrl="https://instagram.com/panther"
          contactEmail="contact@panther.com"
          contactPhone="+33 1 23 45 67 89"
        />
      </>
    </AnimatedBackground>
  );
}