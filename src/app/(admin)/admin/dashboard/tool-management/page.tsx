import { ToolManagement } from "@/components/admin/ToolManagement";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export default function AdminDashboardPage() {
  return < ToolManagement />;
}

