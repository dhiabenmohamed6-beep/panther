"use client";

import * as React from "react";
import { Marquee } from "@/components/marquee";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnimatedBackground } from "@/components/animated-background";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";

const FAQS = [
  {
    question: "How do I choose my size?",
    answer:
      "Our shirts use an oversized, drop-shoulder cut. If you are between sizes and want a relaxed fit, size up. The full measurement table is on the Size Guide page.",
    },
  {
    question: "What material are the shirts made of?",
    answer:
      "280gsm heavyweight premium cotton with reinforced seams and premium stitching. The fabric softens slightly with every wash while keeping its structure.",
  },
  {
    question: "When will my order ship?",
    answer:
      "Orders placed before 2:00 PM on a business day are packed the same day and ship the next business day. You get an email with tracking as soon as it leaves our warehouse.",
  },
  {
    question: "How much is shipping?",
    answer:
      "Shipping cost is calculated from your cart and address, and the free-shipping threshold is shown on the product page. Orders above that threshold ship free.",
  },
  {
    question: "Can I return an item?",
    answer:
      "Yes. You have 30 days from delivery to request a return on unworn, unwashed items with their tags attached. See the Returns page for the full process.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "Cash on delivery is currently available. Card payment is being integrated and will appear as an option at checkout once it is live.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "We currently ship to Tunisia and across the European Union. Contact us before ordering to other destinations so we can confirm cost and timing.",
  },
  {
    question: "How do I use a promo code?",
    answer:
      "Enter the code in the promo field on the Checkout page and apply it. Valid codes are applied to your order total immediately and are confirmed before you pay.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once your order ships you receive a tracking email. Signed-in customers can also see live order status under My Orders in your account.",
  },
  {
    question: "I forgot my password. What do I do?",
    answer:
      "Use the Forgot password link on the login page. We will send a reset link to the address on your account so you can choose a new password.",
  },
];

export function FaqContent() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <AnimatedBackground>
      <>
        <Marquee />
        <Navbar />
        <main id="main-content" className="min-h-screen bg-white pt-16 pb-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <header className="border-b border-black/10 py-16">
              <span className="text-xs font-medium tracking-widest uppercase text-purple-600">Support</span>
              <h1 className="mt-2 font-bold tracking-tight uppercase text-4xl md:text-5xl text-black leading-[1.05]">
                Frequently Asked <span className="text-purple-600">Questions</span>
              </h1>
              <p className="mt-4 text-lg text-black/60 leading-relaxed">
                Quick answers about sizing, shipping, returns and payment.
              </p>
            </header>

            <div className="py-12">
              <dl className="divide-y divide-black/10 border-y border-black/10">
                {FAQS.map((faq, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <div key={faq.question}>
                      <dt>
                        <button
                          type="button"
                          onClick={() => setOpenIndex(isOpen ? null : index)}
                          aria-expanded={isOpen}
                          className="flex w-full items-center justify-between gap-4 py-5 text-left"
                        >
                          <span className="font-medium text-black">{faq.question}</span>
                          <span className="shrink-0 text-purple-600">
                            {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                          </span>
                        </button>
                      </dt>
                      {isOpen && (
                        <dd className="pb-5 pr-8 text-black/65 leading-relaxed">{faq.answer}</dd>
                      )}
                    </div>
                  );
                })}
              </dl>

              <p className="mt-10 text-sm text-black/50">
                Still stuck?{" "}
                <Link href="/contact" className="text-purple-600 underline underline-offset-4">
                  Contact our team
                </Link>{" "}
                and we will answer you directly.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    </AnimatedBackground>
  );
}