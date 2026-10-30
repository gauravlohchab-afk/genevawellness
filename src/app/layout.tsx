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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
      </head>
      <body data-brand="geneva">
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
