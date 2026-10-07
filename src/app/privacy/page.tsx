import { Metadata } from "next";
import { StaticPage } from "@/components/static-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Panther collects, uses and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <StaticPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="How we handle your personal data. We collect as little as possible and never sell it."
      sections={[
        {
          heading: "What we collect",
          body: [
            "Account data: your name, email address and encrypted password, collected when you register or place an order.",
            "Order data: the delivery address, phone number and items you order, needed to fulfil your order.",
            "Technical data: your session cookie and basic, aggregated usage statistics.",
          ],
        },
        {
          heading: "How we use your data",
          body: [
            "To create and secure your account, process and deliver your orders, and provide customer support.",
            "To answer messages you send us through the contact form.",
            "We do not sell your personal data, and we do not share it with third parties for their own marketing.",
          ],
        },
        {
          heading: "Passwords",
          body: [
            "Passwords are stored as salted hashes and are never stored or transmitted in plain text. If you forget your password, you can request a reset from the login page.",
          ],
        },
        {
          heading: "Retention",
          body: [
            "Account data is kept for as long as your account is active. Order records are retained for accounting and legal obligations even if you delete your account.",
            "Messages sent through the contact form are kept only as long as needed to resolve your request.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "You can request access to, correction of, or deletion of your personal data at any time by contacting us.",
            "You can also request a portable copy of your data in a machine-readable format.",
          ],
        },
        {
          heading: "Cookies",
          body: [
            "We use one essential session cookie to keep you signed in and one cookie to remember your cart and language preference. We do not use advertising cookies.",
          ],
        },
      ]}
    />
  );
}