"use client";

import * as React from "react";

/**
 * Decorative artwork shared by the auth brand panels: diagonal pinstripes, a
 * large panther-head watermark, and a concentric ring motif. Purely presentational.
 */
export function BrandGraphics({ id }: { id: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id={`${id}-stripes`}
            width="14"
            height="14"
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="0" y2="14" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.07" />
          </pattern>
          <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id}-stripes)`} />
        <rect width="100%" height="100%" fill={`url(#${id}-fade)`} />
      </svg>

      {/* Oversized panther watermark, cropped by the panel edge */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo.png"
        alt=""
        className="absolute -bottom-24 -right-16 w-[26rem] max-w-none opacity-[0.12] [filter:brightness(0)_invert(1)]"
      />

      {/* Concentric ring motif */}
      <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full border border-white/10" />
      <div className="absolute -right-20 top-1/3 h-72 w-72 rounded-full border border-white/[0.08]" />

      {/* Corner diamonds */}
      <div className="absolute left-8 top-1/2 h-2 w-2 rotate-45 bg-white/30" />
      <div className="absolute left-8 top-1/2 mt-8 h-1.5 w-1.5 rotate-45 bg-white/20" />
    </div>
  );
}