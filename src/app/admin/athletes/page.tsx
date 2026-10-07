import { Metadata } from "next";
import { AthletesContent } from "./AthletesContent";

export const metadata: Metadata = {
  title: "Athletes",
  description: "Manage storefront athletes",
};

export default function AdminAthletesPage() {
  return <AthletesContent />;
}
