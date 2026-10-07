import { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordContent } from "./ResetPasswordContent";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Choose a new password for your Panther account.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}