"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

export function EmployeeLoginForm() {
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
      const res = await fetch("/api/auth/employee/login", {
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
      router.replace("/employee/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="employee-form " style={{ maxWidth: 420, width: "100%" }}>
        <div className="employee-login-form">
          <div className="text-center mb-3">
            <Link href="/" className="mb-4 d-inline-flex align-items-center">
              <Image
                src="/assets/images/rocket-logo.png"
                alt=""
                width={150}
                height={38}
              />

            </Link>
            <p className="small text-uppercase text-primary fw-semibold mb-2">
               Login
            </p>
            <h1 className="card-title mb-3 h5">Sign in to your account</h1>

          </div>

          {error ? (
            <div className="alert alert-danger py-2 small" role="alert">
              {error}
            </div>
          ) : null}

          <form className="needs-validation mt-3" noValidate onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
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
              <label
                htmlFor="password"
                className="form-label d-flex justify-content-between"
              >
                <span>Password</span>
              </label>
              <input
                id="password"
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

    // <div className="login-wrapper">
    //   <div className="login-container">
    //     <div className="login-box">
    //       <div className="login-left">
    //         <img src="/assets/images/login_rocket-img.png" alt="Rocket" />
    //       </div>
    //       <div className="login-right " >
    //         <form className="login-frm" noValidate onSubmit={onSubmit}>
    //           <div className="form-group">
    //             <label htmlFor="email" className="form-label">
    //               Email address
    //             </label>
    //             <input
    //               id="email"
    //               name="email"
    //               type="email"
    //               className="form-control"
    //               placeholder="name@example.com"
    //               required
    //               autoFocus
    //               autoComplete="email"
    //             />
    //           </div>

    //           <div className="form-group">
    //             <label
    //               htmlFor="password"
    //               className="form-label d-flex justify-content-between"
    //             >
    //               <span>Password</span>
    //             </label>
    //             <input
    //               id="password"
    //               name="password"
    //               type="password"
    //               className="form-control"
    //               placeholder="Password"
    //               required
    //               minLength={6}
    //               autoComplete="current-password"
    //             />
    //           </div>

    //           <button
    //             className="btn btn-primary w-100"
    //             type="submit"
    //             disabled={loading}
    //           >
    //             {loading ? "Signing in…" : "Sign in"}
    //           </button>
    //         </form>
    //       </div>
    //     </div>
    //   </div>

    // </div>
  );
}
