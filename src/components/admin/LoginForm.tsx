"use client";

import { useActionState } from "react";
import { loginAction, type FormState } from "@/app/admin/actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(loginAction, {});
  return (
    <form action={action} className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
      <div className="field">
        <label htmlFor="password">Admin password</label>
        <input
          id="password"
          name="password"
          type="password"
          className="input"
          autoComplete="current-password"
          required
          autoFocus
          aria-invalid={!!state.error}
          aria-describedby={state.error ? "login-err" : undefined}
        />
        {state.error && (
          <p className="field-error" id="login-err" role="alert">
            {state.error}
          </p>
        )}
      </div>
      <button type="submit" className="btn" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
