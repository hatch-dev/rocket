"use client";

type Kind = "employee" | "admin";

export function AuthLogoutButton({ kind }: { kind: Kind }) {
  async function logout() {
    const path =
      kind === "employee"
        ? "/api/auth/employee/logout"
        : "/api/auth/admin/logout";
    await fetch(path, { method: "POST", credentials: "include" });
    window.location.href = kind === "employee" ? "/" : "/admin";
  }

  return (
    <button
      type="button"
      className="btn btn-outline-light btn-sm"
      onClick={() => void logout()}
    >
      Logout
    </button>
  );
}
