import { Metadata } from "next";
import { CustomersContent } from "./CustomersContent";

export const metadata: Metadata = {
  title: "Customers",
  description: "Manage customers and admins",
};

export default function AdminCustomersPage() {
  return <CustomersContent />;
}
