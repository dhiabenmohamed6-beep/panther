import { Metadata } from "next";
import { OrdersContent } from "./OrdersContent";

export const metadata: Metadata = {
  title: "Orders",
  description: "Manage and fulfil orders",
};

export default function AdminOrdersPage() {
  return <OrdersContent />;
}
