"use client";

import React, { Suspense } from "react";
import { Marquee } from "@/components/marquee";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductSection } from "@/components/product-section";
import { FeaturesSection } from "@/components/features-section";
import { BrandStory } from "@/components/brand-story";
import { SizeGuideModal } from "@/components/size-guide-modal";
import { AnimatedBackground } from "@/components/animated-background";
import { Button } from "@/components/ui/button";
import { Ruler } from "lucide-react";
import { useSearchParams } from "next/navigation";
  import {
  FALLBACK_PRODUCTS,
  useProducts,
  useSizeGuide,
} from "@/hooks/use-storefront";

function NavbarSuspenseFallback() {
  return <nav className="h-16" aria-hidden="true" />;
}

export function ShopContent() {
  const [showSizeGuide, setShowSizeGuide] = React.useState(false);
  const searchParams = useSearchParams();
  const requestedSlug = searchParams.get("product");
  const { data: products } = useProducts();
  const { data: sizeGuide } = useSizeGuide();

  const product =
    products.find((p) => p.slug === requestedSlug) ?? products[0] ?? FALLBACK_PRODUCTS[0];

  return (
    <AnimatedBackground>
      <>
        <Marquee />
        <Suspense fallback={<NavbarSuspenseFallback />}>
          <Navbar />
        </Suspense>
        <main id="main-content" className="min-h-screen pt-16">
          <section className="relative py-20 md:py-32 bg-white">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-600/5 to-transparent" aria-hidden="true" />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center">
                <span className="text-xs font-medium tracking-widest uppercase text-purple-600">SHOP</span>
                <h1 className="mt-2 font-bold tracking-tight uppercase text-4xl md:text-5xl lg:text-6xl text-black leading-[1.05]">
                  THE PANTHER <span className="text-purple-600">OVERSIZED TEE</span>
                </h1>
                <p className="mt-4 text-lg md:text-xl text-black/60 max-w-2xl mx-auto">
                  {product.description}
                </p>
                <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <Button variant="outline" onClick={() => setShowSizeGuide(true)}>
                    <span className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" aria-hidden="true" />
                      SIZE GUIDE
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <ProductSection product={product} />
          <FeaturesSection />
          <BrandStory />
          <Footer />
        </main>
        <SizeGuideModal
          isOpen={showSizeGuide}
          onClose={() => setShowSizeGuide(false)}
          sizes={sizeGuide}
        />
      </>
    </AnimatedBackground>
  );
}