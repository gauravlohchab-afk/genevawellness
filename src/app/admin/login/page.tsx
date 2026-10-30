import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { adminEnabled, isAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main id="main" className="admin-main">
      <div className="container" style={{ maxWidth: 460 }}>
        <p className="eyebrow">Geneva Wellness Institute</p>
        <h1 className="h2" style={{ marginBottom: 24 }}>
          Blog admin
        </h1>
        {adminEnabled() ? (
          <LoginForm />
        ) : (
          <div className="placeholder-box" role="note">
            <strong>The admin is switched off.</strong> Set <code>ADMIN_PASSWORD</code> (and <code>ADMIN_SESSION_SECRET</code>) in the
            server environment and restart the site to enable it.
          </div>
        )}
      </div>
    </main>
  );
}
