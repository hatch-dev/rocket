import { EmployeeModal } from "@/components/admin/AddEmployee";
import type { EmployeeRow } from "@/components/admin/AddEmployee";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  
  const params = await searchParams;
  const id = params.id ? Number(params.id) : null;

  const admin = await requireAdmin();
  if (!admin) {
    throw new Error("Unauthorized"); // or redirect if you want
  }

  let employee: EmployeeRow | undefined = undefined;

if (id) {
  employee = await prisma.user.findUnique({
    where: { id },
  }) || undefined;
}

  return <EmployeeModal initial={employee} />;
}