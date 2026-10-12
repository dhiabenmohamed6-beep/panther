"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const sorted = [...images].sort((a, b) => a.position - b.position);

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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {sorted.map((image, i) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                ease: [0.25, 0.1, 0.25, 1],
                delay: i * 0.1,
              }}
              className="overflow-hidden rounded-xl border border-black/10 shadow-sm group"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
