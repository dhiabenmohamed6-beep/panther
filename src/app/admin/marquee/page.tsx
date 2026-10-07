import { Metadata } from "next";
import { MarqueeContent } from "./MarqueeContent";

export const metadata: Metadata = {
  title: "Marquee",
  description: "Manage scrolling announcements",
};

export default function AdminMarqueePage() {
  return <MarqueeContent />;
}
