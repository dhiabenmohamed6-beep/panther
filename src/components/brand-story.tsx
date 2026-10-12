"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BrandStoryProps {
  className?: string;
}

export function BrandStory({ className }: BrandStoryProps) {
  return (
    <section
      id="story"
      className={cn("relative overflow-hidden bg-black", className)}
    >
      {/* Subtle purple glow top */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 min-h-[90vh]">

          {/* ── LEFT: text ── */}
          <div className="flex flex-col justify-center py-20 md:py-28 pr-0 lg:pr-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-purple-400">
                Philosophy
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
              className="mt-4 font-black tracking-tighter uppercase text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.0]"
            >
              THE PANTHER{" "}
              <span className="text-purple-500">MINDSET</span>
            </motion.h2>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
              className="mt-8 mb-8 h-px bg-white/10 origin-left"
            />

            {/* Quote 1 */}
            <motion.blockquote
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
              className="relative pl-6 border-l-2 border-purple-500"
            >
              <p className="font-bold tracking-tight uppercase text-xl sm:text-2xl text-white leading-snug">
                "In times of crisis,<br />
                the wise build bridges.<br />
                While the foolish build barriers."
              </p>
            </motion.blockquote>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
              className="mt-8 text-base sm:text-lg text-white/50 leading-relaxed max-w-lg"
            >
              Panther was built around a simple idea: strength doesn&apos;t need to shout.
              Every detail — heavyweight fabric, oversized structure, reinforced seams — is
              designed for those who train hard and move with intention.
            </motion.p>

            {/* Quote 2 */}
            <motion.blockquote
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
              className="mt-10 pl-6 border-l-2 border-purple-500/50"
            >
              <p className="font-bold tracking-tight uppercase text-lg sm:text-xl text-white/80 leading-snug">
                "You get to decide<br />
                what kind of king<br />
                you are going to be."
              </p>
            </motion.blockquote>

            {/* Brand tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              {["BUILT DIFFERENT", "HEAVYWEIGHT", "OVERSIZED", "ONE STANDARD"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-xs font-semibold tracking-widest uppercase text-purple-400 border border-purple-500/30 rounded-full bg-purple-500/5"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: image panel ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
            className="relative hidden lg:flex items-stretch"
          >
            {/* Vertical separator */}
            <div className="absolute left-0 top-16 bottom-16 w-px bg-white/5" aria-hidden="true" />

            <div className="relative w-full overflow-hidden">
              {/* Dark overlay gradient over image */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/10 to-black/60 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10" />

              <img
                src="/images/Panther_ Built Different.png"
                alt="Panther — Built Different"
                className="h-full w-full object-cover object-center"
              />

              {/* Bottom badge */}
              <div className="absolute bottom-10 left-10 z-20">
                <p className="font-black tracking-widest uppercase text-3xl text-white leading-none">
                  PANTHER
                </p>
                <p className="mt-1 text-xs font-semibold tracking-[0.4em] uppercase text-purple-400">
                  Built Different
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Subtle purple glow bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
