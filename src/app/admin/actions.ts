"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  checkPassword,
  clearFailures,
  createSession,
  destroySession,
  loginBlocked,
  recordFailure,
  requireAdmin,
} from "@/lib/admin/auth";
import { deletePost, getPostById, savePost, saveUpload } from "@/lib/blog/store";
import { BLOG_CATEGORIES, type BlogPost } from "@/lib/blog/types";

export interface FormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

const clientIp = async () => (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

export async function loginAction(_prev: FormState, form: FormData): Promise<FormState> {
  const ip = await clientIp();
  if (loginBlocked(ip)) return { error: "Too many attempts. Please wait 15 minutes and try again." };
  const password = String(form.get("password") ?? "");
  if (!checkPassword(password)) {
    recordFailure(ip);
    return { error: "That password isn't right." };
  }
  clearFailures(ip);
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

const revalidateBlog = (...slugs: (string | undefined)[]) => {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  for (const s of slugs) if (s) revalidatePath(`/blog/${s}`);
};

const isSafeImageUrl = (u: string) => /^https:\/\/\S+$/i.test(u) || /^\/media\/[a-z0-9]+-[a-f0-9]{12}\.(jpg|png|webp)$/.test(u);

export async function savePostAction(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const get = (k: string) => String(form.get(k) ?? "").trim();
  const id = get("id") || undefined;
  const title = get("title");
  const excerpt = get("excerpt");
  const category = get("category");
  const date = get("date");
  const status = get("status") === "published" ? "published" : "draft";
  const body = String(form.get("body") ?? "");
  const coverAlt = get("coverAlt");
  let coverUrl = get("coverUrl");
  const file = form.get("coverFile");

  const fieldErrors: Record<string, string> = {};
  if (!title) fieldErrors.title = "Add a title.";
  else if (title.length > 160) fieldErrors.title = "Keep the title under 160 characters.";
  if (!excerpt) fieldErrors.excerpt = "Add a short summary for the blog list and search results.";
  else if (excerpt.length > 300) fieldErrors.excerpt = "Keep the summary under 300 characters.";
  if (!BLOG_CATEGORIES.includes(category as (typeof BLOG_CATEGORIES)[number])) fieldErrors.category = "Choose a category.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) fieldErrors.date = "Choose a valid date.";
  if (!body.trim()) fieldErrors.body = "The article needs some text.";
  else if (body.length > 100_000) fieldErrors.body = "The article is too long (100,000 characters max).";
  if (coverUrl && !isSafeImageUrl(coverUrl)) fieldErrors.coverUrl = "Use an https:// image link, or upload a file.";

  const hasFile = file instanceof File && file.size > 0;
  if ((hasFile || coverUrl) && !coverAlt) fieldErrors.coverAlt = "Describe the image for screen readers and search engines.";
  if (Object.keys(fieldErrors).length) return { error: "Please fix the highlighted fields.", fieldErrors };

  if (hasFile) {
    try {
      coverUrl = await saveUpload(file as File);
    } catch (err) {
      return { error: "The image couldn't be uploaded.", fieldErrors: { coverFile: (err as Error).message } };
    }
  }

  const existing = id ? await getPostById(id) : null;
  if (id && !existing) return { error: "This post no longer exists. It may have been deleted." };

  const data: Omit<BlogPost, "id" | "updatedAt"> & { id?: string } = {
    id,
    slug: get("slug"),
    title,
    excerpt,
    category,
    date,
    author: get("author") || "Geneva Wellness Team",
    coverImage: coverUrl ? { src: coverUrl, alt: coverAlt } : null,
    body,
    status,
    originalUrl: existing?.originalUrl,
  };

  let saved;
  try {
    saved = await savePost(data);
  } catch (err) {
    console.error("[admin] save failed:", err);
    return { error: "The post couldn't be saved. Check that the server can write to the blog data folder." };
  }
  revalidateBlog(saved.post.slug, saved.previousSlug);
  redirect(`/admin?saved=${encodeURIComponent(saved.post.title)}`);
}

export async function deletePostAction(form: FormData) {
  await requireAdmin();
  const post = await deletePost(String(form.get("id") ?? ""));
  if (post) revalidateBlog(post.slug);
  redirect(`/admin?deleted=${encodeURIComponent(post?.title ?? "")}`);
}
