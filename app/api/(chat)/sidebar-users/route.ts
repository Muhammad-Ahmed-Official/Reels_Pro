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
                    { sender: new mongoose.Types.ObjectId(token._id)},
                    { receiver: new mongoose.Types.ObjectId(token._id)}
                ]
            }
        },
        {
            $addFields: {
                otherUser: {
                    $cond: [
                    { $eq: ["$sender", new mongoose.Types.ObjectId(token._id)] },
                    "$receiver",
                    "$sender"
                    ]
                },
                isUnread: {
                    $cond: {
                        if: {
                            $and: [
                                { $eq: ["$receiver", new mongoose.Types.ObjectId(token._id)]},
                                { $eq: ["$seen", false]}
                            ]
                        },
                        then: 1,
                        else: 0
                    }
                }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "otherUser",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: "$user" },
        { $sort: { createdAt: -1 } },
        {
                $group: {
                _id: "$otherUser",
                user: { $first: "$user" },
                latestMessage: { $first: "$message" },
                unreadCount: { $sum: "$isUnread"},
                createdAt: { $first: "$createdAt" }
            }
        },
        {
            $project: {
                _id: 0,
                userId: "$user._id",
                userName: "$user.userName",
                profilePic: "$user.profilePic",
                latestMessage: 1,
                createdAt: 1,
                unreadCount: 1,
            }
        },
        { $sort: { createdAt: -1 } }
    ]);
    
    return nextResponse(200,"", leftsidebarUser);
});