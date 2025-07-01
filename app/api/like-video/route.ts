import { connectionToDatabase } from "@/lib/db";
import { Like } from "@/models/Like";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { NextRequest, NextResponse } from "next/server";


export const POST = asyncHandler(async (request: NextRequest):Promise<NextResponse> => {
    await connectionToDatabase();

    const { userId, videoId } = await request.json();
    if (!userId || !videoId) return nextError(400, "userId and videoId are required");

    const existingLike = await Like.findOne({ user: userId, video: videoId });
    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)
        return nextResponse(200, 'Video unliked');
    }

    await Like.create({user: userId, video: videoId, like: 1});
    return nextResponse(201, "liked");
})