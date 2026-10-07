"use client";

import * as React from "react";

export interface StorefrontVariant {
  id: string;
  size: string;
  stock: number;
  price: number | null;
  sku: string;
}

export interface StorefrontImage {
  id: string;
  url: string;
  alt: string;
  position: number;
}

export interface StorefrontProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  discountPercent: number;
  discountActive: boolean;
  featured: boolean;
  images: StorefrontImage[];
  variants: StorefrontVariant[];
}

export interface StorefrontAthlete {
  id: string;
  name: string;
  instagram: string | null;
  description: string | null;
  image: string | null;
  featured: boolean;
}

export interface StorefrontSize {
  size: string;
  chest: number;
  length: number;
  shoulder: number;
}

export interface StorefrontMarqueeMessage {
  id: string;
  text: string;
  enabled: boolean;
  position: number;
}

export interface StorefrontSettings {
  brandName: string;
  logo: string | null;
  tagline: string;
  instagramUrl: string;
  contactEmail: string;
  contactPhone: string | null;
  shippingPrice: number;
  freeShippingOver: number;
  currency: string;
  storeStatus: boolean;
  maintenanceMode: boolean;
}

export const FALLBACK_SETTINGS: StorefrontSettings = {
  brandName: "PANTHER",
  logo: null,
  tagline: "BUILT DIFFERENT.",
  instagramUrl: "https://instagram.com/panther",
  contactEmail: "contact@panther.com",
  contactPhone: null,
  shippingPrice: 9.99,
  freeShippingOver: 150,
  currency: "TND",
  storeStatus: true,
  maintenanceMode: false,
};

export const FALLBACK_PRODUCTS: StorefrontProduct[] = [
  {
    id: "panther-oversized-tee",
    name: "PANTHER OVERSIZED T-SHIRT",
    slug: "panther-oversized-tee",
    description:
      "Heavyweight premium cotton. Oversized silhouette. Built for training and the streets. One shirt. One standard.",
    price: 89.0,
    compareAtPrice: null,
    discountPercent: 0,
    discountActive: false,
    featured: true,
    images: [
      { id: "1", url: "/images/list1.png", alt: "Front View", position: 0 },
      { id: "2", url: "/images/list2.png", alt: "Back View", position: 1 },
      { id: "3", url: "/images/list3.png", alt: "Side View", position: 2 },
    ],
    variants: [
      { id: "v1", size: "S", stock: 12, price: 89, sku: "PANTHER-TEE-S" },
      { id: "v2", size: "M", stock: 24, price: 89, sku: "PANTHER-TEE-M" },
      { id: "v3", size: "L", stock: 31, price: 89, sku: "PANTHER-TEE-L" },
      { id: "v4", size: "XL", stock: 18, price: 89, sku: "PANTHER-TEE-XL" },
      { id: "v5", size: "XXL", stock: 5, price: 89, sku: "PANTHER-TEE-XXL" },
    ],
  },
];

export const FALLBACK_ATHLETES: StorefrontAthlete[] = [
  {
    id: "1",
    name: "Marcus Steele",
    instagram: "https://instagram.com/marcussteele",
    description: "Powerlifter. 3x National Champion. Built different.",
    image: "/images/crew1.png",
    featured: true,
  },
  {
    id: "2",
    name: "Elena Voss",
    instagram: "https://instagram.com/elenavoss",
    description: "CrossFit Games Athlete. Strength in silence.",
    image: "/images/crew2.png",
    featured: true,
  },
  {
    id: "3",
    name: "Kai Romano",
    instagram: "https://instagram.com/kairomano",
    description: "Street Workout Champion. Movement is life.",
    image: "/images/crew3.png",
    featured: true,
  },
];

export const FALLBACK_SIZES: StorefrontSize[] = [
  { size: "S", chest: 104, length: 72, shoulder: 52 },
  { size: "M", chest: 110, length: 74, shoulder: 54 },
  { size: "L", chest: 116, length: 76, shoulder: 56 },
  { size: "XL", chest: 122, length: 78, shoulder: 58 },
  { size: "XXL", chest: 128, length: 80, shoulder: 60 },
];

