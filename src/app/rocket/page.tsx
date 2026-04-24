import { EmployeeLoginForm } from "@/components/auth/EmployeeLoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employee sign in",
};

export default function EmployeeLoginPage() {
  return <EmployeeLoginForm />;
}
