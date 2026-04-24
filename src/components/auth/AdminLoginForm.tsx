"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
const baseUrl = process.env.NEXT_PUBLIC_ASSET_BASE;
export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Sign in failed.");
        return;
      }
      router.replace("/rocket/admin/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container d-flex align-items-center admin-login-container justify-content-center min-vh-100">
      <div className="admin-form" style={{ maxWidth: 420, width: "100%" }}>
        <div className="admin-login-form">
          <div className="text-center mb-3">
           <span className="ms-2">
                <Image
                  src="/rocket/assets/images/rocket-logo.png"
                  alt="Rocket AI"
                  width={200}
                  height={50}
                />
              </span>
            
            <h1 className="card-title mb-3 h5 mt-4">Sign in to the admin account</h1>
            
          </div>

          {error ? (
            <div className="alert alert-danger py-2 small" role="alert">
              {error}
            </div>
          ) : null}

          <form className="needs-validation mt-3" noValidate onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="admin-email" className="form-label">
                Email address
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                className="form-control"
                placeholder="name@example.com"
                required
                autoFocus
                autoComplete="email"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="admin-password" className="form-label">
                Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                className="form-control"
                placeholder="Password"
                required
                minLength={6}
                autoComplete="current-password"
              />
            </div>

            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
