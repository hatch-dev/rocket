import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET() {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const employees = await prisma.employee.findMany({
    include: {
      user: true
    },
    orderBy: { id: "asc" }
  });
  console.log("employees id :", employees);
  return NextResponse.json(employees);
}