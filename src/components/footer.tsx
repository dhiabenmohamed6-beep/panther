"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MessageSquare, Mail, Phone } from "lucide-react";
import { useStoreSettings } from "@/hooks/use-storefront";

interface FooterProps {
  instagramUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  className?: string;
}

export function Footer({
  instagramUrl,
  contactEmail,
  contactPhone,
  className,
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const settings = useStoreSettings();

  const brandName = settings.brandName;
  const instagram = instagramUrl ?? settings.instagramUrl;
  const email = contactEmail ?? settings.contactEmail;
  const phone = contactPhone ?? settings.contactPhone ?? undefined;
  const tagline = settings.tagline;

  const footerLinks = {
    SHOP: [
      { label: "All Products", href: "/shop" },
      { label: "Oversized Tee", href: "/shop?product=panther-oversized-tee" },
      { label: "Size Guide", href: "/size-guide" },
    ],
    COMPANY: [
      { label: "Our Story", href: "/story" },
      { label: "Contact", href: "/contact" },
      { label: "Athletes", href: "/athletes" },
    ],
    SUPPORT: [
      { label: "FAQ", href: "/faq" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
    ],
    LEGAL: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  };

  return (
    <footer className={cn("bg-white border-t border-black/10", className)} role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Link href="/" className="flex items-center gap-2 text-black font-bold tracking-widest text-2xl mb-6" aria-label={`${brandName} - Accueil`}>
              <img
                src={settings.logo || "/images/logo.png"}
                alt={brandName}
                className="h-12 w-auto"
                aria-hidden="true"
              />
              {brandName}
            </Link>
            <p className="text-black/50 max-w-xs mb-6 leading-relaxed">
              {tagline}
            </p>
            <div className="flex items-center gap-4">
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full border border-black/20 text-black/60 hover:text-purple-600 hover:border-purple-500/50 transition-all duration-300"
                aria-label="Suivez-nous sur Instagram"
              >
                <MessageSquare className="h-5 w-5" />
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-black/20 text-black/60 hover:text-purple-600 hover:border-purple-500/50 transition-all duration-300"
                aria-label="Contactez-nous par email"
              >
                <Mail className="h-5 w-5" />
              </a>
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-black/20 text-black/60 hover:text-purple-600 hover:border-purple-500/50 transition-all duration-300"
                  aria-label="Appelez-nous"
                >
                  <Phone className="h-5 w-5" />
                </a>
              )}
            </div>
          </motion.div>

          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.nav
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 + index * 0.05 }}
              aria-label={category}
            >
              <h4 className="font-bold tracking-wider uppercase text-sm text-black mb-4">{category}</h4>
              <ul className="space-y-3" role="list">
                {links.map((link, linkIndex) => (
                  <li key={`${category}-${linkIndex}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="text-black/60 hover:text-purple-600 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 lg:mt-16 pt-8 border-t border-black/10 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-black/40 text-sm">
            © {currentYear} {brandName}. ALL RIGHTS RESERVED.
          </p>
          <p className="text-black/40 text-sm">
            {tagline}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}