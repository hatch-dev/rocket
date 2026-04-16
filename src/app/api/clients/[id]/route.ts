import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";


// Get Client
export async function GET(request: Request, context: any) {

  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const clientId = Number(params.id);

  if (!clientId || isNaN(clientId)) {
    return NextResponse.json(
      { error: "Invalid client id" },
      { status: 400 }
    );
  }

  try {
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });

    return NextResponse.json(client);

  } catch (error) {
    console.log("GET CLIENT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch client" },
      { status: 500 }
    );
  }
}

// ===== UPDATE CLIENT =====
export async function PATCH(request: Request, context: any) {

  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const clientId = Number(params.id);

  console.log("PATCH CLIENT ID:", clientId);

  if (!clientId || isNaN(clientId)) {
    return NextResponse.json(
      { error: "Invalid client id" },
      { status: 400 }
    );
  }

  const body = await request.json();

  try {
    const updated = await prisma.client.update({
      where: { id: clientId },
      data: {
        name: body.name,
        icon: body.icon,
      },
    });

    return NextResponse.json(updated);

  } catch (error) {
    console.log("UPDATE CLIENT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 }
    );
  }
}


// ===== DELETE CLIENT =====
export async function DELETE(request: Request, context: any) {

  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const clientId = Number(params.id);

  console.log("DELETE CLIENT ID:", clientId);

  if (!clientId || isNaN(clientId)) {
    return NextResponse.json(
      { error: "Invalid client id" },
      { status: 400 }
    );
  }

  try {
    // delete relations first
    await prisma.clientEmployee.deleteMany({
      where: { clientId }
    });

    // delete client
    await prisma.client.delete({
      where: { id: clientId }
    });

    return NextResponse.json({
      message: "Deleted successfully"
    });

  } catch (error) {
    console.log("DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}


// ===== ASSIGN EMPLOYEES =====
export async function POST(request: Request, context: any) {

  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const clientId = Number(params.id);

  console.log("ASSIGN CLIENT ID:", clientId);

  if (!clientId || isNaN(clientId)) {
    return NextResponse.json(
      { error: "Invalid client id" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const employeeIds = body.employeeIds;

  if (!Array.isArray(employeeIds)) {
    return NextResponse.json(
      { error: "employeeIds must be an array" },
      { status: 400 }
    );
  }

  try {
    const existing = await prisma.clientEmployee.findMany({
      where: { clientId },
      select: { employeeId: true }
    });

    const existingIds = existing.map(e => e.employeeId);

    const toAdd = employeeIds.filter(id => !existingIds.includes(id));
    const toRemove = existingIds.filter(id => !employeeIds.includes(id));

    if (toRemove.length > 0) {
      await prisma.clientEmployee.deleteMany({
        where: {
          clientId,
          employeeId: { in: toRemove }
        }
      });
    }

    if (toAdd.length > 0) {
      await prisma.clientEmployee.createMany({
        data: toAdd.map(empId => ({
          clientId,
          employeeId: empId
        })),
        skipDuplicates: true
      });
    }

    return NextResponse.json({
      message: "Employees updated successfully"
    });

  } catch (error) {
    console.log("ASSIGN ERROR:", error);

    return NextResponse.json(
      { error: "Failed to assign employees" },
      { status: 500 }
    );
  }
}