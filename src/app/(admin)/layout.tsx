import { DashboardShell } from "@/components/layout/DashboardShell";
import type { ReactNode } from "react";
import { Suspense } from "react";

export default function AdminShellLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-vh-100" />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}

