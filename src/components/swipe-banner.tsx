"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  position: number;
}

interface SwipeBannerProps {
  images: GalleryImage[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 1.1,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.95,
  }),
};

export function SwipeBanner({
  images,
  className,
  autoPlay = true,
  autoPlayInterval = 5000,
}: SwipeBannerProps) {
  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const touchStartX = React.useRef<number | null>(null);
  const touchEndX = React.useRef<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const safeImages = images.length > 0 ? images : [{ id: "0", url: "/images/bloc1.png", alt: "Detail View", position: 0 }];
  const count = safeImages.length;

  const goNext = React.useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % count);
  }, [count]);

  const goPrev = React.useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  React.useEffect(() => {
    if (!autoPlay || isPaused || count <= 1) return;
    const timer = setInterval(goNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, isPaused, count, goNext]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      goNext();
    } else if (info.offset.x > threshold) {
      goPrev();
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.touches[0].clientX;
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) goNext();
    if (diff < -50) goPrev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative aspect-[3/4] w-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.5 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <Image
              src={safeImages[index].url}
              alt={safeImages[index].alt}
              fill
              className="object-cover select-none pointer-events-none"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index === 0}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white border border-white/20 transition-all hover:bg-black/50 hover:scale-110"
            aria-label="Image précédente"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm text-white border border-white/20 transition-all hover:bg-black/50 hover:scale-110"
            aria-label="Image suivante"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {safeImages.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index ? "w-8 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80",
                )}
                aria-label={`Aller à l'image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}