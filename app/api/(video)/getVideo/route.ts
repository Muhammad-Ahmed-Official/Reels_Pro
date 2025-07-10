import { connectionToDatabase } from "@/lib/db";
import { Video } from "@/models/Video";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const GET = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    const token = await getToken({ req: request });
    if(!token) return nextError(401, "Unauthorized: Token not found")
    
        await connectionToDatabase();

        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id");
        if(!id) nextError(200, "Missing reqiured fields");
        
        const video = await Video.aggregate([
            { $match: {_id: new mongoose.Types.ObjectId(id!)} },

            // Lookup owner info
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "user",
                    as: "owner"
                }
            },
            { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true} },

            // Lookup likes
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "video",
                    as: "likedUsers"
                }
            },
            {
                $addFields: {
                    likesCount: { $size: "$likedUsers" },
                    likedUserIds: {
                        $map: {
                            input: "$likedUsers",
                            as: "like",
                            in: "$$like.user"
                        }
                    }
                }
            },
            {
                $addFields: {
                    isLikedCurrentUser: {
                        $in: [new mongoose.Types.ObjectId(token._id), "$likedUserIds"]
                    }
                }
            },

            // Lookup comments
            {
                $lookup: {
                    from: "comments", 
                    localField: "_id",
                    foreignField: "video",
                    as: "comments"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "comments.user",
                    foreignField: "_id",
                    as: "commentUsers"
                }
            },
            {
                $lookup: {
                    from: "follows", 
                    let: { videoOwner: "$user"},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$isFollowing", "$$videoOwner"]},
                                        { $eq: ["follower", new mongoose.Types.ObjectId(token._id)]}
                                    ]
                                }
                            }
                        }
                    ],
                    as: "followInfo",
                } 
            },
            {
                $addFields: {
                    isFollow: {
                        $cond: {
                            if: { $gt: [{ $size: "$followInfo"}, 0] },
                            then: true,
                            else: false,
                        }
                    }
                }
            },
            {
                $addFields: {
                    commentWithUser: {
                        $map: {
                            input: "$comments",
                            as: "comment",
                            in: {
                                _id: "$$comment._id",
                                text: "$$comment.text",
                                createdAt: "$$comment.createdAt",
                                user: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$commentUsers",
                                                as: "cu",
                                                cond: { $eq: ["$$cu._id", "$$comment.user"]}
                                            }
                                        },
                                        0
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    videoUrl: 1,
                    title: 1,
                    description: 1,
                    views: 1,
                    createdAt: 1,
                    owner: {
                        userName: "$owner.userName",
                        profilePic: "$owner.profilePic",
                        isVerified: "$owner.isVerified",
                    },
                    likesCount: 1,
                    isLikedCurrentUser: 1,
                    likedUserInfo: {
                        userName: 1,
                        profilePic: 1
                    },
                    commentWithUser: 1,
                    isFollow: 1,
                }
            }  
        ]);

        if (!video || video.length === 0) return nextError(404, "Video not found");
        return nextResponse(200, "", video);
})