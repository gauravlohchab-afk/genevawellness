import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function LaveeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-brand="lavee">
      <Header brand="lavee" />
      <main id="main">{children}</main>
      <Footer brand="lavee" />
    </div>
  );
}
