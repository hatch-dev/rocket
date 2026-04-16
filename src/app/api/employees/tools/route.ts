import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {

    try {
        const { searchParams } = new URL(req.url);
        const clientId = Number(searchParams.get("clientId"));

        if (!clientId) {
            return NextResponse.json([]);
        }

        const data = await prisma.clientTool.findMany({
            where: {
                clientId: clientId,
            },
            include: {
                tool: {
                    include: {
                        links: true,
                    },
                },
            },
        });

        const grouped: any = {};

        data.forEach((item: any) => {
            const title = item.tool.title;

            if (!grouped[title]) {
                grouped[title] = {
                    title,
                    links: [],
                };
            }

            (item.tool.links || []).forEach((link: any) => {
                grouped[title].links.push({
                    id: link.id,
                    title: link.title,
                    url: link.url,
                    icon: link.icon,
                });
            });
        });

        return NextResponse.json(Object.values(grouped));

    } catch (error) {
        console.log("GET TOOLS ERROR:", error);

        return NextResponse.json([], { status: 500 });
    }
}