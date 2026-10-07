"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandGraphics } from "@/components/auth-brand-graphics";

export function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") ?? "";
  const emailFromUrl = searchParams.get("email") ?? "";

  const [token, setToken] = React.useState(tokenFromUrl);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isDone, setIsDone] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim(), password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not reset your password");
      setIsDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset your password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#2E0A4E] via-[#1D0533] to-[#10021C] px-6 py-10 text-white sm:px-10 lg:w-[46%] lg:px-14 lg:py-14">
        <BrandGraphics id="reset" />
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
            Choose a new password
          </h2>
          <div className="mt-5 h-px w-16 bg-white/40" aria-hidden="true" />
          <p className="mt-5 max-w-md text-sm leading-relaxed text-purple-100/80">
            Pick something you have not used before. Once saved you will be signed out everywhere and
            will sign in with the new password.
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
            Reset password
          </h1>

          {isDone ? (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-emerald-900">Password updated</p>
                  <p className="mt-1 text-sm text-emerald-800">
                    Your password has been changed. You can now sign in with your new password.
                  </p>
                </div>
              </div>
              <Link
                href="/login"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 transition-colors hover:text-emerald-700"
              >
                Go to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
              {!tokenFromUrl && (
                <div>
                  <label
                    htmlFor="token"
                    className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-black/60"
                  >
                    Reset code
                  </label>
                  <input
                    id="token"
                    type="text"
                    value={token}
                    onChange={(event) => setToken(event.target.value)}
                    required
                    placeholder="Paste the code from your reset link"
                    className="h-11 w-full rounded-lg border border-black/15 bg-white px-3 text-sm text-black transition-colors placeholder:text-black/35 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                  <p className="mt-1.5 text-xs text-black/45">
                    Open the reset link we generated for you and paste the code here.
                  </p>
                </div>
              )}

              <div>
                <label
                  htmlFor="new-password"
                  className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-black/60"
                >
                  New password
                </label>
                <div className="relative">
                  <KeyRound
                    className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-black/30"
                    aria-hidden="true"
                  />
                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    minLength={8}
                    aria-invalid={error && password.length < 8 ? "true" : "false"}
                    className={cn(
                      "h-11 w-full rounded-lg border bg-white pl-10 pr-3 text-sm text-black transition-colors placeholder:text-black/35",
                      "focus:outline-none focus:ring-2 focus:ring-purple-600/20",
                      error && password.length < 8
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                        : "border-black/15 focus:border-purple-600"
                    )}
                  />
                </div>
                <p className="mt-1.5 text-xs text-black/45">Minimum 8 characters.</p>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-black/60"
                >
                  Confirm password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  className={cn(
                    "h-11 w-full rounded-lg border bg-white px-3 text-sm text-black transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-purple-600/20",
                    error && password !== confirmPassword
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                      : "border-black/15 focus:border-purple-600"
                  )}
                />
              </div>

              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !token.trim()}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-purple-600 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600/40 focus:ring-offset-2 disabled:opacity-60"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {isSubmitting ? "Saving…" : "Set new password"}
              </button>

              {emailFromUrl && <p className="text-center text-xs text-black/45">Resetting password for {emailFromUrl}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}