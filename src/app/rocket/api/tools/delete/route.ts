import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {

  try {
    const body = await req.json();
    const { title } = body;

    console.log("Deleting tool:", title);

    // 1. Find all tools with this title
    const tools = await prisma.tool.findMany({
      where: { title }
    });

    for (const tool of tools) {

      // 2. Delete links
      await prisma.toolLink.deleteMany({
        where: { toolId: tool.id }
      });

      // 3. Delete client mapping
      await prisma.clientTool.deleteMany({
        where: { toolId: tool.id }
      });

      // 4. Delete tool
      await prisma.tool.delete({
        where: { id: tool.id }
      });
    }

    return NextResponse.json({
      success: true,
      message: "Deleted successfully"
    });

  } catch (error) {
    console.log("Delete error:", error);

    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}