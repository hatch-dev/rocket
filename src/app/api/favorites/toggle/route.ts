import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { clientId, toolLinkId, employeeId } = body;

    if (!clientId || !toolLinkId || !employeeId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const existing = await prisma.favorite.findFirst({
      where: {
        clientId: Number(clientId),
        toolLinkId: Number(toolLinkId),
        employeeId: Number(employeeId)
      }
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id }
      });

      return NextResponse.json({ added: false });
    } else {
      await prisma.favorite.create({
        data: {
          clientId: Number(clientId),
          toolLinkId: Number(toolLinkId),
          employeeId: Number(employeeId) 
        }
      });

      return NextResponse.json({ added: true });
    }

  } catch (error) {
    console.log("TOGGLE ERROR:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}