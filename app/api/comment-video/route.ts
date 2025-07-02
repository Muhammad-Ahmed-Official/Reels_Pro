import { connectionToDatabase } from "@/lib/db";
import { Comment } from "@/models/Comment";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export const POST = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    await connectionToDatabase();

    const token = await getToken({ req: request });
    if(!token || !token?._id) return nextError(401, "Unauthorized: Token not found");
    
    const { videoId, comment } = await request.json();
    if(!videoId) return nextError(400, "VideoId is reqired");
    if(!comment) return nextError(400, "Missing field");

    await Comment.create({user: new mongoose.Types.ObjectId(token._id), video: videoId, comment})
    return nextResponse(201, "Comment successfully");
})