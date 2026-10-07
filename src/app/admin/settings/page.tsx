import { Metadata } from "next";
import { SettingsContent } from "./SettingsContent";

export const metadata: Metadata = {
  title: "Settings",
  description: "Store settings",
};

export default function AdminSettingsPage() {
  return <SettingsContent />;
}
