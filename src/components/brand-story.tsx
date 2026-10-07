"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BrandStoryProps {
  className?: string;
}

export function BrandStory({ className }: BrandStoryProps) {
  return (
    <section id="story" className={cn("relative py-20 md:py-32 bg-white overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-600/5 to-transparent" aria-hidden="true" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <span className="text-xs font-medium tracking-widest uppercase text-purple-600">PHILOSOPHY</span>
          <h2 className="mt-2 font-bold tracking-tight uppercase text-3xl md:text-4xl lg:text-5xl text-black">
            THE PANTHER <span className="text-purple-600">MINDSET</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-8"
          >
            <blockquote className="border-l-4 border-purple-600 pl-6 lg:pl-8">
              <p className="font-bold tracking-tight uppercase text-2xl md:text-3xl lg:text-4xl text-black leading-tight">
                "IN TIMES OF CRISIS,<br />
                THE WISE BUILD BRIDGES.<br />
                WHILE THE FOOLISH BUILD BARRIERS."
              </p>
            </blockquote>

            <p className="text-lg md:text-xl text-black/60 leading-relaxed max-w-xl">
              Panther was built around a simple idea: strength doesn&apos;t need to shout.
            </p>

            <p className="text-lg md:text-xl text-black/60 leading-relaxed max-w-xl">
              Every detail of the Panther Oversized Tee is designed around movement, comfort and presence.
              Heavyweight fabric. Oversized structure. A silhouette designed for training and the streets.
            </p>

            <blockquote className="border-l-4 border-purple-600 pl-6 lg:pl-8 pt-4">
              <p className="font-bold tracking-tight uppercase text-xl md:text-2xl text-black leading-tight">
                "YOU GET TO DECIDE<br />
                WHAT KIND OF KING<br />
                YOU ARE GOING TO BE."
              </p>
            </blockquote>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] bg-white border border-black/10 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(90,8,145,0.15)_0%,_transparent_70%)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-8">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full border-2 border-purple-600/30 flex items-center justify-center">
                    <svg className="w-16 h-16 text-purple-600/50" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 2L22 8V24L16 30L10 24V8L16 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                      <path d="M16 10V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M10 16H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p className="font-bold tracking-widest uppercase text-2xl md:text-3xl text-black mb-2">PANTHER</p>
                  <p className="text-black/50 tracking-wider uppercase text-sm">MINDSET</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}