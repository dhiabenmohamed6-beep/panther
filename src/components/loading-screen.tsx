"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  isLoading: boolean;
  className?: string;
}

export function LoadingScreen({ isLoading, className }: LoadingScreenProps) {
  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }}
          className={cn(
            "fixed inset-0 z-[100] flex items-center justify-center bg-white",
            className
          )}
          role="status"
          aria-label="Loading PANTHER"
        >
          <div className="flex flex-col items-center">

            {/* Logo — mix-blend-mode:multiply removes the white background */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="mb-6"
            >
              <img
                src="/images/logo.png"
                alt="PANTHER"
                className="w-28 h-28 object-contain"
                style={{ mixBlendMode: "multiply" }}
              />
            </motion.div>

            {/* Brand name */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-black tracking-[0.3em] uppercase text-2xl text-black"
            >
              PANTHER
            </motion.p>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
              className="mt-1 text-[11px] font-semibold tracking-[0.35em] uppercase text-black/40"
            >
              BUILT DIFFERENT.
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 w-40 h-[2px] bg-black/8 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "loop",
                }}
              />
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
