import { connectionToDatabase } from "@/lib/db"
import { Comment } from "@/models/Comment";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose";

export const POST = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    await connectionToDatabase();

    const token = await getToken({ req: request });
    if(!token || !token._id) return nextError(401, "Unauthorized: Token not found");

    const { comment, videoId, parentCommentId } = await request.json();
    if(!comment || !videoId || !parentCommentId) return nextResponse(400, "Missing fields");

    const reply = await Comment.create({
        comment,
        user: new mongoose.Types.ObjectId(token._id),
        videoId,
        parentCommentId,
    })

    return nextResponse(200, "Reply", reply);
})