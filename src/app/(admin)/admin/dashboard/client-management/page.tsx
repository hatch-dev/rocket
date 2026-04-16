import { AllClientManagement } from "@/components/admin/ClientManagement";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export default function AdminDashboardPage() {
  return < AllClientManagement />;
}

