import { Metadata } from "next";
import { StaticPage } from "@/components/static-page";

export const metadata: Metadata = {
  title: "Shipping",
  description: "Shipping rates, delivery times and order processing at Panther.",
};

export default function ShippingPage() {
  return (
    <StaticPage
      eyebrow="Support"
      title="Shipping"
      intro="Everything about how, when and where your order arrives."
      sections={[
        {
          heading: "Processing time",
          body: [
            "Orders placed before 2:00 PM on a business day are picked and packed the same day. Orders placed after that cut-off, on weekends or on public holidays ship on the next business day.",
            "You will receive an email with your tracking number as soon as the parcel leaves our warehouse.",
          ],
        },
        {
          heading: "Delivery times",
          body: [
            "Standard delivery: 2 to 4 business days once shipped.",
            "Express delivery: 1 to 2 business days once shipped, available at checkout where supported.",
            "Delivery estimates are shown at checkout before you confirm the order, so there are no surprises.",
          ],
        },
        {
          heading: "Shipping costs",
          body: [
            "Shipping cost is calculated from your cart contents and your shipping address. Orders above the free-shipping threshold shown on the product page ship free.",
            "The exact shipping price and free-shipping threshold are configurable by the store and are always displayed before you pay.",
          ],
        },
        {
          heading: "International orders",
          body: [
            "We currently ship to Tunisia and across the European Union. For other destinations, contact us before placing the order so we can confirm shipping cost and delivery expectations.",
            "Any duties or import taxes applied by the destination country are the responsibility of the recipient.",
          ],
        },
        {
          heading: "Failed deliveries",
          body: [
            "If a parcel is returned to us because it could not be delivered, we will contact you to arrange a second attempt. Repeated failed deliveries may cancel the order and trigger a refund of the product price; original shipping costs are not refundable.",
          ],
        },
      ]}
    />
  );
}