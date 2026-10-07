import { Metadata } from "next";
import { CheckoutContent } from "./CheckoutContent";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order - Panther",
};

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return <CheckoutContent />;
}