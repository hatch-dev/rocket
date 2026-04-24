import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {

    try {
        const body = await req.json();
        const { client_ids, tools } = body;
        // ================= VALIDATION =================
        if (!client_ids || client_ids.length === 0) {
            return NextResponse.json({ error: "No clients selected" }, { status: 400 });
        }
        if (!tools || tools.length === 0) {
            return NextResponse.json({ error: "No tools provided" }, { status: 400 });
        }

        // ================= LOOP TOOLS =================
        for (const tool of tools) {
            const existingTools = await prisma.tool.findMany({
                where: { title: tool.toolTitle }
            });
 
            if (existingTools.length > 0) {
                for (const existing of existingTools) {  
                    await prisma.toolLink.deleteMany({
                        where: { toolId: existing.id }
                    });
                    await prisma.clientTool.deleteMany({
                        where: { toolId: existing.id }
                    });
                    await prisma.tool.delete({
                        where: { id: existing.id }
                    });
                }
            }

            // Always create new tool (IMPORTANT)
            const createdTool = await prisma.tool.create({
                data: {
                    title: tool.toolTitle
                }
            });

            // create links
            if (tool.toolInfos && tool.toolInfos.length > 0) {
                await prisma.toolLink.createMany({
                    data: tool.toolInfos.map((info: any) => ({
                        toolId: createdTool.id,
                        title: info.title,
                        url: info.url,
                        icon: info.icon || ""
                    }))
                });
            }

            // map clients
            await prisma.clientTool.createMany({
                data: client_ids.map((clientId: number) => ({
                    clientId,
                    toolId: createdTool.id
                })),
                skipDuplicates: true
            });
        }
        return NextResponse.json({
            success: true,
            message: "Tools saved successfully"
        });
    } catch (error) {
        return NextResponse.json({
            error: "Something went wrong"
        }, { status: 500 });

    }
}