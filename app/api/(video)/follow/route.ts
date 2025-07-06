import { connectionToDatabase } from "@/lib/db";
import { Follow } from "@/models/Follow";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


export const POST = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    await connectionToDatabase();
    
    const token = await getToken({ req: request });
    if(!token) return nextError(200, "Unauthorized: Token not found");

    const followerId = token._id;
    const { followingId } = await request.json();

    if(followerId === followingId) return nextError(200, "You cannot follow yourself");

    const existingFollowing = await Follow.findOne({
        follower: followerId,
        following: followingId,
    })

    if(existingFollowing){
        await Follow.deleteOne({_id: existingFollowing._id});
        return nextResponse(200, "Unfollow");
    }

    await Follow.create({ follower: followerId, following: followingId });
    return nextResponse(200, "Followed successfully");
})