import { Metadata } from "next";
import { Marquee } from "@/components/marquee";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AthletesSection } from "@/components/athletes-section";
import { AnimatedBackground } from "@/components/animated-background";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Athletes",
  description: "Meet the Panther crew — the athletes who represent the brand.",
};

export const dynamic = "force-dynamic";

export default async function AthletesPage() {
  const athletes = await prisma.athlete.findMany({ orderBy: { position: "asc" } });

  return (
    <AnimatedBackground>
      <>
        <Marquee />
        <Navbar />
        <main id="main-content" className="min-h-screen bg-white pt-16">
          <section className="relative py-20 md:py-32 bg-white">
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-600/5 to-transparent"
              aria-hidden="true"
            />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center">
                <span className="text-xs font-medium tracking-widest uppercase text-purple-600">Community</span>
                <h1 className="mt-2 font-bold tracking-tight uppercase text-4xl md:text-5xl lg:text-6xl text-black leading-[1.05]">
                  THE PANTHER <span className="text-purple-600">ATHLETES</span>
                </h1>
                <p className="mt-4 text-lg md:text-xl text-black/60 max-w-2xl mx-auto">
                  The people who wear the shirt and set the standard.
                </p>
              </div>
            </div>
          </section>
          <AthletesSection athletes={athletes} />
        </main>
        <Footer />
      </>
    </AnimatedBackground>
  );
}