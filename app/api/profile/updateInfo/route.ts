import { connectionToDatabase } from "@/lib/db";
import { Follow } from "@/models/Follow";
import { User } from "@/models/User";
import { Video } from "@/models/Video";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";



export const GET = asyncHandler(async (request:NextRequest): Promise<NextResponse> => {
    const token = await getToken({ req: request });
    if(!token || !token?._id) return nextError(401, "Unauthorized: Token not found");

    await connectionToDatabase();

    const userId = new mongoose.Types.ObjectId(token._id);
    console.log(userId);
    const [postCount, followerCount, followingCount, currentUser] = await Promise.all([
        Video.countDocuments({ user: userId }),
        Follow.countDocuments({ following: userId }),
        Follow.countDocuments({ follower: userId }),
        User.findById(userId).select("-password")
    ]);
    if(!currentUser) return nextError(400, "User not found");
    
    return nextResponse(200, '', { currentUser, stats: { postCount, followerCount, followingCount }});
})




export const POST = asyncHandler(async (request:NextRequest): Promise<NextResponse> => {
    
    const token = await getToken({ req: request });
    if(!token || !token?._id) return nextError(401, "Unauthorized: Token not found");
    
    await connectionToDatabase();

    const { userName, email } = await request.json();
    if(!userName || !email ) return nextError(400, "Missing field");

    const currentUser = await User.findById(token._id);
    if(!currentUser) return nextError(400, "User not found");

    if(currentUser.userName === userName && currentUser.email === email) return nextError(400, "No changes detected");

    const duplicateUser = await User.findOne({
        _id: { $ne: currentUser?._id},
        $or: [ { userName} , { email} ],
    });
    if(duplicateUser) return nextError(409, "Username or email alredy in use");

    currentUser.userName = userName;
    currentUser.email = email;
    await currentUser.save();

    return nextResponse(201, "Profile updated successfully");
})