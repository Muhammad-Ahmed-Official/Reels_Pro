import { connectionToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { Chat } from "@/server/Models/Chat.models";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


export const POST = asyncHandler(async (request: NextRequest):Promise<NextResponse> => {
    const token = await getToken({ req: request });
    if(!token || !token._id) return nextError(401, "Unauthorized: Token not found");
    
    await connectionToDatabase();

    const payload = await request.json();
    await Chat.create(payload);

    return nextResponse(200,"")
})


export const GET = asyncHandler(async (request: NextRequest):Promise<NextResponse> => {
    const token = await getToken({ req: request });
    if(!token || !token._id) return nextError(401, "Unauthorized: Token not found");
    
    const { searchParams } = new URL(request?.url);
    const userId = searchParams.get("id");
    if(!userId) nextError(400, "Missing fields");

    await connectionToDatabase();
    
    const user = await User.findOne({ _id: userId });
    if (!user) return nextError(400, "User not found!");

    // await Chat.updateMany(
    //     { sender: userId, receiver: token._id, seen: false },
    //     { $set: { seen: true } }   
    // )

    const messages = await Chat.find(
        {
            $or: [
                { sender: userId, receiver: token._id },
                { sender: token._id, receiver: userId }
            ]
        }
    ).sort({ createdAt: 1 });

    return nextResponse(200, "", messages);
})