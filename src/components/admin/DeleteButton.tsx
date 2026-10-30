"use client";

import { deletePostAction } from "@/app/admin/actions";

export default function DeleteButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deletePostAction}
      onSubmit={(e) => {
        if (!window.confirm(`Delete “${title}”? This can't be undone.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="btn btn--danger btn--sm">
        Delete
      </button>
    </form>
  );
}
