import { AddToolLinks } from "@/components/admin/AddToolLinks";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export default function AdminDashboardPage() {
  return < AddToolLinks />;
}

