"use client";

type Kind = "employee" | "admin";
const baseUrl = process.env.NEXT_PUBLIC_ASSET_BASE;
export function AuthLogoutButton({ kind }: { kind: Kind }) {
  async function logout() {
    const path =
      kind === "employee"
        ? `${baseUrl}/api/auth/employee/logout`
        : `${baseUrl}/api/auth/admin/logout`;
    await fetch(path, { method: "POST", credentials: "include" });
    window.location.href = kind === "employee" ? "/rocket/" : "/rocket/admin";
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
