"use client";

import * as React from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { cn, formatPrice } from "@/lib/utils";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

import { useHydrated } from "@/hooks/use-hydrated";
import { useStoreSettings } from "@/hooks/use-storefront";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getTotalItems } = useCartStore();
  const hydrated = useHydrated();
  const settings = useStoreSettings();
  const subtotal = hydrated ? getSubtotal() : 0;
  const totalItems = hydrated ? getTotalItems() : 0;
  const shipping = subtotal >= settings.freeShippingOver ? 0 : settings.shippingPrice;
  const total = subtotal + shipping;
  const displayItems = hydrated ? items : [];

  return (
    <Dialog open={isOpen} onOpenChange={closeCart}>
      <DialogContent className="max-w-md w-full max-h-[90vh] h-[90vh] flex flex-col p-0 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <div>
            <h2 className="font-bold tracking-tight uppercase text-xl">CART</h2>
            <p className="text-black/50 text-sm">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={closeCart} aria-label="Fermer le panier">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {displayItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <ShoppingBag className="h-16 w-16 text-black/20 mb-4" />
              <h3 className="font-bold tracking-tight uppercase text-xl text-black mb-2">YOUR CART IS EMPTY</h3>
              <p className="text-black/50 mb-6 max-w-xs">Looks like you haven&apos;t added anything yet.</p>
              <Button size="lg" asChild className="w-full max-w-xs">
                <Link href="/shop">CONTINUE SHOPPING</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {displayItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-white border border-black/10">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-black truncate">{item.name}</h4>
                      <p className="text-black/50 text-sm">Size: {item.size}</p>
                      <p className="font-medium text-black mt-1">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 bg-white border border-black/10 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="p-2 text-black/50 hover:text-black transition-colors disabled:opacity-30"
                          aria-label="Diminuer la quantité"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 font-mono text-black">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-2 text-black/50 hover:text-black transition-colors disabled:opacity-30"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="p-2 text-black/40 hover:text-red-400 transition-colors"
                        aria-label={`Supprimer ${item.name} taille ${item.size}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-black/10 pt-6 space-y-3">
                <div className="flex justify-between text-black/70">
                  <span>Subtotal</span>
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
            </>
          )}
        </div>

        {displayItems.length > 0 && (
          <div className="border-t border-black/10 p-6 space-y-3">
            <Button size="xl" className="w-full group" asChild>
              <Link href="/checkout">
                <span className="flex items-center justify-center gap-2">
                  CHECKOUT
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full" onClick={closeCart}>
              CONTINUE SHOPPING
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}