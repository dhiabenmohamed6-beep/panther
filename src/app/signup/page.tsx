import { Metadata } from "next";
import { SignupContent } from "./SignupContent";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Panther account",
};

export const dynamic = "force-dynamic";

export default function SignupPage() {
  return <SignupContent />;
}