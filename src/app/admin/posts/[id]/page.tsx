import Link from "next/link";
import { notFound } from "next/navigation";
import AdminBar from "@/components/admin/AdminBar";
import DeleteButton from "@/components/admin/DeleteButton";
import PostEditor from "@/components/admin/PostEditor";
import { requireAdmin } from "@/lib/admin/auth";
import { getPostById } from "@/lib/blog/store";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();
  return (
    <>
      <AdminBar />
      <main id="main" className="admin-main">
        <div className="container">
          <Link href="/admin" className="link-arrow" style={{ marginBottom: 12 }}>
            ← All posts
          </Link>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "end", marginBottom: 28 }}>
            <h1 className="h2">Edit post</h1>
            <DeleteButton id={post.id} title={post.title} />
          </div>
          {post.originalUrl && (
            <p className="admin-flash">
              Imported from the old site. Paste the full article from{" "}
              <a href={post.originalUrl} target="_blank" rel="noopener noreferrer">
                the original post
              </a>{" "}
              into the Article box below, then save.
            </p>
          )}
          <PostEditor post={post} />
        </div>
      </main>
    </>
  );
}
