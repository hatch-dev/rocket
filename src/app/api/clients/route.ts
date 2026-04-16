import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

// ===== GET CLIENTS =====
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const clients = await prisma.client.findMany({
      orderBy: { id: "asc" },
      include: {
        employees: {
          include: {
            employee: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });
    return NextResponse.json(clients);
  } catch (error) {
    console.log("GET CLIENT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}


// ===== CREATE CLIENT =====
export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const name = body.name?.trim();
  const icon = body.icon || null;

  if (!name) {
    return NextResponse.json(
      { error: "Client name is required" },
      { status: 400 }
    );
  }
  try {
   const client = await prisma.client.create({
    data: {
      name,
      icon
    }
  });
  return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.log("CREATE CLIENT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 400 }
    );
  }
}