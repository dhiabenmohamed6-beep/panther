import { Metadata } from "next";
import { LoginContent } from "./LoginContent";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Panther account",
};

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return <LoginContent />;
}