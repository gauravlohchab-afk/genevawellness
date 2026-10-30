"use client";

import Link from "next/link";
import { startTransition, useActionState, useMemo, useState } from "react";
import { savePostAction, type FormState } from "@/app/admin/actions";
import { renderMarkdown } from "@/lib/blog/markdown";
import { BLOG_CATEGORIES, type BlogPost } from "@/lib/blog/types";

const today = () => new Date().toISOString().slice(0, 10);

export default function PostEditor({ post }: { post?: BlogPost }) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePostAction, {});
  const [title, setTitle] = useState(post?.title ?? "");
  const [body, setBody] = useState(post?.body ?? "");
  const [cover, setCover] = useState(post?.coverImage?.src ?? "");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const preview = useMemo(() => renderMarkdown(body), [body]);
  const fe = state.fieldErrors ?? {};

  const Err = ({ k }: { k: string }) =>
    fe[k] ? (
      <p className="field-error" id={`err-${k}`}>
        {fe[k]}
      </p>
    ) : null;
  const inv = (k: string) => ({ "aria-invalid": !!fe[k], "aria-describedby": fe[k] ? `err-${k}` : undefined });

  return (
    <form
      className="editor"
      encType="multipart/form-data"
      noValidate
      // Submitting manually stops React from clearing the fields when the server returns validation errors.
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
    >
      <div style={{ display: "grid", gap: 20 }}>
        {post && <input type="hidden" name="id" value={post.id} />}
        {state.error && (
          <p className="form-alert" role="alert">
            {state.error}
          </p>
        )}
        <div className="field">
          <label htmlFor="title">Title *</label>
          <input id="title" name="title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} required {...inv("title")} />
          <Err k="title" />
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="category">Category *</label>
            <select id="category" name="category" className="input" defaultValue={post?.category ?? ""} required {...inv("category")}>
              <option value="">Choose…</option>
              {BLOG_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <Err k="category" />
          </div>
          <div className="field">
            <label htmlFor="date">Publish date *</label>
            <input id="date" name="date" type="date" className="input" defaultValue={post?.date ?? today()} required {...inv("date")} />
            <Err k="date" />
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" className="input" defaultValue={post?.status ?? "draft"}>
              <option value="draft">Draft (hidden)</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="author">Author</label>
            <input id="author" name="author" className="input" defaultValue={post?.author ?? "Geneva Wellness Team"} />
          </div>
          <div className="field span-2">
            <label htmlFor="slug">Web address</label>
            <input id="slug" name="slug" className="input" defaultValue={post?.slug ?? ""} placeholder="Leave empty to create it from the title" />
            <p className="field-hint">/blog/{post?.slug || "…"}. Changing it breaks links people already shared.</p>
          </div>
        </div>
        <div className="field">
          <label htmlFor="excerpt">Summary *</label>
          <textarea id="excerpt" name="excerpt" className="input" rows={2} maxLength={300} defaultValue={post?.excerpt ?? ""} required {...inv("excerpt")} />
          <p className="field-hint">Shown on blog cards and in Google results. Up to 300 characters.</p>
          <Err k="excerpt" />
        </div>

        <fieldset className="panel" style={{ border: 0 }}>
          <legend className="field-label" style={{ float: "left", marginBottom: 8 }}>
            Cover image
          </legend>
          <div className="field" style={{ clear: "both" }}>
            <label htmlFor="coverFile">Upload (JPG, PNG or WebP, up to 5 MB)</label>
            <input
              id="coverFile"
              name="coverFile"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setFilePreview(f ? URL.createObjectURL(f) : null);
              }}
              {...inv("coverFile")}
            />
            <Err k="coverFile" />
          </div>
          <div className="field">
            <label htmlFor="coverUrl">…or image link</label>
            <input id="coverUrl" name="coverUrl" className="input" value={cover} onChange={(e) => setCover(e.target.value)} placeholder="https://…" {...inv("coverUrl")} />
            <Err k="coverUrl" />
          </div>
          <div className="field">
            <label htmlFor="coverAlt">Image description</label>
            <input id="coverAlt" name="coverAlt" className="input" defaultValue={post?.coverImage?.alt ?? ""} {...inv("coverAlt")} />
            <Err k="coverAlt" />
          </div>
          {(filePreview || cover) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={filePreview ?? cover} alt="" style={{ maxHeight: 180, width: "auto", borderRadius: 4 }} />
          )}
          {cover && !filePreview && (
            <button type="button" className="link-arrow" onClick={() => setCover("")}>
              Remove cover image
            </button>
          )}
        </fieldset>

        <div className="field">
          <label htmlFor="body">Article *</label>
          <textarea id="body" name="body" className="input" value={body} onChange={(e) => setBody(e.target.value)} required {...inv("body")} />
          <Err k="body" />
          <p className="md-help">
            Formatting: <code>## Heading</code> · <code>### Smaller heading</code> · <code>**bold**</code> · <code>*italic*</code> ·{" "}
            <code>- bullet</code> · <code>1. numbered</code> · <code>&gt; quote</code> · <code>[link text](https://…)</code> ·{" "}
            <code>![image description](https://…)</code> · blank line = new paragraph.
          </p>
        </div>

        <div className="btn-row" style={{ alignItems: "center" }}>
          <button type="submit" className="btn" disabled={pending}>
            {pending ? "Saving…" : "Save post"}
          </button>
          <Link href="/admin" className="btn btn--ghost">
            Cancel
          </Link>
        </div>
      </div>

      <aside className="editor__preview" aria-label="Preview">
        <p className="eyebrow">Preview</p>
        <h2 className="h2" style={{ marginBottom: 20 }}>
          {title || "Untitled post"}
        </h2>
        <div className="prose-article" dangerouslySetInnerHTML={{ __html: preview || "<p><em>Start writing to see the preview.</em></p>" }} />
      </aside>
    </form>
  );
}
