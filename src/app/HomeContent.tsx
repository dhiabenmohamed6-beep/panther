"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Marquee } from "@/components/marquee";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Button } from "@/components/ui/button";
import { ProductSection } from "@/components/product-section";
import { ProductGallery } from "@/components/product-gallery";
import { FeaturesSection } from "@/components/features-section";
import { BrandStory } from "@/components/brand-story";
import { AthletesSection } from "@/components/athletes-section";
import { SizeGuideModal } from "@/components/size-guide-modal";
import { Footer } from "@/components/footer";
import { LoadingScreen } from "@/components/loading-screen";
import { AnimatedBackground } from "@/components/animated-background";
import { Ruler } from "lucide-react";
import {
  FALLBACK_PRODUCTS,
  useAthletes,
  useProducts,
  useSizeGuide,
} from "@/hooks/use-storefront";

export function HomeContent() {
  const [showSizeGuide, setShowSizeGuide] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const { data: products } = useProducts();
  const { data: athletes } = useAthletes();
  const { data: sizeGuide } = useSizeGuide();

  const product = products[0] ?? FALLBACK_PRODUCTS[0];
  const galleryImages = [
    { id: "g1", url: "/images/bloc1.png", alt: "Detail View 1", position: 0 },
    { id: "g2", url: "/images/bloc2.png", alt: "Detail View 2", position: 1 },
    { id: "g3", url: "/images/bloc3.png", alt: "Detail View 3", position: 2 },
  ];

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatedBackground>
      <>
        <LoadingScreen isLoading={isLoading} />
        <Marquee />
        <Navbar />
        <main id="main-content" className="min-h-screen">
          <Hero />
          <section className="w-full bg-white py-16 md:py-24" aria-label="PANTHER campaign video">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className="overflow-hidden rounded-xl border border-black/10 bg-black">
                  <video
                    className="block h-auto max-h-[70vh] w-full"
                    src="/images/video.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    disablePictureInPicture
                  />
                </div>

                <div>
                  <span className="text-xs font-medium tracking-widest uppercase text-purple-600">
                    In Motion
                  </span>
                  <h2 className="mt-3 font-bold tracking-tight uppercase text-3xl sm:text-4xl lg:text-5xl leading-[1.05] text-black">
                    The Tee <span className="text-purple-600">In Motion</span>
                  </h2>
                  <p className="mt-5 text-base sm:text-lg text-black/60 leading-relaxed">
                    See the PANTHER Oversized Tee in motion. Heavyweight drape, oversized
                    silhouette, and a fit that moves with you.
                  </p>

                  <ul className="mt-8 space-y-4">
                    {[
                      "280gsm heavyweight premium cotton",
                      "Oversized drop-shoulder silhouette",
                      "Reinforced seams and premium stitching",
                      "Built for training and the street",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm sm:text-base text-black/70">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Button size="lg" className="group" asChild>
                      <Link href="/shop">
                        <span className="flex items-center gap-2">
                          SHOP THE TEE
                          <ArrowRight
                            className="h-5 w-5 transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </span>
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => setShowSizeGuide(true)}>
                      <span className="flex items-center gap-2">
                        <Ruler className="h-5 w-5" aria-hidden="true" />
                        SIZE GUIDE
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="relative w-full overflow-hidden bg-purple-700 py-6 md:py-8"
            aria-label="Brand statement"
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,255,255,0.18) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
              aria-hidden="true"
            />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-center">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-xs sm:text-sm font-medium tracking-widest uppercase text-white/70"
                >
                  One Shirt. One Standard.
                </motion.span>

                <span className="hidden h-3 w-px bg-white/20 sm:block" aria-hidden="true" />

                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
                  className="text-base sm:text-lg md:text-xl font-bold tracking-tight uppercase text-white"
                >
                  Built <span className="text-purple-200">Different.</span>
                </motion.span>

                <span className="hidden h-3 w-px bg-white/20 sm:block" aria-hidden="true" />

                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
                  className="text-xs sm:text-sm font-medium tracking-widest uppercase text-white/70"
                >
                  Heavyweight. Oversized. Built to move.
                </motion.span>
              </div>
            </div>
          </section>

          <ProductSection product={product} />
          <ProductGallery images={galleryImages} />
          <FeaturesSection />
          <BrandStory />
          <AthletesSection athletes={athletes} />
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