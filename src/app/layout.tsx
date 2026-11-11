import type { Metadata, Viewport } from "next";
import "@fontsource/cinzel/400.css";
import "@fontsource/cinzel/600.css";
import "@fontsource/cinzel/700.css";
import "@fontsource/arimo/400.css";
import "@fontsource/arimo/700.css";
import "./globals.css";
import BookingProvider from "@/components/booking/BookingProvider";
import RevealObserver from "@/components/RevealObserver";
import ScrollFx from "@/components/ScrollFx";
import { SITE_URL, brand, seo } from "@/content/site";
import { siteGraphJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: seo.defaultTitle, template: seo.titleTemplate },
  description: seo.description,
  applicationName: brand.name,
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: seo.defaultTitle,
    description: seo.description,
    url: "/",
    locale: "en_PH",
  },
  twitter: { card: "summary_large_image", title: seo.defaultTitle, description: seo.description },
  formatDetection: { telephone: false },
  category: "health",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // Search Console / Bing Webmaster verification tokens, set per environment.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#FEFAED",
  width: "device-width",
  initialScale: 1,
};

// Enables reveal-on-scroll styles before first paint (skipped for reduced motion).
const jsFlag = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver'in window)document.documentElement.classList.add('js')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-PH" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
      </head>
      <body data-brand="geneva">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraphJsonLd()) }} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <BookingProvider>{children}</BookingProvider>
        <RevealObserver />
        <ScrollFx />
      </body>
    </html>
  );
}
