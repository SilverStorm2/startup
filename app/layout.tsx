import type { Metadata } from "next";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

const siteUrl = process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KRK Alert — zgłoś problem w Krakowie",
    template: "%s | KRK Alert"
  },
  description:
    "Prosty prototyp miejskiego systemu zgłoszeń dla mieszkańców Krakowa.",
  openGraph: {
    title: "KRK Alert — Zgłoś. Zlokalizuj. Pomóż miastu reagować.",
    description:
      "Miejski prototyp do szybkiego zgłaszania problemów w Krakowie.",
    type: "website",
    locale: "pl_PL",
    images: [
      {
        url: "/og/krk-alert-og.png",
        width: 1200,
        height: 630,
        alt: "KRK Alert"
      }
    ]
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
