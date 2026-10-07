"use client";

import * as React from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AnimatedBackground({ className, children }: { className?: string; children: ReactNode }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animationRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      hue: number;
      type: "circle" | "line" | "dot";
    };

    const particles: Particle[] = [];
    const particleCount = Math.min(60, Math.floor((canvas.width * canvas.height) / 20000));

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.15 + 0.03,
          hue: Math.random() > 0.6 ? 270 + Math.random() * 30 : 220 + Math.random() * 30,
          type: Math.random() > 0.8 ? "line" : Math.random() > 0.6 ? "dot" : "circle",
        });
      }
    };

    initParticles();

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createRadialGradient(
        mouseX, mouseY, 0,
        mouseX, mouseY, Math.max(canvas.width, canvas.height) * 0.8
      );
      gradient.addColorStop(0, "rgba(90, 8, 145, 0.02)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 180;

        if (dist < maxDist && dist > 0) {
          const force = (maxDist - dist) / maxDist * 0.015;
          p.vx -= (dx / dist) * force;
          p.vy -= (dy / dist) * force;
        }

        p.vx *= 0.995;
        p.vy *= 0.995;

        if (p.x < 0) { p.x = canvas.width; p.vx = Math.abs(p.vx); }
        if (p.x > canvas.width) { p.x = 0; p.vx = -Math.abs(p.vx); }
        if (p.y < 0) { p.y = canvas.height; p.vy = Math.abs(p.vy); }
        if (p.y > canvas.height) { p.y = 0; p.vy = -Math.abs(p.vy); }

        ctx.save();
        ctx.globalAlpha = p.opacity;

        if (p.type === "circle") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 50%, 40%, ${p.opacity})`;
          ctx.fill();
        } else if (p.type === "dot") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.5, p.size * 0.3), 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 50%, 45%, ${p.opacity * 1.5})`;
          ctx.fill();
        } else if (p.type === "line") {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 15, p.y + p.vy * 15);
          ctx.strokeStyle = `hsla(${p.hue}, 50%, 40%, ${p.opacity * 0.8})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }

        for (const p2 of particles) {
          if (p === p2) continue;
          const dx2 = p2.x - p.x;
          const dy2 = p2.y - p.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (dist2 < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(270, 50%, 40%, ${0.015 * (1 - dist2 / 100)})`;
            ctx.lineWidth = 0.2;
            ctx.stroke();
          }
        }

        ctx.restore();
      }

      const time = Date.now() * 0.001;
      for (let i = 0; i < 2; i++) {
        const x = canvas.width * 0.5 + Math.sin(time * 0.15 + i * 3) * canvas.width * 0.25;
        const y = canvas.height * 0.5 + Math.cos(time * 0.1 + i * 3) * canvas.height * 0.2;
        const r = 200 + Math.sin(time * 0.3 + i) * 80;

        const glow = ctx.createRadialGradient(x, y, 0, x, y, r);
        glow.addColorStop(0, "rgba(90, 8, 145, 0.01)");
        glow.addColorStop(1, "rgba(90, 8, 145, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <>
      <div className={cn("fixed inset-0 -z-10 overflow-hidden pointer-events-none", className)} aria-hidden="true">
        <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50 to-white" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(90,8,145,0.02)_0%,_transparent_70%)]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(1.5px 1.5px at 20px 30px, rgba(90,8,145,0.08), transparent),
            radial-gradient(1px 1px at 40px 70px, rgba(90,8,145,0.04), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(90,8,145,0.06), transparent),
            radial-gradient(1.5px 1.5px at 130px 80px, rgba(90,8,145,0.03), transparent),
            radial-gradient(1px 1px at 160px 30px, rgba(90,8,145,0.05), transparent)
          `,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 100px",
          animation: "noiseShift 30s linear infinite"
        }} />
        <style jsx global>{`
          @keyframes noiseShift {
            0% { transform: translate(0, 0); }
            25% { transform: translate(-3px, -2px); }
            50% { transform: translate(2px, -3px); }
            75% { transform: translate(-2px, 3px); }
            100% { transform: translate(0, 0); }
          }
        `}</style>
      </div>
      <div className="relative z-10 min-h-screen bg-white">
        {children}
      </div>
    </>
  );
}