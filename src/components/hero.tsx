"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface HeroProps {
  className?: string;
}

const BANNERS = ["/images/banner.png", "/images/banner1.png", "/images/banner2.png"];
const SLIDE_INTERVAL_MS = 3000;
const VIDEO_SRC = "/images/video.mp4";

export function Hero({ className }: HeroProps) {
  const scrollDown = () => {
    const nextSection = document.getElementById("product");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  React.useEffect(() => {
    if (paused || reducedMotion) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % BANNERS.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

  const goTo = React.useCallback((index: number) => {
    setActive(index);
  }, []);

  const next = React.useCallback(() => {
    setActive((current) => (current + 1) % BANNERS.length);
  }, []);

  const previous = React.useCallback(() => {
    setActive((current) => (current - 1 + BANNERS.length) % BANNERS.length);
  }, []);

  return (
    <section
      id="hero"
      className={cn(
        "relative min-h-screen flex items-center justify-center overflow-hidden",
        className
      )}
      aria-labelledby="hero-title"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {/* Video background */}
        <video
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          aria-hidden="true"
        />
        <div
          className={cn(
            "flex h-full w-full",
            reducedMotion ? "" : "transition-transform duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
          )}
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {BANNERS.map((src, index) => (
            <div key={src} className="relative h-full w-full shrink-0 grow-0 basis-full">
              <Image
                src={src}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-left py-20 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-widest uppercase text-white border border-white/30 bg-white/10 rounded-full backdrop-blur-sm">
              NEW COLLECTION
            </span>
          </motion.div>

          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
            className="font-bold tracking-tighter uppercase text-white sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-6"
          >
            <span className="block">BUILT</span>
            <span className="block text-purple-400">DIFFERENT.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
            className="text-base md:text-lg text-white/80 mb-10 tracking-wide font-medium"
          >
            THE PANTHER OVERSIZED TEE — HEAVYWEIGHT. OVERSIZED. BUILT TO MOVE.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.6 }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <Button size="lg" className="group w-full sm:w-auto px-8 py-3 bg-white text-black hover:bg-white/90 border-0" asChild>
              <a href="/shop">
                <span className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
                  SHOP NOW
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </a>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-3 border-white/30 text-white hover:bg-white/10 hover:border-white/50" asChild>
              <a href="/story">
                <span className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase">
                  DISCOVER THE STORY
                </span>
              </a>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 1 }}
          className="absolute bottom-12 left-8 flex flex-col items-start gap-2 text-white/50 text-sm"
          onClick={scrollDown}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && scrollDown()}
          aria-label="Scroll to product"
        >
<span className="tracking-widest uppercase">SCROLL</span>
            <svg
              className="w-5 h-5 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>

        <div className="absolute bottom-12 right-8 flex items-center gap-3">
          <button
            type="button"
            onClick={previous}
            aria-label="Previous slide"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-2" role="tablist" aria-label="Hero slides">
            {BANNERS.map((src, index) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={`Show banner ${index + 1}`}
                onClick={() => goTo(index)}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  index === active ? "w-8 bg-white" : "w-4 bg-white/40 hover:bg-white/70"
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <span className="text-xs font-medium tabular-nums text-white/70">
            {active + 1} / {BANNERS.length}
          </span>
        </div>
    </section>
  );
}