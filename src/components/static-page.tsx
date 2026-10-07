"use client";

import * as React from "react";
import { Marquee } from "@/components/marquee";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnimatedBackground } from "@/components/animated-background";

export interface StaticSection {
  heading: string;
  body: string[];
}

interface StaticPageProps {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  sections: StaticSection[];
  updated?: string;
}

export function StaticPage({ eyebrow, title, intro, sections, updated }: StaticPageProps) {
  return (
    <AnimatedBackground>
      <>
        <Marquee />
        <Navbar />
        <main id="main-content" className="min-h-screen bg-white pt-16 pb-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <header className="border-b border-black/10 py-16">
              <span className="text-xs font-medium tracking-widest uppercase text-purple-600">
                {eyebrow}
              </span>
              <h1 className="mt-2 font-bold tracking-tight uppercase text-4xl md:text-5xl text-black leading-[1.05]">
                {title}
              </h1>
              {intro && <p className="mt-4 text-lg text-black/60 leading-relaxed">{intro}</p>}
              {updated && <p className="mt-4 text-sm text-black/40">Last updated: {updated}</p>}
            </header>

            <div className="space-y-10 py-12">
              {sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-bold tracking-tight uppercase text-xl text-black">
                    {section.heading}
                  </h2>
                  <div className="mt-3 space-y-3">
                    {section.body.map((paragraph, index) => (
                      <p key={index} className="text-black/65 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </>
    </AnimatedBackground>
  );
}