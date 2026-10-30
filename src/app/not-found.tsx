import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for could not be found. Explore our treatments or find a Geneva Wellness clinic.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div data-brand="geneva">
      <Header brand="geneva" />
      <main id="main">
    <section className="section">
      <div className="container container--narrow center-stack">
        <p className="eyebrow">Page not found</p>
        <h1 className="display">This page has moved</h1>
        <p className="lede">The page you were looking for isn&apos;t here. Try our treatments or find a clinic near you.</p>
        <div className="btn-row btn-row--center">
          <Link href="/treatments" className="btn">
            Explore Treatments
          </Link>
          <Link href="/clinic-locator" className="btn btn--ghost">
            Clinic Locator
          </Link>
        </div>
      </div>
    </section>
      </main>
      <Footer brand="geneva" />
    </div>
  );
}