export const FALLBACK_MARQUEE: StorefrontMarqueeMessage[] = [
  { id: "0", text: "PANTHER — BUILT FOR THOSE WHO REFUSE TO BLEND IN", enabled: true, position: 0 },
  { id: "1", text: "PREMIUM OVERSIZED FIT", enabled: true, position: 1 },
  { id: "2", text: "HEAVYWEIGHT PREMIUM COTTON", enabled: true, position: 2 },
  { id: "3", text: "BUILT FOR TRAINING. DESIGNED FOR THE STREET.", enabled: true, position: 3 },
  { id: "4", text: "ONE SHIRT. ONE STANDARD.", enabled: true, position: 4 },
  { id: "5", text: "WEAR THE PANTHER.", enabled: true, position: 5 },
];

type Resource<T> = {
  data: T;
  isLoading: boolean;
  error: string | null;
};

const cache = new Map<string, unknown>();

export function clearStorefrontCache() {
  cache.clear();
}

async function load<T>(key: string, url: string, fallback: T): Promise<T> {
  if (cache.has(key)) return cache.get(key) as T;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
    const json = await res.json();
    const value = json as T;
    cache.set(key, value);
    return value;
  } catch {
    cache.set(key, fallback);
    return fallback;
  }
}

function useResource<T>(key: string, url: string, fallback: T, select: (json: never) => T): Resource<T> {
  const [state, setState] = React.useState<Resource<T>>({ data: fallback, isLoading: true, error: null });

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await load<never>(key, url, fallback as never);
        if (active) setState({ data: select(raw), isLoading: false, error: null });
      } catch (error) {
        if (active) {
          setState({ data: fallback, isLoading: false, error: error instanceof Error ? error.message : "Unknown error" });
        }
      }
    })();
    return () => {
      active = false;
    };
    // select and fallback are stable per call site; including them would refetch on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, url]);

  return state;
}

function normalizeProducts(list: StorefrontProduct[]): StorefrontProduct[] {
  return list.map((product) => ({
    ...product,
    description: product.description ?? null,
    images: product.images.map((image) => ({ ...image, alt: image.alt || product.name })),
    variants: (product.variants ?? []).map((variant) => ({ ...variant, price: variant.price ?? null })),
  }));
}

export function useProducts(): Resource<StorefrontProduct[]> {
  return useResource<StorefrontProduct[]>("products", "/api/products", FALLBACK_PRODUCTS, (json: { products?: StorefrontProduct[] } | StorefrontProduct[]) =>
    normalizeProducts(Array.isArray(json) ? json : (json.products ?? [])),
  );
}

export function useAthletes(): Resource<StorefrontAthlete[]> {
  return useResource<StorefrontAthlete[]>("athletes", "/api/athletes", FALLBACK_ATHLETES, (json: { athletes?: StorefrontAthlete[] } | StorefrontAthlete[]) =>
    Array.isArray(json) ? json : (json.athletes ?? []),
  );
}

export function useSizeGuide(): Resource<StorefrontSize[]> {
  return useResource<StorefrontSize[]>("sizes", "/api/size-guide", FALLBACK_SIZES, (json: { sizes?: StorefrontSize[] } | StorefrontSize[]) =>
    Array.isArray(json) ? json : (json.sizes ?? []),
  );
}

export function useMarqueeMessages(): StorefrontMarqueeMessage[] {
  const { data } = useResource<StorefrontMarqueeMessage[]>(
    "marquee",
    "/api/marquee",
    FALLBACK_MARQUEE,
    (json: { messages?: StorefrontMarqueeMessage[] } | StorefrontMarqueeMessage[]) =>
      Array.isArray(json) ? json : (json.messages ?? []),
  );
  return data.length > 0 ? data : FALLBACK_MARQUEE;
}

export function useStoreSettings(): StorefrontSettings {
  const { data } = useResource<StorefrontSettings>(
    "settings",
    "/api/settings",
    FALLBACK_SETTINGS,
    (json: StorefrontSettings) => ({ ...FALLBACK_SETTINGS, ...json }),
  );
  return data;
}
