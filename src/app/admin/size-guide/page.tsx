import { Metadata } from "next";
import { SizeGuideContent } from "./SizeGuideContent";

export const metadata: Metadata = {
  title: "Size guide",
  description: "Manage product measurements",
};

export default function AdminSizeGuidePage() {
  return <SizeGuideContent />;
}
