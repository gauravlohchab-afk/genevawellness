import Link from "next/link";
import AdminBar from "@/components/admin/AdminBar";
import PostEditor from "@/components/admin/PostEditor";
import { requireAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  await requireAdmin();
  return (
    <>
      <AdminBar />
      <main id="main" className="admin-main">
        <div className="container">
          <Link href="/admin" className="link-arrow" style={{ marginBottom: 12 }}>
            ← All posts
          </Link>
          <h1 className="h2" style={{ marginBottom: 28 }}>
            New post
          </h1>
          <PostEditor />
        </div>
      </main>
    </>
  );
}
