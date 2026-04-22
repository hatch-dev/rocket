import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest){
    try {

        const { searchParams } = new URL(req.url);

        const userId = searchParams.get("userId");
        const clientId = searchParams.get("clientId");

        console.log("GET chat:", { userId, clientId });

        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }

        const parsedUserId = Number(userId);
        const parsedClientId = clientId ? Number(clientId) : null;

        // Step 1: find chat
        const chat = await prisma.chat.findFirst({
            where: {
                userId: parsedUserId,
                clientId: parsedClientId,
                type: parsedClientId ? "client" : "global"
            }
        });

        if (!chat) {
            return NextResponse.json({
                messages: []
            });
        }

        // Step 2: get messages
        const messages = await prisma.message.findMany({
            where: {
                chatId: chat.id
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        return NextResponse.json({
            messages
        });

    } catch (error) {

        console.error("GET chat error:", error);

        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}