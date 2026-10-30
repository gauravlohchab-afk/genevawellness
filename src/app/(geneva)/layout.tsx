import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function GenevaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-brand="geneva">
      <Header brand="geneva" />
      <main id="main">{children}</main>
      <Footer brand="geneva" />
    </div>
  );
}
