import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

// assign employees to client
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // fix params
  const { id } = await params;
  const clientId = parseInt(id);

  console.log("CLIENT ID:", clientId);

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const employeeIds = body.employeeIds;

  console.log("EMP IDS:", employeeIds);

  if (!Array.isArray(employeeIds)) {
    return NextResponse.json(
      { error: "employeeIds must be an array" },
      { status: 400 }
    );
  }

  try {
    // remove old assignments
    await prisma.clientEmployee.deleteMany({
      where: { clientId: clientId }
    });

    // insert new assignments
    await prisma.clientEmployee.createMany({
      data: employeeIds.map((empId: number) => ({
        clientId: clientId,
        employeeId: empId
      })),
      skipDuplicates: true
    });

    return NextResponse.json({
      message: "Employees assigned successfully"
    });

  } catch (error) {
    console.log("ASSIGN ERROR:", error);

    return NextResponse.json(
      { error: "Failed to assign employees" },
      { status: 500 }
    );
  }
}