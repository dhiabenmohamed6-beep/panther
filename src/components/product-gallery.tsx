"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SwipeBanner } from "./swipe-banner";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  position: number;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  className?: string;
}

export function ProductGallery({ images, className }: ProductGalleryProps) {
  return (
    <section id="gallery" className={cn("py-20 md:py-32 bg-white", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <span className="text-xs font-medium tracking-widest uppercase text-purple-600">DETAILS</span>
          <h2 className="mt-2 font-bold tracking-tight uppercase text-3xl md:text-4xl lg:text-5xl text-black">
            PRODUCT <span className="text-purple-600">GALLERY</span>
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <SwipeBanner
            images={images}
            autoPlay={true}
            autoPlayInterval={4000}
            className="rounded-xl overflow-hidden border border-black/10 shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}