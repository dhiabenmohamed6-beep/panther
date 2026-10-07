import { Metadata } from "next";
import { UploadContent } from "./UploadContent";

export const metadata: Metadata = {
  title: "Upload Images",
  description: "Upload images for products and athletes",
};

export default function UploadPage() {
  return <UploadContent />;
}