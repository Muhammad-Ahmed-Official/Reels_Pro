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

            // {
            //     $lookup: {
            //         from: "follows",
            //         localField: "owner._id",
            //         foreignField: "following",
            //         as: "followerList",
            //     }
            // },
            // {
            //     $lookup: {
            //         from: "follows",
            //         localField: "owner._id",
            //         foreignField: "follower",
            //         as: "followingList",
            //     }
            // },
            // {
            //     $addFields: {
            //         followerCount: { $size: { $ifNull: ["$followerList", []]} },
            //         followingCount: { $size: { $ifNull: ["$followingList", []]} },
            //     }
            // },
            {
                $lookup: {
                from: "playlists",
                let: { videoId: "$_id" },
                pipeline: [
                    {
                    $match: {
                        $expr: {
                        $and: [
                            { $eq: ["$user", new mongoose.Types.ObjectId(token._id)] },
                            { $in: ["$$videoId", "$videos"] }
                        ]
                        }
                    }
                    }
                ],
                as: "matchedVideo"
                }
            },
            {
                $addFields: {
                    isSaved: {
                    $cond: {
                        if: { $gt: [{ $size: "$matchedVideo" }, 0] },
                        then: true,
                        else: false
                    }
                    }
                }
            },
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
                        $reduce: {
                            input: "$likedUsers",
                            initialValue: [],
                            in: { $concatArrays: ["$$value", "$$this.users"] }
                        }
                    }
                }
            },
            {
                $addFields: {
                    isLikedVideo: {
                        $in: [new mongoose.Types.ObjectId(token._id), "$likedUserIds"]
                    }
                }
            },

            // Lookup comments
            {
                $lookup: {
                    from: "comments", 
                    localField: "_id",
                    foreignField: "videoId",
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
                                        { $eq: ["$follower", new mongoose.Types.ObjectId(token._id)]},
                                        { $eq: ["$following", "$$videoOwner"]},
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
                    $ifNull: [
                        {
                        $map: {
                            input: "$comments",
                            as: "comment",
                            in: {
                            _id: "$$comment._id",
                            text: "$$comment.comment",
                            createdAt: "$$comment.createdAt",
                            user: {
                                $let: {
                                vars: {
                                    userMatch: {
                                    $arrayElemAt: [
                                        {
                                        $filter: {
                                            input: "$commentUsers",
                                            as: "cu",
                                            cond: { $eq: ["$$cu._id", "$$comment.user"] }
                                        }
                                        },
                                        0
                                    ]
                                    }
                                },
                                in: {
                                    _id: "$$userMatch._id",
                                    userName: "$$userMatch.userName",
                                    profilePic: "$$userMatch.profilePic",
                                    isVerified: "$$userMatch.isVerified"
                                }
                                }
                            }
                            }
                        }
                        },
                        []
                    ]
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
                        _id: 1,
                        userName: "$owner.userName",
                        profilePic: "$owner.profilePic",
                        isVerified: "$owner.isVerified",
                    },
                    likesCount: 1,
                    isLikedVideo: 1,
                    likedUserInfo: {
                        userName: 1,
                        profilePic: 1
                    },
                    // followerCount: 1,
                    // followingCount: 1,
                    commentWithUser: 1,
                    isFollow: 1,
                    isSaved: 1,
                }
            }  
        ]);

        if (!video || video.length === 0) return nextError(404, "Video not found");
        return nextResponse(200, "", video);
})