"use client";

import React, { Suspense } from "react";
import { Marquee } from "@/components/marquee";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BrandStory } from "@/components/brand-story";
import { AthletesSection } from "@/components/athletes-section";
import { FeaturesSection } from "@/components/features-section";
import { AnimatedBackground } from "@/components/animated-background";
import { useAthletes } from "@/hooks/use-storefront";

function NavbarSuspenseFallback() {
  return <nav className="h-16" aria-hidden="true" />;
}

export function StoryContent() {
  const { data: athletes } = useAthletes();

  return (
    <AnimatedBackground>
      <>
        <Marquee />
        <Suspense fallback={<NavbarSuspenseFallback />}>
          <Navbar />
        </Suspense>
        <main id="main-content" className="min-h-screen pt-16">
          <section className="relative py-20 md:py-32 bg-white">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-600/5 to-transparent" aria-hidden="true" />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center">
                <span className="text-xs font-medium tracking-widest uppercase text-purple-600">PHILOSOPHY</span>
                <h1 className="mt-2 font-bold tracking-tight uppercase text-4xl md:text-5xl lg:text-6xl text-black leading-[1.05]">
                  OUR <span className="text-purple-600">STORY</span>
                </h1>
                <p className="mt-4 text-lg md:text-xl text-black/60 max-w-2xl mx-auto">
                  Discover the philosophy behind the brand. Strength doesn't need to shout.
                </p>
              </div>
            </div>
          </section>

          <BrandStory />
          <FeaturesSection />
          <AthletesSection athletes={athletes} />

          <Footer />
        </main>
      </>
    </AnimatedBackground>
  );
}