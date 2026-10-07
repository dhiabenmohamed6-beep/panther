"use client";

import React from "react";
import { Marquee } from "@/components/marquee";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCartStore } from "@/store/cart";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { AlertCircle, CreditCard, Truck, Shield, CheckCircle, Tag, X, User, Mail, Phone, MapPin, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { checkoutSchema, type CheckoutInput } from "@/lib/validation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatedBackground } from "@/components/animated-background";
import { useHydrated } from "@/hooks/use-hydrated";
import { useStoreSettings } from "@/hooks/use-storefront";
import { useCartReconciliation } from "@/hooks/use-cart-reconciliation";

export function CheckoutContent() {
  const { items, clearCart, getSubtotal, removeItems } = useCartStore();
  const hydrated = useHydrated();
  const settings = useStoreSettings();
  const { removedCount } = useCartReconciliation();
  const subtotal = hydrated ? getSubtotal() : 0;
  const displayItems = hydrated ? items : [];

  const [paymentMethod, setPaymentMethod] = React.useState<"cod" | "card">("cod");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [orderSuccess, setOrderSuccess] = React.useState(false);
  const [orderId, setOrderId] = React.useState<string | null>(null);

  const [promoInput, setPromoInput] = React.useState("");
  const [promo, setPromo] = React.useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = React.useState<string | null>(null);
  const [promoLoading, setPromoLoading] = React.useState(false);

  const discount = promo?.discount ?? 0;
  const shipping = subtotal - discount >= settings.freeShippingOver ? 0 : settings.shippingPrice;
  const total = Math.max(0, subtotal - discount + shipping);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: "Tunisia",
    },
  });

  const applyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoError(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput, subtotal }),
      });
      const json = await res.json();
      if (!res.ok) {
        setPromo(null);
        setPromoError(json.error || "Invalid promo code");
        return;
      }
      setPromo({ code: json.code, discount: json.discount });
      setPromoInput(json.code);
    } catch {
      setPromoError("Could not validate the code");
    } finally {
      setPromoLoading(false);
    }
  };

  const clearPromo = () => {
    setPromo(null);
    setPromoInput("");
    setPromoError(null);
  };

  const onSubmit = async (data: CheckoutInput) => {
    setIsSubmitting(true);
    try {
      if (items.length === 0) {
        throw new Error("Your cart is empty. Add an item before checking out.");
      }
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ variantId: item.variantId, quantity: item.quantity })),
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
          paymentMethod,
          couponCode: promo?.code,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.code === "UNAVAILABLE_ITEMS" && Array.isArray(json.unavailableVariantIds)) {
          // The stored cart referenced variants the catalogue no longer has.
          // Drop them so the customer can retry with what is actually in stock.
          removeItems(json.unavailableVariantIds);
          throw new Error(
            json.unavailableVariantIds.length === 1
              ? "One item was no longer available and has been removed from your cart. Please place your order again."
              : `${json.unavailableVariantIds.length} items were no longer available and have been removed from your cart. Please place your order again.`,
          );
        }
        throw new Error(json.error || "Failed to process order");
      }

      toast({
        title: "Order confirmed!",
        description: `Order ${json.order.id} received. Check your email for confirmation.`,
        variant: "success",
      });
      setOrderId(json.order.id);
      clearCart();
      reset();
      setOrderSuccess(true);
    } catch (error) {
      toast({
        title: "Order failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <AnimatedBackground>
        <>
          <Marquee />
          <Navbar />
          <main id="main-content" className="min-h-screen pt-16 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl mx-auto text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-400" />
                </div>
                <h1 className="font-bold tracking-tight uppercase text-3xl md:text-4xl text-black mb-4">ORDER CONFIRMED</h1>
                <p className="text-black/60 mb-8">
                  Thank you for your order{orderId ? <> — reference <span className="font-mono text-black">{orderId}</span></> : null}.
                  You&apos;ll receive a confirmation email shortly.
                </p>
                <Button size="lg" asChild>
                  <Link href="/shop">CONTINUE SHOPPING</Link>
                </Button>
              </div>
            </div>
          </main>
          <Footer />
        </>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <>
        <Marquee />
        <Navbar />
        <main id="main-content" className="min-h-screen pt-16 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-8 font-bold tracking-tight uppercase text-3xl md:text-4xl text-black">
              CHECKOUT
            </h1>

            {removedCount > 0 && (
              <div
                className="mb-6 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
                role="status"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {removedCount === 1
                    ? "1 item was removed from your cart because it is no longer available."
                    : `${removedCount} items were removed from your cart because they are no longer available.`}{" "}
                  Please review your cart and place your order again.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-2 gap-8 lg:gap-12" noValidate>
              <div className="space-y-6">
                <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                  <SectionHeading icon={Shield} step="01" title="Contact information" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <CheckoutField
                      id="firstName"
                      label="First name"
                      error={errors.firstName?.message}
                      icon={User}
                      inputProps={{ ...register("firstName"), placeholder: "John" }}
                    />
                    <CheckoutField
                      id="lastName"
                      label="Last name"
                      error={errors.lastName?.message}
                      icon={User}
                      inputProps={{ ...register("lastName"), placeholder: "Doe" }}
                    />
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <CheckoutField
                      id="email"
                      label="Email"
                      type="email"
                      error={errors.email?.message}
                      icon={Mail}
                      inputProps={{ ...register("email"), placeholder: "john@example.com" }}
                    />
                    <CheckoutField
                      id="phone"
                      label="Phone"
                      type="tel"
                      error={errors.phone?.message}
                      icon={Phone}
                      inputProps={{ ...register("phone"), placeholder: "+33 6 12 34 56 78" }}
                    />
                  </div>
                  <p className="mt-4 flex items-start gap-2 rounded-lg bg-purple-50 px-3 py-2.5 text-xs text-purple-900">
                    <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    We&apos;ll send your order confirmation and tracking updates here.
                  </p>
                </section>

                <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                  <SectionHeading icon={Truck} step="02" title="Shipping address" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="city"
                        className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-black/55"
                      >
                        Governorate
                      </label>
                      <Controller
                        control={control}
                        name="city"
                        render={({ field }) => (
                          <Select value={field.value ?? ""} onValueChange={field.onChange}>
                            <SelectTrigger
                              id="city"
                              className="h-11 rounded-lg border-black/15 bg-white text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                            >
                              <SelectValue placeholder="Select governorate" />
                            </SelectTrigger>
                            <SelectContent className="max-h-72">
                              {GOVERNORATES.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.city?.message && (
                        <p className="mt-1.5 text-xs text-red-600" role="alert">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                    <CheckoutField
                      id="postalCode"
                      label="Postal code"
                      error={errors.postalCode?.message}
                      inputProps={{ ...register("postalCode"), placeholder: "1000" }}
                    />
                  </div>
                  <div className="mt-4">
                    <CheckoutField
                      id="address"
                      label="Street address"
                      error={errors.address?.message}
                      icon={MapPin}
                      inputProps={{ ...register("address"), placeholder: "12 Avenue Habib Bourguiba" }}
                    />
                  </div>
                  <p className="mt-4 flex items-start gap-2 rounded-lg bg-purple-50 px-3 py-2.5 text-xs text-purple-900">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    We currently ship across all 24 Tunisian governorates.
                  </p>
                </section>

                <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                  <SectionHeading icon={CreditCard} step="03" title="Payment method" />
                  <PaymentOption
                    checked={paymentMethod === "cod"}
                    onSelect={() => setPaymentMethod("cod")}
                    title="Cash on Delivery"
                    description="Pay when your parcel arrives"
                    icon={Wallet}
                  />
                </section>
              </div>

              <div>
                <div className="sticky top-24 bg-white border border-black/10 p-6 space-y-6">
                  <h2 className="font-bold tracking-tight uppercase text-lg text-black border-b border-black/10 pb-4">ORDER SUMMARY</h2>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {displayItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded border border-black/10"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-black truncate">{item.name}</p>
                          <p className="text-xs text-black/50">Size: {item.size} × {item.quantity}</p>
                          <p className="text-sm font-medium text-black">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-black/10 pt-4 space-y-3">
                    <div className="space-y-2">
                      {promo ? (
                        <div className="flex items-center justify-between rounded-lg border border-purple-200 bg-purple-50 px-3 py-2">
                          <span className="flex items-center gap-2 text-sm font-medium text-purple-800">
                            <Tag className="h-4 w-4" aria-hidden="true" />
                            {promo.code}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-purple-800">
                              -{formatPrice(discount)}
                            </span>
                            <button
                              type="button"
                              onClick={clearPromo}
                              aria-label="Remove promo code"
                              className="rounded p-1 text-purple-700 transition-colors hover:bg-purple-100"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            value={promoInput}
                            onChange={(e) => {
                              setPromoInput(e.target.value.toUpperCase());
                              setPromoError(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                applyPromo();
                              }
                            }}
                            placeholder="PROMO CODE"
                            aria-label="Promo code"
                            className="h-10 w-full rounded-lg border border-black/15 bg-white px-3 font-mono text-sm uppercase text-black transition-colors placeholder:text-black/35 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                          />
                          <Button
                            type="button"
                            variant="light"
                            onClick={applyPromo}
                            loading={promoLoading}
                            className="shrink-0"
                          >
                            Apply
                          </Button>
                        </div>
                      )}
                      {promoError && (
                        <p className="text-xs text-red-600" role="alert">
                          {promoError}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between text-black/70">
                      <span>Subtotal</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-black/70">
                        <span>Discount</span>
                        <span className="font-medium text-emerald-600">-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-black/70">
                      <span>Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? <span className="text-green-600">FREE</span> : formatPrice(shipping)}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-purple-600 text-center">
                        Add {formatPrice(Math.max(0, settings.freeShippingOver - (subtotal - discount)))} more for free shipping
                      </p>
                    )}
                    <div className="border-t border-black/10 pt-3 flex justify-between text-lg font-bold text-black">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                  <Button type="submit" size="lg" className="w-full group" loading={isSubmitting} disabled={displayItems.length === 0}>
                    <span className="flex items-center justify-center gap-2">
                      PLACE ORDER
                      <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </span>
                  </Button>
                  <p className="text-xs text-black/40 text-center">
                    Secure checkout • 30-day returns • Free shipping over {formatPrice(settings.freeShippingOver)}
                  </p>
                </div>
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </>
    </AnimatedBackground>
  );
}

const GOVERNORATES = [
  "Tunis",
  "Ariana",
  "Ben Arous",
  "Manouba",
  "Nabeul",
  "Zaghouan",
  "Bizerte",
  "Béja",
  "Jendouba",
  "Le Kef",
  "Siliana",
  "Sousse",
  "Monastir",
  "Mahdia",
  "Sfax",
  "Kairouan",
  "Gafsa",
  "Tozeur",
  "Kébili",
  "Gabès",
  "Médenine",
  "Tataouine",
  "Kasserine",
  "Sidi Bouzid",
];

function SectionHeading({
  icon: Icon,
  step,
  title,
}: {
  icon: LucideIcon;
  step: string;
  title: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3 border-b border-black/10 pb-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-purple-500">
          Step {step}
        </p>
        <h2 className="text-sm font-bold uppercase tracking-wider text-black">{title}</h2>
      </div>
    </div>
  );
}

function CheckoutField({
  id,
  label,
  type = "text",
  error,
  icon: Icon,
  inputProps,
}: {
  id: string;
  label: string;
  type?: string;
  error?: string;
  icon?: LucideIcon;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-black/55"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/30"
            aria-hidden="true"
          />
        )}
        <input
          id={id}
          type={type}
          aria-invalid={error ? "true" : "false"}
          className={cn(
            "h-11 w-full rounded-lg border bg-white text-sm text-black transition-colors placeholder:text-black/35",
            "focus:outline-none focus:ring-2 focus:ring-purple-600/20",
            Icon ? "pl-10 pr-3" : "px-3",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
              : "border-black/15 focus:border-purple-600"
          )}
          {...inputProps}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function PaymentOption({
  checked,
  onSelect,
  title,
  description,
  icon: Icon,
  disabled,
}: {
  checked: boolean;
  onSelect: () => void;
  title: string;
  description: string;
  icon: LucideIcon;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex items-center gap-4 rounded-xl border p-4 transition-colors",
        disabled
          ? "cursor-not-allowed border-black/10 bg-black/[0.02] opacity-60"
          : "cursor-pointer hover:border-purple-500",
        checked && !disabled && "border-purple-600 bg-purple-50/50 ring-1 ring-purple-600/20"
      )}
    >
      <input
        type="radio"
        name="paymentMethod"
        checked={checked}
        onChange={onSelect}
        disabled={disabled}
        className="h-4 w-4 accent-purple-600"
      />
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg",
          checked && !disabled ? "bg-purple-600 text-white" : "bg-black/5 text-black/45"
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-black">{title}</span>
        <span className="block text-xs text-black/50">{description}</span>
      </span>
      {disabled && (
        <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-black/45">
          Soon
        </span>
      )}
    </label>
  );
}