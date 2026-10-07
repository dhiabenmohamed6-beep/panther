import { Metadata } from "next";
import { HomeContent } from "./HomeContent";

export const metadata: Metadata = {
  title: "PANTHER — Built Different.",
  description: "Premium fitness and streetwear. The Panther Oversized Tee — Heavyweight. Oversized. Built to move.",
};

export const dynamic = "force-dynamic";

export default function Home() {
  return <HomeContent />;
}