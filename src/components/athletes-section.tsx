"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface Athlete {
  id: string;
  name: string;
  instagram: string | null;
  description: string | null;
  image: string | null;
  featured: boolean;
}

interface AthletesSectionProps {
  athletes: Athlete[];
  className?: string;
}

export function AthletesSection({ athletes, className }: AthletesSectionProps) {
  const featuredAthletes = athletes.filter((a) => a.featured);

  return (
    <section id="athletes" className={cn("py-20 md:py-32 bg-white", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <span className="text-xs font-medium tracking-widest uppercase text-purple-600">COMMUNITY</span>
          <h2 className="mt-2 font-bold tracking-tight uppercase text-3xl md:text-4xl lg:text-5xl text-black">
            THE PANTHER <span className="text-purple-600">CREW</span>
          </h2>
        </motion.div>

        {featuredAthletes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredAthletes.map((athlete, index) => (
              <motion.article
                key={athlete.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.1 }}
                className="group relative bg-white border border-black/10 overflow-hidden hover:border-purple-600/50 transition-all duration-500"
              >
                <div className="aspect-square relative overflow-hidden">
                  {athlete.image ? (
                    <Image
                      src={athlete.image}
                      alt={athlete.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white border border-black/10">
                      <svg className="w-16 h-16 text-black/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold tracking-tight uppercase text-xl text-black mb-2">{athlete.name}</h3>
                  {athlete.description && (
                    <p className="text-black/60 text-sm leading-relaxed mb-4 line-clamp-3">{athlete.description}</p>
                  )}
                  {athlete.instagram && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="w-full justify-start gap-2 text-black/70 hover:text-purple-600"
                    >
                      <a
                        href={athlete.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        @{athlete.instagram.replace("https://instagram.com/", "").replace("/", "")}
                      </a>
                    </Button>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-black/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-bold tracking-tight uppercase text-2xl text-black mb-2">NO ATHLETES YET</h3>
            <p className="text-black/50 max-w-md mx-auto">Be the first to join the pride. Athletes will appear here once added from the admin panel.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}