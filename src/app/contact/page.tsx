import { Metadata } from "next";
import { ContactContent } from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Panther. We'd love to hear from you.",
};

export const dynamic = "force-dynamic";

export default function ContactPage() {
  return <ContactContent />;
}