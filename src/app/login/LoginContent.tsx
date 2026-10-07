"use client";

import * as React from "react";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validation";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { BrandGraphics } from "@/components/auth-brand-graphics";

const highlights = [
  { icon: Truck, label: "Free shipping over 150 DT" },
  { icon: RefreshCw, label: "30-day returns" },
  { icon: ShieldCheck, label: "Secure checkout" },
];

export function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        rememberMe: rememberMe ? "true" : "false",
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        });
        return;
      }

      const updatedSession = await getSession();
      const role = updatedSession?.user?.role;

      // Admins go straight to the dashboard; everyone else to the storefront.
      const destination = callbackUrl ?? (role === "ADMIN" ? "/admin" : "/shop");

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
        variant: "success",
      });
      router.push(destination);
      router.refresh();
    } catch {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      {/* Brand panel */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#2E0A4E] via-[#1D0533] to-[#10021C] px-6 py-10 text-white sm:px-10 lg:w-[46%] lg:px-14 lg:py-14">
        <BrandGraphics id="login" />
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
            Members area
          </span>
          <h2 className="mt-5 max-w-md text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            Built different.
            <br />
            So are you.
          </h2>
          <div className="mt-5 h-px w-16 bg-white/40" aria-hidden="true" />
          <p className="mt-5 max-w-md text-sm leading-relaxed text-purple-100/80">
            Sign in to track your orders, manage your details and unlock member-only drops.
          </p>

          <ul className="mt-8 space-y-3">
            {highlights.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.07] px-3.5 py-2.5 text-sm text-purple-50 backdrop-blur-sm"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative mt-12 hidden text-xs uppercase tracking-[0.18em] text-purple-200/70 lg:block">
          Premium heavyweight apparel
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-black/50 transition-colors hover:text-purple-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to store
          </Link>

          <div className="flex items-center gap-3 lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/10 bg-white">
              <img src="/images/logo.png" alt="" className="h-7 w-auto" aria-hidden="true" />
            </span>
            <span className="text-base font-bold tracking-[0.18em] text-black">PANTHER</span>
          </div>

          <h1 className="mt-8 text-2xl font-bold uppercase tracking-tight text-black lg:mt-0 lg:text-3xl">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-black/55">
            Enter your credentials to access your account.
          </p>

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

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-black/60"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-black/30"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  placeholder="••••••••"
                  aria-invalid={errors.password ? "true" : "false"}
                  className={cn(
                    "h-11 w-full rounded-lg border bg-white pl-10 pr-11 text-sm text-black transition-colors placeholder:text-black/35",
                    "focus:outline-none focus:ring-2 focus:ring-purple-600/20",
                    errors.password
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                      : "border-black/15 focus:border-purple-600"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-black/35 transition-colors hover:text-purple-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded accent-purple-600"
                />
                <span className="text-sm text-black/65">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-purple-600 transition-colors hover:text-purple-700"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="flex h-11 w-full items-center justify-center rounded-lg bg-purple-600 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-black/55">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-purple-600 transition-colors hover:text-purple-700"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}