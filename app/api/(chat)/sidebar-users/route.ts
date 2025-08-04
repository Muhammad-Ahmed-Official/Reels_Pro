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
                    { sender: new mongoose.Types.ObjectId(token?._id) },
                    { receiver: new mongoose.Types.ObjectId(token?._id) }
                ]
            }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $group: {
                _id: {
                    $cond: [
                        { $eq: ["$sender", new mongoose.Types.ObjectId(token?._id)] },
                        "$receiver",
                        "$sender"
                    ]
                },
                latestMessage: { $first: "$message" },
                createdAt: { $first: "$message" }
            }
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "_id",
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $lookup: {
                from: "chats",
                let: {currentUserId: new mongoose.Types.ObjectId(token._id), otherUserId: "$_id"},
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$sender", "$$otherUserId"] },
                                    { $eq: ["$receiver", "$$currentUserId"] },
                                    { $eq: ["$seen", false] }
                                ]
                            }
                        }
                    },
                    { $count: "unreadCount" }
                ],
                as: "unreadMessges"
            }
        },
        {
            $addFields: {
                unreadCount: {
                    $cond: [
                        { $gt: [{ $size: "$unreadMessges"}, 0]},
                        { $arrayElemAt: ["$unreadMessages.unreadCount", 0] },
                        0
                    ]
                }
            }
        },
        {
            $project: {
                _id: 0,
                userId: "$user._id",
                name: "$user.userName",
                pic: "$user.profilePic",
                latestMessage: 1,
                createdAt: 1,
                unreadCount: 1,
            }
        },
        { $sort: { unreadCount: -1, createdAt: -1 } },
    ]);

    return nextResponse(200,"", leftsidebarUser);
});