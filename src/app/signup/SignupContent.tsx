"use client";

import React from "react";
import { Marquee } from "@/components/marquee";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { signupSchema, type SignupInput } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { signUp } from "@/lib/api";

export function SignupContent() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch("password");

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true);
    try {
      const response = await signUp(data.name, data.email, data.password);
      
      if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account created!",
          description: "Welcome to Panther. Please sign in to continue.",
          variant: "success",
        });
        router.push("/login");
      }
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
    <>
      <Marquee />
      <Navbar />
      <main id="main-content" className="min-h-screen pt-16 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-medium tracking-widest uppercase text-purple-400">ACCOUNT</span>
              <h1 className="mt-2 font-bold tracking-tight uppercase text-3xl md:text-4xl text-white">CREATE ACCOUNT</h1>
              <p className="mt-4 text-white/60">Join the pride. Create your Panther account today.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              <div>
                <Label htmlFor="name">FULL NAME</Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" aria-hidden="true" />
                  <Input
                    id="name"
                    type="text"
                    {...register("name")}
                    error={errors.name?.message}
                    placeholder="John Doe"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">EMAIL</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" aria-hidden="true" />
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                    placeholder="your@email.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">PASSWORD</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" aria-hidden="true" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    error={errors.password?.message}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">CONFIRM PASSWORD</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" aria-hidden="true" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    error={errors.confirmPassword?.message}
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input type="checkbox" id="terms" required className="mt-1 h-4 w-4 accent-purple-500" />
                <Label htmlFor="terms" className="text-sm text-white/70 cursor-pointer">
                  I agree to the{" "}
                  <Link href="/terms" className="text-purple-400 hover:text-purple-300">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</Link>
                </Label>
              </div>

              <Button type="submit" size="lg" className="w-full" loading={isLoading}>
                CREATE ACCOUNT
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-white/60">
                Already have an account?{" "}
                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer instagramUrl="https://instagram.com/panther" contactEmail="contact@panther.com" contactPhone="+33 1 23 45 67 89" />
    </>
  );
}