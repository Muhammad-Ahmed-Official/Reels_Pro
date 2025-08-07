import { connectionToDatabase } from "@/lib/db";
import { Chat } from "@/server/Models/Chat.models";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = asyncHandler(async (request: NextRequest):Promise<NextResponse> => {
    const token = await getToken({ req: request });
    if(!token || !token._id) return nextError(401, "Unauthorized: Token not found");
    
    await connectionToDatabase();

    const leftsidebarUser = await Chat.aggregate([
    {
        $match: {
            $or: [
                { sender: new mongoose.Types.ObjectId(token._id) },
                { receiver: new mongoose.Types.ObjectId(token._id) }
            ]
        }
    },
    // {
    //     $addFields: {
    //     otherUser: {
    //         $cond: [
    //         { $eq: ["$sender", new mongoose.Types.ObjectId(token._id)] },
    //         "$receiver",
    //         "$sender"
    //         ]
    //     }
    //     }
    // },
    {
        $lookup: {
            from: "users",
            localField: "sender",
            foreignField: "_id",
            as: "user"
        }
    },
    // { $unwind: "$user" },
    // {
    //     $group: {
    //     _id: "$otherUser",
    //     user: { $first: "$user" },
    //     latestMessage: { $first: "$message" },
    //     createdAt: { $first: "$createdAt" }
    //     }
    // },
    // {
    //     $project: {
    //     _id: 0,
    //     userId: "$user._id",
    //     name: "$user.userName",
    //     pic: "$user.profilePic",
    //     latestMessage: 1,
    //     createdAt: 1
    //     }
    // },
    // { $sort: { createdAt: -1 } }
    ]);
    
    console.log(leftsidebarUser);

    return nextResponse(200,"", leftsidebarUser);
});