"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { BrandGraphics } from "@/components/auth-brand-graphics";

const schema = z.object({ email: z.string().email("Enter a valid email address") });
type ForgotInput = z.infer<typeof schema>;

export function ForgotPasswordContent() {
  const [sent, setSent] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [resetUrl, setResetUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotInput>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: ForgotInput) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not send reset link");

      setEmail(data.email);
      setResetUrl(json.resetUrl ?? null);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#2E0A4E] via-[#1D0533] to-[#10021C] px-6 py-10 text-white sm:px-10 lg:w-[46%] lg:px-14 lg:py-14">
        <BrandGraphics id="forgot" />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-purple-600/30 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-fuchsia-700/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-3" aria-label="PANTHER home">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/95">
              <img src="/images/logo.png" alt="" className="h-8 w-auto" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold tracking-[0.2em] text-white">PANTHER</span>
          </Link>
        </div>

        <div className="relative mt-12 lg:mt-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-purple-100">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-200" aria-hidden="true" />
            Account recovery
          </span>
          <h2 className="mt-5 max-w-md text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Reset your password
          </h2>
          <div className="mt-5 h-px w-16 bg-white/40" aria-hidden="true" />
          <p className="mt-5 max-w-md text-sm leading-relaxed text-purple-100/80">
            Enter the email address on your account and we&apos;ll send you a link to choose a new
            password.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <Link
            href="/login"
            className="mb-8 inline-flex items-center gap-2 text-sm text-black/50 transition-colors hover:text-purple-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to sign in
          </Link>

          <div className="flex items-center gap-3 lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/10">
              <img src="/images/logo.png" alt="" className="h-7 w-auto" aria-hidden="true" />
            </span>
            <span className="text-base font-bold tracking-[0.18em] text-black">PANTHER</span>
          </div>

          <h1 className="mt-8 text-2xl font-bold uppercase tracking-tight text-black lg:mt-0 lg:text-3xl">
            Forgot password
          </h1>

          {sent ? (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-emerald-900">Check your inbox</p>
                  <p className="mt-1 text-sm text-emerald-800">
                    If an account exists for <span className="font-medium">{email}</span>, a reset
                    link is on its way. The link expires in 1 hour.
                  </p>
                </div>
              </div>

              {resetUrl ? (
                <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-3">
                  <p className="text-xs font-medium text-purple-950">
                    No mail provider is configured, so here is your reset link:
                  </p>
                  <Link
                    href={resetUrl}
                    className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-purple-700 underline underline-offset-4"
                  >
                    Reset my password
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              ) : null}

              <Link
                href="/login"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 transition-colors hover:text-emerald-700"
              >
                Back to sign in
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <>
              <p className="mt-2 text-sm text-black/55">
                We&apos;ll email you a link to reset your password.
              </p>

              {error && (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-black/60"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-black/30"
                      aria-hidden="true"
                    />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      {...register("email")}
                      placeholder="your@email.com"
                      aria-invalid={errors.email ? "true" : "false"}
                      className={cn(
                        "h-11 w-full rounded-lg border bg-white pl-10 pr-3 text-sm text-black transition-colors placeholder:text-black/35",
                        "focus:outline-none focus:ring-2 focus:ring-purple-600/20",
                        errors.email
                          ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                          : "border-black/15 focus:border-purple-600"
                      )}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-600" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-11 w-full items-center justify-center rounded-lg bg-purple-600 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600/40 focus:ring-offset-2 disabled:opacity-60"
                >
                  {isSubmitting ? "Sending…" : "Send reset link"}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-black/55">
                Remembered it?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-purple-600 transition-colors hover:text-purple-700"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}