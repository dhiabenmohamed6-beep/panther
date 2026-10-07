"use client";
import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatPrice } from "@/lib/utils";
import { useStoreSettings } from "@/hooks/use-storefront";
import { Check, X } from "lucide-react";

const FALLBACK_IMAGE = "/images/list1.png";

interface ProductVariant {
  id: string;
  size: string;
  stock: number;
  price: number | null;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  position: number;
}

interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  images: ProductImage[];
  variants: ProductVariant[];
}

interface ProductSectionProps {
  product: ProductData;
  className?: string;
}

export function ProductSection({ product, className }: ProductSectionProps) {
  const { addItem } = useCartStore();
  const settings = useStoreSettings();
  const [selectedVariant, setSelectedVariant] =
    React.useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [isAdding, setIsAdding] = React.useState(false);
  const [showLightbox, setShowLightbox] = React.useState(false);

  const imageCount = product.images.length;
  const safeIndex =
    imageCount > 0 ? Math.min(selectedImageIndex, imageCount - 1) : 0;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    try {
      addItem({
        variantId: selectedVariant.id,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images[0]?.url || FALLBACK_IMAGE,
        size: selectedVariant.size,
        price: selectedVariant.price ?? product.price,
        quantity,
        stock: selectedVariant.stock,
      });
      const { openCart } = useCartStore.getState();
      openCart();
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    try {
      addItem({
        variantId: selectedVariant.id,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images[0]?.url || FALLBACK_IMAGE,
        size: selectedVariant.size,
        price: selectedVariant.price ?? product.price,
        quantity,
        stock: selectedVariant.stock,
      });
      const { openCart } = useCartStore.getState();
      openCart();
    } finally {
      setIsAdding(false);
    }
  };

  const mainImage = product.images[safeIndex];

  const lowestVariantPrice = React.useMemo(() => {
    const prices = product.variants
      .filter((variant) => variant.price !== null)
      .map((variant) => variant.price as number);
    return prices.length > 0 ? Math.min(...prices) : null;
  }, [product.variants]);

  const effectivePrice =
    selectedVariant?.price ?? lowestVariantPrice ?? product.price;

  const hasVariantPricing = product.variants.some(
    (variant) => variant.price !== null && variant.price !== product.price,
  );

  const showFromPrice = !selectedVariant && hasVariantPricing;

  return (
    <section
      id="product"
      className={cn("relative py-20 md:py-32 bg-white", className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="sticky top-24"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[80px_1fr]">
              <div className="flex flex-row md:flex-col gap-3 md:gap-0 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(i)}
                    className={cn(
                      "relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 flex items-center justify-center",
                      i === safeIndex
                        ? "border-purple-500 scale-105 shadow-lg shadow-purple-500/20"
                        : "border-black/10 hover:border-black/30",
                    )}
                    aria-label={`Voir l'image ${i + 1}`}
                    aria-current={i === safeIndex ? "true" : "false"}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-white border border-black/10">
                <button
                  onClick={() => setShowLightbox(true)}
                  className="absolute inset-0 z-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white"
                  aria-label="Agrandir l'image"
                >
                  <Image
                    src={mainImage?.url || FALLBACK_IMAGE}
                    alt={mainImage?.alt || product.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </button>
              </div>
            </div>
            {showLightbox && (
              <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
                <button
                  onClick={() => setShowLightbox(false)}
                  className="absolute top-6 right-6 z-10 p-2 text-white/60 hover:text-white transition-colors"
                  aria-label="Fermer"
                >
                  <X className="h-8 w-8" />
                </button>
                <button
                  onClick={() =>
                    setSelectedImageIndex(
                      (prev) => (prev - 1 + imageCount) % imageCount,
                    )
                  }
                  className="absolute left-6 z-10 p-2 text-white/60 hover:text-white transition-colors hidden md:block"
                  aria-label="Image précédente"
                >
                  <svg
                    className="h-10 w-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <Image
                  src={mainImage?.url || FALLBACK_IMAGE}
                  alt={mainImage?.alt || product.name}
                  fill
                  className="max-h-[85vh] max-w-[85vw] object-contain"
                  priority
                />
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) => (prev + 1) % imageCount)
                  }
                  className="absolute right-6 z-10 p-2 text-white/60 hover:text-white transition-colors hidden md:block"
                  aria-label="Image suivante"
                >
                  <svg
                    className="h-10 w-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.1,
            }}
          >
            <div className="space-y-8">
              <div>
                <span className="text-xs font-medium tracking-widest uppercase text-purple-600">
                  OVERSIZED TEE
                </span>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mt-2 font-bold tracking-tight uppercase text-4xl md:text-5xl lg:text-6xl text-black leading-[1.05]"
                >
                  PANTHER OVERSIZED
                  <br />
                  <span className="text-purple-600">T-SHIRT</span>
                </motion.h1>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-black/60 leading-relaxed max-w-xl"
              >
                {product.description ||
                  "Heavyweight premium cotton. Oversized silhouette. Built for training and the streets. One shirt. One standard."}
              </motion.p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-black/70">
                  PRICE:
                </span>
                {showFromPrice && (
                  <span className="text-sm text-black/50">from</span>
                )}
                <span className="text-3xl font-bold text-black">
                  {formatPrice(effectivePrice)}
                </span>
                {showFromPrice && (
                  <span className="text-xs text-black/45">
                    Price may vary by size
                  </span>
                )}
              </div>
              <div className="pt-4 border-t border-black/10">
                <label
                  htmlFor="size-select"
                  className="block text-sm font-medium tracking-wider uppercase text-black/70 mb-3"
                >
                  SELECT SIZE
                </label>
                <Select
                  value={selectedVariant?.size || ""}
                  onValueChange={(size) => {
                    const variant = product.variants.find(
                      (v) => v.size === size,
                    );
                    setSelectedVariant(variant || null);
                  }}
                >
                  <SelectTrigger id="size-select" className="w-full max-w-xs">
                    <SelectValue placeholder="CHOISISSEZ VOTRE TAILLE" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((variant) => (
                      <SelectItem
                        key={variant.id}
                        value={variant.size}
                        disabled={variant.stock === 0}
                        className={cn(
                          "flex items-center justify-between",
                          variant.stock === 0 && "opacity-50",
                        )}
                      >
                        <span className="font-medium">{variant.size}</span>
                        {variant.stock > 0 && variant.stock <= 5 && (
                          <span className="text-xs text-yellow-400">
                            {variant.stock} LEFT
                          </span>
                        )}
                        {variant.stock === 0 && (
                          <span className="text-xs text-red-400">SOLD OUT</span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedVariant?.stock === 0 && (
                  <p className="mt-2 text-sm text-red-400">
                    Cette taille est en rupture de stock
                  </p>
                )}
              </div>
              <div className="pt-4 border-t border-black/10">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium tracking-wider uppercase text-black/70 mb-3"
                >
                  QUANTITY
                </label>
                <div className="flex items-center gap-4 max-w-xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-lg border border-black/20 bg-white/50 text-black hover:bg-black/5 transition-colors flex items-center justify-center"
                    aria-label="Diminuer la quantité"
                    disabled={quantity <= 1}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    min={1}
                    max={selectedVariant?.stock || 10}
                    className="w-20 h-10 text-center text-lg font-medium text-black bg-white/50 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    aria-label="Quantité"
                  />
                  <button
                    onClick={() =>
                      setQuantity((q) =>
                        Math.min(selectedVariant?.stock || 10, q + 1),
                      )
                    }
                    className="w-10 h-10 rounded-lg border border-black/20 bg-white/50 text-black hover:bg-black/5 transition-colors flex items-center justify-center"
                    aria-label="Augmenter la quantité"
                    disabled={quantity >= (selectedVariant?.stock || 10)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Button
                  size="xl"
                  className="flex-1 group"
                  onClick={handleAddToCart}
                  loading={isAdding}
                  disabled={!selectedVariant || selectedVariant.stock === 0}
                >
                  <span className="flex items-center justify-center gap-2">
                    ADD TO CART
                    <svg
                      className="w-5 h-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </span>
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  className="flex-1"
                  onClick={handleBuyNow}
                  loading={isAdding}
                  disabled={!selectedVariant || selectedVariant.stock === 0}
                >
                  BUY NOW
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-4 text-sm text-black/50 pt-6 border-t border-black/10"
              >
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-600" />
                  <span>{`Livraison gratuite dès ${formatPrice(settings.freeShippingOver)}`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-600" />
                  <span>Retours sous 30 jours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-600" />
                  <span>Paiement sécurisé</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
