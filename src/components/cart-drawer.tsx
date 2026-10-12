"use client";

import * as React from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { cn, formatPrice } from "@/lib/utils";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHydrated } from "@/hooks/use-hydrated";
import { useStoreSettings } from "@/hooks/use-storefront";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getTotalItems } = useCartStore();
  const hydrated = useHydrated();
  const settings = useStoreSettings();
  const router = useRouter();

  const subtotal = hydrated ? getSubtotal() : 0;
  const totalItems = hydrated ? getTotalItems() : 0;
  const shipping = subtotal >= settings.freeShippingOver ? 0 : settings.shippingPrice;
  const total = subtotal + shipping;
  const freeShippingProgress = Math.min((subtotal / settings.freeShippingOver) * 100, 100);
  const displayItems = hydrated ? items : [];

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeCart}>
      <DialogContent className="max-w-md w-full max-h-[95vh] h-[95vh] flex flex-col p-0 overflow-hidden bg-[#0a0a0a] border-white/10 text-white rounded-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600">
              <ShoppingBag className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold tracking-widest uppercase text-sm text-white">YOUR CART</h2>
              <p className="text-white/40 text-xs">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Free shipping progress */}
        {displayItems.length > 0 && (
          <div className="px-6 py-3 border-b border-white/8">
            {shipping === 0 ? (
              <p className="text-xs font-semibold text-green-400 text-center tracking-wide">
                ✓ You have free shipping!
              </p>
            ) : (
              <>
                <p className="text-xs text-white/40 mb-2 text-center">
                  Add <span className="text-purple-400 font-semibold">{formatPrice(settings.freeShippingOver - subtotal)}</span> more for free shipping
                </p>
                <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {displayItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 mb-5">
                <Package className="h-10 w-10 text-white/20" />
              </div>
              <h3 className="font-bold tracking-widest uppercase text-base text-white mb-2">CART IS EMPTY</h3>
              <p className="text-white/40 text-sm mb-8 max-w-xs">You haven&apos;t added anything yet.</p>
              <Button
                size="lg"
                className="w-full max-w-xs bg-purple-600 hover:bg-purple-700 text-white border-0"
                onClick={closeCart}
                asChild
              >
                <Link href="/shop">SHOP NOW</Link>
              </Button>
            </div>
          ) : (
            displayItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 rounded-xl bg-white/4 border border-white/6 hover:border-white/12 transition-colors group"
              >
                {/* Product image */}
                <div className="relative w-[72px] h-[72px] flex-shrink-0 overflow-hidden rounded-lg bg-white/10">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="72px"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <h4 className="font-semibold text-white text-sm leading-snug truncate">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-white/40 bg-white/8 px-2 py-0.5 rounded-full">
                        SIZE {item.size}
                      </span>
                    </div>
                  </div>
                  <p className="font-bold text-white text-sm">{formatPrice(item.price * item.quantity)}</p>
                </div>

                {/* Qty + remove */}
                <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="p-1.5 text-white/25 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <div className="flex items-center gap-1 bg-white/8 rounded-lg border border-white/10">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1.5 text-white/50 hover:text-white transition-colors disabled:opacity-30"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-7 text-center text-sm font-mono font-semibold text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-1.5 text-white/50 hover:text-white transition-colors disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {displayItems.length > 0 && (
          <div className="border-t border-white/8 px-6 py-5 space-y-4">
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white/50">
                <span>Subtotal</span>
                <span className="text-white/80 font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-white/50">
                <span>Shipping</span>
                <span className={cn("font-medium", shipping === 0 ? "text-green-400" : "text-white/80")}>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/8">
                <span>TOTAL</span>
                <span className="text-purple-400">{formatPrice(total)}</span>
              </div>
            </div>

            {/* CTA buttons */}
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white font-bold tracking-widest uppercase text-sm py-4 rounded-xl transition-all duration-150 shadow-lg shadow-purple-900/40"
            >
              CHECKOUT
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={closeCart}
              className="w-full text-center text-xs text-white/30 hover:text-white/60 transition-colors py-1 tracking-widest uppercase"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
