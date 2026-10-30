import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell" data-brand="geneva">
      {children}
    </div>
  );
}
