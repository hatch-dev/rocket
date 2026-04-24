// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function POST(req: NextRequest) {
//     console.log("Chat API called");

//     try {
//         const body = await req.json();
//         const { message, userId, clientId } = body;
//         console.log("Incoming:", body);

//         //  Validation
//         if (!userId || !message) {
//             return NextResponse.json(
//                 { error: "userId and message are required" },
//                 { status: 400 }
//             );
//         }

//         const parsedUserId = Number(userId);
//         const parsedClientId = clientId ? Number(clientId) : null;

//         // Step 1: find or create chat
//         let chat = await prisma.chat.findFirst({
//             where: {
//                 userId: parsedUserId,
//                 clientId: parsedClientId,
//                 type: parsedClientId ? "client" : "global"
//             }
//         });

//         if (!chat) {
//             chat = await prisma.chat.create({
//                 data: {
//                     userId: parsedUserId,
//                     clientId: parsedClientId,
//                     type: parsedClientId ? "client" : "global"
//                 }
//             });
//         }

//         // Step 2: save USER message
//         await prisma.message.create({
//             data: {
//                 chatId: chat.id,
//                 sender: "user",
//                 content: message
//             }
//         });

//         // Step 3: fake AI response
//         const reply = "AI: " + message;

//         // Step 4: save AI message
//         await prisma.message.create({
//             data: {
//                 chatId: chat.id,
//                 sender: "ai",
//                 content: reply
//             }
//         });

//         return NextResponse.json({ reply });
//     } catch (error) {
//         console.error("Chat API error:", error);
//         return NextResponse.json(
//             { error: "Something went wrong" },
//             { status: 500 }
//         );
//     }
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ================= GET MESSAGES =================
export async function GET(req: NextRequest) {
  try {
    const clientId = req.nextUrl.searchParams.get("clientId");
    const userId = req.nextUrl.searchParams.get("userId");

    if (!clientId || !userId) {
      return NextResponse.json([]);
    }

    console.log("GET CHAT:", { clientId, userId });

    // 1. Find chat for this user + client
    const chat = await prisma.chat.findFirst({
      where: {
        clientId: Number(clientId),
        userId: Number(userId)
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" }
        }
      }
    });

    if (!chat) {
      return NextResponse.json([]);
    }

    return NextResponse.json(chat.messages);

  } catch (error) {
    console.log("GET CHAT ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// ================= SEND MESSAGE =================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, userId, clientId } = body;

    console.log("POST CHAT:", body);

    // 1. Find or create chat
    let chat = await prisma.chat.findFirst({
      where: {
        userId,
        clientId
      }
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          userId,
          clientId,
          type: "client"
        }
      });
    }

    // 2. Save USER message
    await prisma.message.create({
      data: {
        chatId: chat.id,
        sender: "user",
        content: message
      }
    });

    // 3. Fake AI reply
    const aiReply = `AI reply for client ${clientId}`;

    // 4. Save AI message
    await prisma.message.create({
      data: {
        chatId: chat.id,
        sender: "ai",
        content: aiReply
      }
    });

    return NextResponse.json({ reply: aiReply });

  } catch (error) {
    console.log("POST CHAT ERROR:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}