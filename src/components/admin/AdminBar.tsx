import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export default function AdminBar() {
  return (
    <header className="admin-bar">
      <div className="container">
        <Link href="/admin" className="logo-fallback">
          Geneva <small>Blog admin</small>
        </Link>
        <nav style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/blog" className="btn btn--ghost btn--sm" target="_blank">
            View blog
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="btn btn--ghost btn--sm">
              Log out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
