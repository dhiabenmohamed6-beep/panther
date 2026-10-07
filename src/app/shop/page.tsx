import { Metadata } from "next";
import { ShopContent } from "./ShopContent";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop the Panther Oversized Tee — Premium heavyweight cotton, oversized fit, built for movement.",
};

export const dynamic = "force-dynamic";

export default function ShopPage() {
  return <ShopContent />;
}