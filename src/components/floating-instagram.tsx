"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

interface FloatingInstagramProps {
  href?: string;
  className?: string;
}

export function FloatingInstagram({ href = "https://instagram.com/panther", className }: FloatingInstagramProps) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-white border border-black/20",
        "hover:bg-black/5 hover:border-purple-600/50 transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-white",
        className
      )}
      aria-label="Follow us on Instagram"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ scale: 1.1, rotate: 3 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageSquare className="h-7 w-7 text-black group-hover:text-purple-600 transition-colors" aria-hidden="true" />
      <motion.div
        className="absolute inset-0 rounded-full border border-purple-600/50"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
    </motion.a>
  );
}