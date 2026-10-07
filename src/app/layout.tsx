import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://panther.com"),
  title: {
    default: "PANTHER — Built Different.",
    template: "%s | PANTHER",
  },
  description: "Premium fitness and streetwear. The Panther Oversized Tee — Heavyweight. Oversized. Built to move.",
  keywords: ["fitness", "streetwear", "oversized t-shirt", "premium clothing", "heavyweight cotton", "gym wear"],
  authors: [{ name: "PANTHER" }],
  creator: "PANTHER",
  publisher: "PANTHER",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://panther.com",
    siteName: "PANTHER",
    title: "PANTHER — Built Different.",
    description: "Premium fitness and streetwear. The Panther Oversized Tee — Heavyweight. Oversized. Built to move.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PANTHER Oversized T-Shirt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PANTHER — Built Different.",
    description: "Premium fitness and streetwear. The Panther Oversized Tee.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://instagram.com" />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}