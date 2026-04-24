import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin sign in",
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
