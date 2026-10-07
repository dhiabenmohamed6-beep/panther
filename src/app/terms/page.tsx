import { Metadata } from "next";
import { StaticPage } from "@/components/static-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when you shop at Panther.",
};

export default function TermsPage() {
  return (
    <StaticPage
      eyebrow="Legal"
      title="Terms of Service"
      intro="The rules that apply when you browse and buy from Panther."
      sections={[
        {
          heading: "Using this site",
          body: [
            "You agree to use this site lawfully and not to attempt to disrupt it, scrape it at scale, or use it to place fraudulent orders.",
            "All content, images and designs on this site belong to Panther or are used with permission.",
          ],
        },
        {
          heading: "Orders",
          body: [
            "An order is an offer to buy. The contract is formed when we send an order confirmation, not when you submit the checkout form.",
            "We may refuse or cancel an order if an item is out of stock, if a price was listed in error, or if we suspect fraud.",
          ],
        },
        {
          heading: "Pricing",
          body: [
            "Prices are shown in the store currency and include VAT where applicable. Shipping cost is shown separately at checkout before you confirm.",
            "If a price is listed incorrectly, we will contact you and let you decide whether to proceed at the correct price.",
          ],
        },
        {
          heading: "Accounts",
          body: [
            "You are responsible for keeping your account credentials confidential and for activity that happens under your account.",
            "You must be old enough to enter a contract in your country of residence to place an order.",
          ],
        },
        {
          heading: "Intellectual property",
          body: [
            "The Panther name, logo, product designs and all site content are our property or licensed to us. You may not reproduce them commercially without written permission.",
          ],
        },
        {
          heading: "Limitation of liability",
          body: [
            "To the extent permitted by law, our liability for any claim arising from your order is limited to the amount you paid for that order.",
            "Nothing in these terms limits liability for fraud, or for anything that cannot lawfully be limited.",
          ],
        },
        {
          heading: "Governing law",
          body: [
            "These terms are governed by the laws applicable where our store is registered. Any dispute is subject to the exclusive jurisdiction of those courts.",
          ],
        },
      ]}
    />
  );
}