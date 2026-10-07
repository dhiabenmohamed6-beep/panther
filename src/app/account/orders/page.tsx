import { Metadata } from "next";
import { OrdersContent } from "./OrdersContent";

export const metadata: Metadata = {
  title: "My Orders",
  description: "Your Panther order history and tracking.",
};

export default function AccountOrdersPage() {
  return <OrdersContent />;
}