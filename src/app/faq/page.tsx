import { Metadata } from "next";
import { FaqContent } from "./FaqContent";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about Panther sizing, shipping, returns and payment.",
};

export default function FaqPage() {
  return <FaqContent />;
}