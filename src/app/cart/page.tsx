import { Metadata } from "next";
import { CartContent } from "./CartContent";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your shopping cart - Panther",
};

export const dynamic = "force-dynamic";

export default function CartPage() {
  return <CartContent />;
}