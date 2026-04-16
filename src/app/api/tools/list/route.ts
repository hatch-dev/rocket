import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {

    try {

        const data = await prisma.clientTool.findMany({

            include: {
                client: true,
                tool: {
                    include: {
                        links: true
                    }
                }
            }

        });

        return NextResponse.json(data);

    } catch (error) {

        console.log("Fetch error:", error);

        return NextResponse.json(
            { error: "Failed to fetch tools" },
            { status: 500 }
        );
    }
}