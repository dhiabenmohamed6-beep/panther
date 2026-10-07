import { Metadata } from "next";
import { CouponsContent } from "./CouponsContent";

export const metadata: Metadata = {
  title: "Discounts",
  description: "Create and manage promo codes",
};

export default function AdminCouponsPage() {
  return <CouponsContent />;
}
