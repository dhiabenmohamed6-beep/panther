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
          exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }}
          className={cn(
            "fixed inset-0 z-[100] flex items-center justify-center bg-white",
            className
          )}
          role="status"
          aria-label="Chargement de PANTHER"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="mb-6"
            >
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 mx-auto text-black">
                <path d="M16 2L22 8V24L16 30L10 24V8L16 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M16 10V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M10 16H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-bold tracking-tight uppercase text-3xl md:text-4xl text-black mb-2"
            >
              PANTHER
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-black/50 tracking-wider uppercase text-sm"
            >
              BUILT DIFFERENT.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="mt-8 w-48 mx-auto h-0.5 bg-black/10 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 to-purple-700 rounded-full"
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "left" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}