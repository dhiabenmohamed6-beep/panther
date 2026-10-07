import { Metadata } from "next";
import { StaticPage } from "@/components/static-page";

export const metadata: Metadata = {
  title: "Returns",
  description: "Return and exchange policy for Panther orders.",
};

export default function ReturnsPage() {
  return (
    <StaticPage
      eyebrow="Support"
      title="Returns"
      intro="Not the fit you wanted? You have 30 days to change your mind."
      sections={[
        {
          heading: "Return window",
          body: [
            "You can request a return within 30 days of receiving your order. Items must be unworn, unwashed and returned with their original tags and packaging.",
            "Products showing signs of wear, fragrance or damage cannot be returned.",
          ],
        },
        {
          heading: "How to start a return",
          body: [
            "Contact us with your order reference and the item you wish to return. We will send you a return address and instructions.",
            "Returns are not accepted at the delivery address unless explicitly agreed in writing.",
          ],
        },
        {
          heading: "Exchanges",
          body: [
            "The fastest exchange is to return the original size and place a new order for the size you want, because your replacement ships as soon as the new order is confirmed.",
            "Exchanges depend on availability of the requested size.",
          ],
        },
        {
          heading: "Refunds",
          body: [
            "Refunds are issued to the original payment method within 5 to 10 business days of the return being received and inspected.",
            "Original shipping charges are non-refundable unless the return is caused by our error or a defective item.",
          ],
        },
        {
          heading: "Faulty or incorrect items",
          body: [
            "If your item is faulty or we sent the wrong thing, contact us with photos. We will arrange a replacement or a full refund including the original shipping cost at our expense.",
          ],
        },
      ]}
    />
  );
}