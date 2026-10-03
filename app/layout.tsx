import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

const siteUrl = process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const siteTitle = "KRK Alert — Zgłoś. Zlokalizuj. Pomóż miastu reagować.";
const siteDescription =
  "Zgłaszaj problemy w Krakowie: dziury w drogach, awarie oświetlenia i inne usterki. Dodaj zdjęcie, wskaż miejsce na mapie i pomóż miastu reagować.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KRK Alert — zgłoś problem w Krakowie",
    template: "%s | KRK Alert"
  },
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    siteName: "KRK Alert",
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
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [{ url: "/og/krk-alert-og.png", alt: "KRK Alert" }]
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
