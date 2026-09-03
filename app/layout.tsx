import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.name} ${SITE.tagline} — Private Transfers & Local Guides in Uzbekistan`,
  description:
    "Book private car transfers between any cities in Uzbekistan. Hire licensed local guides in Samarkand, Bukhara, Khiva. Fixed prices, no surprises.",
  keywords: [
    "Uzbekistan transfer",
    "Samarkand guide",
    "Silk Road travel",
    "TurkUztan",
    "turkuztan.uz",
    "private car Uzbekistan",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE.name} ${SITE.tagline} — Private Transfers & Local Guides`,
    description: "Fixed-price transfers and licensed guides across Uzbekistan's Silk Road cities.",
    type: "website",
    url: SITE.url,
    siteName: `${SITE.name} ${SITE.tagline}`,
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('tourfix-theme');if(t==='blue'||t==='white'||t==='black'||t==='logo')document.documentElement.setAttribute('data-theme',t);else document.documentElement.setAttribute('data-theme','black');}catch(e){document.documentElement.setAttribute('data-theme','black');}})();`,
          }}
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
