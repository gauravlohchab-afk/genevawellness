import Link from "next/link";
import AdminBar from "@/components/admin/AdminBar";
import DeleteButton from "@/components/admin/DeleteButton";
import { requireAdmin } from "@/lib/admin/auth";
import { listPosts } from "@/lib/blog/store";

export const dynamic = "force-dynamic";

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  await requireAdmin();
  const { saved, deleted } = await searchParams;
  const posts = await listPosts({ includeDrafts: true });

  return (
    <>
      <AdminBar />
      <main id="main" className="admin-main">
        <div className="container">
          {saved && (
            <p className="admin-flash" role="status">
              Saved “{saved}”.
            </p>
          )}
          {deleted && (
            <p className="admin-flash" role="status">
              Deleted “{deleted}”.
            </p>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
            <div>
              <p className="eyebrow">Blog</p>
              <h1 className="h2">Posts ({posts.length})</h1>
            </div>
            <Link href="/admin/posts/new" className="btn">
              New post
            </Link>
          </div>
          {posts.length ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>
                    <span className="visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.title}</strong>
                      <span style={{ color: "var(--c-muted)", fontSize: "0.85rem" }}>/blog/{p.slug}</span>
                    </td>
                    <td>{p.category}</td>
                    <td>{p.date}</td>
                    <td>
                      <span className={`badge${p.status === "published" ? " badge--live" : ""}`}>{p.status === "published" ? "Published" : "Draft"}</span>
                    </td>
                    <td>
                      <div className="actions">
                        <Link href={`/admin/posts/${p.id}`} className="btn btn--sm">
                          Edit
                        </Link>
                        {p.status === "published" && (
                          <Link href={`/blog/${p.slug}`} className="btn btn--ghost btn--sm" target="_blank">
                            View
                          </Link>
                        )}
                        <DeleteButton id={p.id} title={p.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="placeholder-box">No posts yet. Create your first one.</p>
          )}
        </div>
      </main>
    </>
  );
}
