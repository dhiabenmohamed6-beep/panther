"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  className?: string;
}

export function Hero({ className }: HeroProps) {
  const scrollDown = () => {
    const nextSection = document.getElementById("product");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className={cn(
        "relative min-h-screen flex items-center justify-center overflow-hidden",
        className
      )}
      aria-labelledby="hero-title"
    >
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <img
          src="/images/banner.png"
          alt="PANTHER hero banner"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />
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
    </section>
  );
}