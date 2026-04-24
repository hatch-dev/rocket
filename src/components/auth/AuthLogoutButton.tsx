"use client";

type Kind = "employee" | "admin";
export function AuthLogoutButton({ kind }: { kind: Kind }) {
  async function logout() {
    const path =
      kind === "employee"
        ? `/rocket/api/auth/employee/logout`
        : `/rocket/api/auth/admin/logout`;
    await fetch(path, { method: "POST", credentials: "include" });
    window.location.href = kind === "employee" ? "/" : "/rocket/admin";
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
