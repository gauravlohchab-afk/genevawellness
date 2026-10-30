import "server-only";
import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { blogSeed } from "@/content/blogSeed";
import type { BlogPost } from "./types";

/**
 * File-based blog store: posts in <BLOG_DATA_DIR>/posts.json, uploaded images in
 * <BLOG_DATA_DIR>/uploads. Needs a persistent disk (VPS, Docker volume, Render/Railway
 * disk). See README "Blog admin" for serverless hosts.
 */
export const DATA_DIR = path.resolve(process.env.BLOG_DATA_DIR ?? path.join(process.cwd(), "data"));
const POSTS_FILE = path.join(DATA_DIR, "posts.json");
export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

async function readAll(): Promise<BlogPost[]> {
  try {
    const raw = await fs.readFile(POSTS_FILE, "utf8");
    return JSON.parse(raw) as BlogPost[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return blogSeed;
    throw err;
  }
}

// Serialise writes within this process so two saves can't interleave.
let writeChain: Promise<unknown> = Promise.resolve();
async function writeAll(posts: BlogPost[]) {
  const run = async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmp = `${POSTS_FILE}.${randomBytes(4).toString("hex")}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(posts, null, 2), "utf8");
    await fs.rename(tmp, POSTS_FILE);
  };
  const next = writeChain.then(run, run);
  writeChain = next.catch(() => {});
  return next;
}

const byDateDesc = (a: BlogPost, b: BlogPost) => b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt);

export async function listPosts({ includeDrafts = false } = {}) {
  const posts = await readAll();
  return posts.filter((p) => includeDrafts || p.status === "published").sort(byDateDesc);
}

export async function getPostBySlug(slug: string, { includeDrafts = false } = {}) {
  const posts = await readAll();
  return posts.find((p) => p.slug === slug && (includeDrafts || p.status === "published")) ?? null;
}

export async function getPostById(id: string) {
  return (await readAll()).find((p) => p.id === id) ?? null;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function savePost(input: Omit<BlogPost, "id" | "updatedAt"> & { id?: string }) {
  const posts = await readAll();
  const now = new Date().toISOString();
  let slug = slugify(input.slug || input.title) || `post-${Date.now()}`;
  // Keep slugs unique.
  const taken = new Set(posts.filter((p) => p.id !== input.id).map((p) => p.slug));
  for (let i = 2; taken.has(slug); i++) slug = `${slugify(input.slug || input.title)}-${i}`;

  const existing = input.id ? posts.find((p) => p.id === input.id) : undefined;
  const post: BlogPost = { ...existing, ...input, slug, id: existing?.id ?? randomBytes(8).toString("hex"), updatedAt: now };
  const next = existing ? posts.map((p) => (p.id === post.id ? post : p)) : [post, ...posts];
  await writeAll(next);
  return { post, previousSlug: existing?.slug };
}

export async function deletePost(id: string) {
  const posts = await readAll();
  const post = posts.find((p) => p.id === id);
  if (!post) return null;
  await writeAll(posts.filter((p) => p.id !== id));
  return post;
}

const IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/** Saves an uploaded cover image and returns its public URL. */
export async function saveUpload(file: File) {
  const ext = IMAGE_TYPES[file.type];
  if (!ext) throw new Error("Images must be JPG, PNG or WebP.");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Images must be 5 MB or smaller.");
  const buf = Buffer.from(await file.arrayBuffer());
  // Check the file's magic bytes, not just the declared type.
  const sig = buf.subarray(0, 12);
  const ok =
    (ext === "jpg" && sig[0] === 0xff && sig[1] === 0xd8) ||
    (ext === "png" && sig.subarray(0, 4).toString("hex") === "89504e47") ||
    (ext === "webp" && sig.subarray(0, 4).toString() === "RIFF" && sig.subarray(8, 12).toString() === "WEBP");
  if (!ok) throw new Error("That file doesn't look like a valid image.");
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${ext}`;
  await fs.writeFile(path.join(UPLOADS_DIR, name), buf);
  return `/media/${name}`;
}
