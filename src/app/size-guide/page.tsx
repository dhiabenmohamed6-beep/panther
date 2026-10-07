import { Metadata } from "next";
import Link from "next/link";
import { Marquee } from "@/components/marquee";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnimatedBackground } from "@/components/animated-background";
import { Button } from "@/components/ui/button";
import { Ruler } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Size Guide",
  description: "Measurements for the Panther Oversized Tee, in centimeters.",
};

export const dynamic = "force-dynamic";

export default async function SizeGuidePage() {
  const sizes = await prisma.sizeGuide.findMany({ orderBy: { size: "asc" } });

  return (
    <AnimatedBackground>
      <>
        <Marquee />
        <Navbar />
        <main id="main-content" className="min-h-screen bg-white pt-16 pb-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <header className="border-b border-black/10 py-16">
              <span className="text-xs font-medium tracking-widest uppercase text-purple-600">Fit Guide</span>
              <h1 className="mt-2 font-bold tracking-tight uppercase text-4xl md:text-5xl text-black leading-[1.05]">
                Size <span className="text-purple-600">Guide</span>
              </h1>
              <p className="mt-4 text-lg text-black/60 leading-relaxed">
                All measurements are in centimeters and refer to the garment laid flat, not to body
                measurements. Our shirts use an oversized, drop-shoulder cut.
              </p>
            </header>

            {sizes.length > 0 ? (
              <div className="py-12">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-black/10">
                        <th className="pb-3 pr-4 font-medium tracking-wider uppercase text-xs text-black/60">Size</th>
                        <th className="pb-3 pr-4 font-medium tracking-wider uppercase text-xs text-black/60">Chest (cm)</th>
                        <th className="pb-3 pr-4 font-medium tracking-wider uppercase text-xs text-black/60">Length (cm)</th>
                        <th className="pb-3 font-medium tracking-wider uppercase text-xs text-black/60">Shoulder (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizes.map((size) => (
                        <tr key={size.id} className="border-b border-black/5">
                          <td className="py-4 pr-4 font-bold text-black">{size.size}</td>
                          <td className="py-4 pr-4 text-black/70">{size.chest}</td>
                          <td className="py-4 pr-4 text-black/70">{size.length}</td>
                          <td className="py-4 text-black/70">{size.shoulder}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-10 rounded-xl border border-black/10 bg-white p-6">
                  <h2 className="flex items-center gap-2 font-bold tracking-tight uppercase text-lg text-black">
                    <Ruler className="h-5 w-5 text-purple-600" aria-hidden="true" />
                    How to measure
                  </h2>
                  <ul className="mt-4 space-y-2 text-sm text-black/65 leading-relaxed">
                    <li>
                      <strong className="text-black">Chest</strong> — measure straight across the body,
                      one finger below the armpit, keeping the tape level and not pulling tight.
                    </li>
                    <li>
                      <strong className="text-black">Length</strong> — measure from the highest point of
                      the shoulder straight down to the bottom hem.
                    </li>
                    <li>
                      <strong className="text-black">Shoulder</strong> — measure across the back from one
                      seam to the other, across the widest part of the shoulder.
                    </li>
                  </ul>
                  <p className="mt-4 text-sm text-black/60">
                    Between two sizes? Take the larger one for the intended oversized fit.
                  </p>
                </div>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/shop">SHOP THE TEE</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/contact">ASK A QUESTION</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center">
                <Ruler className="mx-auto h-12 w-12 text-black/20" aria-hidden="true" />
                <h2 className="mt-6 font-bold tracking-tight uppercase text-xl text-black">SIZE GUIDE UNAVAILABLE</h2>
                <p className="mt-2 text-black/50">
                  No measurements have been published yet. Contact us and we will help you pick a size.
                </p>
                <Button size="lg" className="mt-8" asChild>
                  <Link href="/contact">CONTACT US</Link>
                </Button>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </>
    </AnimatedBackground>
  );
}