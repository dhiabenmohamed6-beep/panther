"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface CustomCursorProps {
  className?: string;
}

export function CustomCursor({ className }: CustomCursorProps) {
  const pathname = usePathname();
  const positionRef = React.useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = React.useState(false);
  const [cursorType, setCursorType] = React.useState<"default" | "pointer" | "drag" | "view">("default");
  const cursorRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname?.startsWith("/admin")) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const updatePosition = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
      updateCursorPosition();
    };

    const updateCursorPosition = () => {
      const cursor = cursorRef.current;
      if (cursor) {
        cursor.style.left = `${positionRef.current.x}px`;
        cursor.style.top = `${positionRef.current.y}px`;
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handlePointerOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (target.closest("a, button, [role=button], input, select, textarea, .cursor-pointer")) {
        setCursorType("pointer");
      } else if (target.closest("[data-draggable], .cursor-drag")) {
        setCursorType("drag");
      } else if (target.closest("[data-viewable], .cursor-view")) {
        setCursorType("view");
      } else {
        setCursorType("default");
      }
    };

    window.addEventListener("mousemove", updatePosition, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("pointerover", handlePointerOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("pointerover", handlePointerOver);
    };
  }, [isVisible, pathname]);

  if (pathname?.startsWith("/admin")) return null;
  if (!isVisible) return null;

  const cursorStyles = {
    default: { width: 12, height: 12, borderWidth: 2, opacity: 0.8 },
    pointer: { width: 40, height: 40, borderWidth: 1, opacity: 0.4 },
    drag: { width: 50, height: 50, borderWidth: 1, opacity: 0.3 },
    view: { width: 40, height: 40, borderWidth: 1, opacity: 0.4 },
  };

  const style = cursorStyles[cursorType];

  return (
    <motion.div
      ref={cursorRef}
      className={cn(
        "fixed pointer-events-none z-[9999] rounded-full border-white/50 bg-transparent",
        "transition-colors duration-200",
        className
      )}
      style={{
        left: positionRef.current.x,
        top: positionRef.current.y,
        width: style.width,
        height: style.height,
        borderWidth: style.borderWidth,
        opacity: style.opacity,
        transform: "translate(-50%, -50%)",
        mixBlendMode: "difference",
      }}
      animate={{
        scale: cursorType !== "default" ? 1 : [1, 1.2, 1],
      }}
      transition={{ duration: cursorType !== "default" ? 0.2 : 2, repeat: cursorType !== "default" ? 0 : Infinity }}
    >
      {cursorType === "pointer" && (
        <motion.span
          className="absolute inset-0 flex items-center justify-center text-white/50 text-xs font-medium tracking-wider uppercase"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          CLICK
        </motion.span>
      )}
      {cursorType === "drag" && (
        <motion.span
          className="absolute inset-0 flex items-center justify-center text-white/50 text-xs font-medium tracking-wider uppercase"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          DRAG TO ROTATE
        </motion.span>
      )}
      {cursorType === "view" && (
        <motion.span
          className="absolute inset-0 flex items-center justify-center text-white/50 text-xs font-medium tracking-wider uppercase"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          VIEW
        </motion.span>
      )}
    </motion.div>
  );
}