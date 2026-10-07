import { Metadata } from "next";
import { ForgotPasswordContent } from "./ForgotPasswordContent";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Request a password reset link",
};

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  return <ForgotPasswordContent />;
}