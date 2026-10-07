import { Metadata } from "next";
import { StoryContent } from "./StoryContent";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Discover the Panther philosophy. Built for those who refuse to blend in.",
};

export const dynamic = "force-dynamic";

export default function StoryPage() {
  return <StoryContent />;
}