import { AllEmployeeManagement } from "@/components/admin/AllEmployeeManagement";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export default function AdminDashboardPage() {
  return <AllEmployeeManagement />;
}

