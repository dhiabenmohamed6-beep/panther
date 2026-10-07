"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useMarqueeMessages } from "@/hooks/use-storefront";

interface MarqueeMessage {
  id: string;
  text: string;
  enabled: boolean;
  position: number;
}

interface MarqueeProps {
  messages?: MarqueeMessage[];
  speed?: number;
  paused?: boolean;
  className?: string;
}

const MARQUEE_KEYFRAMES = `
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
`;

export function Marquee({
  messages: messagesProp,
  speed = 50,
  paused = false,
  className,
}: MarqueeProps) {
  const databaseMessages = useMarqueeMessages();
  const messages = messagesProp ?? databaseMessages;

  const content = React.useMemo(() => {
    const enabled = messages.filter((m) => m.enabled).sort((a, b) => a.position - b.position);
    return enabled.map((m) => m.text);
  }, [messages]);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (paused || content.length === 0) return;

    const container = containerRef.current;
    const contentEl = contentRef.current;
    if (!container || !contentEl) return;

    const containerWidth = container.offsetWidth;
    const contentWidth = contentEl.offsetWidth;
    if (containerWidth === 0 || contentWidth === 0) return;

    const totalWidth = contentWidth;
    const duration = (totalWidth / speed) * 1000;

    contentEl.style.animationDuration = `${duration}ms`;
    contentEl.style.animationPlayState = paused ? "paused" : "running";
  }, [speed, paused, content.length]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MARQUEE_KEYFRAMES }} />
      <div
        ref={containerRef}
        className={cn("overflow-hidden bg-black border-b border-white/10", className)}
        aria-live="polite"
        aria-label="Annonces"
      >
        <div
          ref={contentRef}
          className="flex whitespace-nowrap will-change-transform"
          style={{
            animationName: "marquee",
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
          } as React.CSSProperties}
        >
          {content.map((text, i) => (
            <span key={i} className="px-8 py-2 text-sm font-medium tracking-wider uppercase text-white/60">
              {text}
              <span className="mx-8 text-purple-500" aria-hidden="true">◆</span>
            </span>
          ))}
          {content.map((text, i) => (
            <span key={`${i}-clone`} className="px-8 py-2 text-sm font-medium tracking-wider uppercase text-white/60">
              {text}
              <span className="mx-8 text-purple-500" aria-hidden="true">◆</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}