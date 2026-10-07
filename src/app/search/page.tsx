import { Metadata } from "next";
import { SearchContent } from "./SearchContent";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Panther catalog.",
};

export default function SearchPage() {
  return <SearchContent />;
}