"use client";

import React, { Suspense } from "react";
import { Marquee } from "@/components/marquee";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Mail, Phone, MessageSquare, MapPin, Send } from "lucide-react";
import { AnimatedBackground } from "@/components/animated-background";

function NavbarSuspenseFallback() {
  return <nav className="h-16" aria-hidden="true" />;
}

export function ContactContent() {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to send message");

      toast({
        title: "Message sent",
        description: "We'll get back to you within 24 hours.",
        variant: "success",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
                <span className="text-xs font-medium tracking-widest uppercase text-purple-600">GET IN TOUCH</span>
                <h1 className="mt-2 font-bold tracking-tight uppercase text-4xl md:text-5xl lg:text-6xl text-black leading-[1.05]">
                  CONTACT <span className="text-purple-600">US</span>
                </h1>
                <p className="mt-4 text-lg md:text-xl text-black/60 max-w-2xl mx-auto">
                  Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </div>
            </div>
          </section>

          <section className="py-20 md:py-32 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white border border-black/10 flex items-center justify-center">
                        <Mail className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold tracking-tight uppercase text-lg text-black">EMAIL</h3>
                        <a href="mailto:contact@panther.com" className="text-black/60 hover:text-purple-600 transition-colors mt-1 block">
                          contact@panther.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white border border-black/10 flex items-center justify-center">
                        <Phone className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold tracking-tight uppercase text-lg text-black">PHONE</h3>
                        <a href="tel:+33123456789" className="text-black/60 hover:text-purple-600 transition-colors mt-1 block">
                          +33 1 23 45 67 89
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white border border-black/10 flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold tracking-tight uppercase text-lg text-black">INSTAGRAM</h3>
                        <a href="https://instagram.com/panther" target="_blank" rel="noopener noreferrer" className="text-black/60 hover:text-purple-600 transition-colors mt-1 block">
                          @panther
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white border border-black/10 flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold tracking-tight uppercase text-lg text-black">ADDRESS</h3>
                        <p className="text-black/60 mt-1">Paris, France</p>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">NAME</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">EMAIL</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject">SUBJECT</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What's this about?"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">MESSAGE</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Your message..."
                      rows={5}
                      className="mt-2"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
                    <span className="flex items-center gap-2">
                      SEND MESSAGE
                      <Send className="h-5 w-5" />
                    </span>
                  </Button>
                </form>
              </div>
            </div>
          </section>

          <Footer
            instagramUrl="https://instagram.com/panther"
            contactEmail="contact@panther.com"
            contactPhone="+33 1 23 45 67 89"
          />
        </main>
      </>
    </AnimatedBackground>
  );
}