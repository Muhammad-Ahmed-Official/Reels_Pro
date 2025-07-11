import { connectionToDatabase } from "@/lib/db";
import { Like } from "@/models/Like";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export const POST = asyncHandler(async (request: NextRequest):Promise<NextResponse> => {
    await connectionToDatabase();

    const token = await getToken({ req: request });
    if (!token || !token._id) {
        return nextError(401, "Unauthorized: Token not found");
    }
    const { videoId } = await request.json();
    if (!videoId) return nextError(400, "videoId are required");

    const existingLike = await Like.findOne({ video: videoId });
    if(existingLike){
        const hasUserLikes = existingLike.users.some((id : any) => id.equals(token._id));
        if(hasUserLikes){
            await Like.updateOne(
                { video: videoId },
                {
                    $pull: { users: token._id },
                    $inc: { likes: -1 },
                }
            )
            return nextResponse(200, 'Video unliked');
        } else {
            await Like.updateOne(
              { video: videoId },
              {
                $addToSet: { users: token._id },
                $inc: { likes: 1 },
              }  
            )
        } 
    }
    await Like.create({users: [new mongoose.Types.ObjectId(token._id)], video: videoId, like: 1});
    return nextResponse(201, "liked");
})