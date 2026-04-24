import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET favorites by client
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const clientId = Number(searchParams.get("clientId"));

        if (!clientId) {
            return NextResponse.json({ error: "clientId required" }, { status: 400 });
        }

        const favorites = await prisma.favorite.findMany({
            where: {
                clientId: clientId
            },
            include: {
                toolLink: {
                    include: {
                        tool: true
                    }
                }
            }
        });

        return NextResponse.json(favorites);
    } catch (error) {
        console.log("FAVORITES GET ERROR:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}