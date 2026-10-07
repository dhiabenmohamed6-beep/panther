import { Metadata } from "next";
import { StockContent } from "./StockContent";

export const metadata: Metadata = {
  title: "Stock",
  description: "Manage inventory",
};

export default function AdminStockPage() {
  return <StockContent />;
}
