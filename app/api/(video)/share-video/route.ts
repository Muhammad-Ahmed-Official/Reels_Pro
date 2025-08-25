import { connectionToDatabase } from "@/lib/db";
import { Chat } from "@/models/Chat.model";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const POST = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    const token = await getToken({ req: request });
    if(!token || !token._id) return nextError(401, "Unauthorized: Token not found");
        
    await connectionToDatabase();
    const { customId, sender, receiver, video } = await request.json();

    if (!sender || !receiver || !video) {
        return nextError(400, "Missing required fields");
    }

    await Chat.create({ customId, sender, receiver, video });

    return nextResponse(200, "");
});