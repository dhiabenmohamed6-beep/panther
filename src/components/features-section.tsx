"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Shield, Truck, RotateCcw, Sparkles } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "HEAVYWEIGHT FABRIC",
    description: "280gsm premium cotton. Substantial feel. Built to last.",
  },
  {
    icon: Sparkles,
    title: "OVERSIZED FIT",
    description: "Drop shoulders. Relaxed silhouette. Freedom of movement.",
  },
  {
    icon: RotateCcw,
    title: "BUILT FOR MOVEMENT",
    description: "From heavy lifts to city streets. No restrictions.",
  },
  {
    icon: Truck,
    title: "PREMIUM FINISH",
    description: "Reinforced seams. Premium stitching. Every detail matters.",
  },
];

interface FeaturesSectionProps {
  className?: string;
}

export function FeaturesSection({ className }: FeaturesSectionProps) {
  return (
    <section id="features" className={cn("py-20 md:py-32 bg-white", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <span className="text-xs font-medium tracking-widest uppercase text-purple-600">ENGINEERED</span>
          <h2 className="mt-2 font-bold tracking-tight uppercase text-3xl md:text-4xl lg:text-5xl text-black">
            KEY <span className="text-purple-600">FEATURES</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.1 }}
              className="group relative p-6 lg:p-8 bg-white border border-black/10 hover:border-purple-600/50 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-white border border-black/10 flex items-center justify-center mb-6 group-hover:border-purple-600/50 group-hover:bg-purple-600/10 transition-all duration-500">
                  <feature.icon className="w-7 h-7 text-black group-hover:text-purple-600 transition-colors" aria-hidden="true" />
                </div>
                <h3 className="font-bold tracking-tight uppercase text-xl text-black mb-3">{feature.title}</h3>
                <p className="text-black/60 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}