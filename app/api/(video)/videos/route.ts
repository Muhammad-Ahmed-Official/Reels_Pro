import { authOptions } from "@/lib/auth";
import { connectionToDatabase } from "@/lib/db";
import { Comment } from "@/models/Comment";
import { Like } from "@/models/Like";
import { IVideo, Video } from "@/models/Video";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import { Playlist } from "@/models/Playlist";
import { pipeline } from "stream";

export const GET = asyncHandler(async (request: NextRequest):Promise<NextResponse> => {
    const token = await getToken({ req: request });
    if(!token || !token?._id) return nextError(401, "Unauthorized: Token not found");
    
    await connectionToDatabase();

    const videos = await Video.aggregate([
    { $sort: { createdAt: -1 } },

    // owner info
    {
        $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "owner"
        }
    },
    {
        $unwind: {
            path: "$owner",
            preserveNullAndEmptyArrays: true  // This avoids error if no owner is found
        }
    },

    // likes info
    {
        $lookup: {
            from: "likes",
            foreignField: "video",
            localField: "_id",
            as: "likedUserDocs"
        }
    },
    {
        $addFields: {
        likes: { $size: { $ifNull: ["$likedUserDocs", []] } },
            isLiked: {
                $gt: [
                    {
                        $size: {
                            $filter: {
                                input: "$likedUserDocs",
                                as: "like",
                                cond: { $in: [ new mongoose.Types.ObjectId(token?._id), "$$like.users" ] }
                            }
                        }
                    },
                    0
                ]
            } 
        }
    },
    // ✅ 4. Check if logged-in user follows video uploader
    {
        $lookup: {
        from: "follows",
        let: { videoOwner: "$user" },
        pipeline: [
            {
            $match: {
                $expr: {
                $and: [
                    { $eq: ["$following", "$$videoOwner"] },
                    { $eq: ["$follower", new mongoose.Types.ObjectId(token._id)] }
                ]
                }
            }
            }
        ],
        as: "subscriptionInfo"
        }
    },

    // isFollow
    {
        $addFields: {
        isFollow: {
                $cond: {
                if: { $gt: [{ $size: "$subscriptionInfo" }, 0] },
                then: true,
                else: false
            }
        }
        }
    },
    {
        $lookup: {
            from: "comments",
            let: { videoId: "$_id" },
            pipeline: [
                { $match: { $expr: { $eq: ["$videoId", "$$videoId"]}}},
                {
                    $lookup: {
                        from: "users",
                        foreignField: "_id",
                        localField: "user",
                        as : "user",
                    }
                },
                { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                    _id: 1,
                    text: "$comment",
                    createdAt: 1,
                        user: {
                            // _id: "$user._id",
                            userName: "$user.userName",
                            profilePic: "$user.profilePic",
                        }
                    }
                },
            ],
            as: "commentWithUser",
        }
    },
    {
        $lookup: {
            from:"users",
            let: { loggedInId: new mongoose.Types.ObjectId(token?._id)},
            pipeline: [
                { $match: { $expr: { $ne: ["$_id", "$$loggedInId"]} }},
                { $project: { userName: 1, profilePic: 1}},
            ],
            as: "allUsersExceptLoggedIn"
        }
    },
    {
        $lookup: {
            from: "playlists",
            let: { videoId: "$_id", loggedInUserId: new mongoose.Types.ObjectId(token._id) },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$user", "$$loggedInUserId"]},
                                { $in: ["$$videoId", "$videos"] },
                            ]
                        }
                    }
                },
                // { $limit: 1 } 
            ],
            as: "userPlaylistMatches"
        },
    },
    {
        $addFields: {
            savedVideo: { $gt: [{ $size: "$userPlaylistMatches" }, 0] }
        }
    },
    {
      $unset: "userPlaylistMatches"
    },
    // Project required fields only
    {
            $project: {
            savedVideo: 1,
            videoUrl: 1,
            title: 1,
            createdAt: 1,
            description: 1,
            views: 1,
            likes: 1,
            commentWithUser: 1,
            // user: 1,
            isFollow: 1,
            owner: {
                _id: "$owner._id",
                userName: "$owner.userName",
                profilePic: "$owner.profilePic"
            },
            // likes: 1,
            isLiked: 1,
            allUsersExceptLoggedIn: 1,
        }
    }
    ]);

    if(!videos || videos.length === 0) return nextError(200, "No videos uploaded yet.", []);
    return nextResponse(201, "Videos get successfully", videos); 
})



export const POST = asyncHandler(async (request: NextRequest):Promise<NextResponse> => {
    const session = await getServerSession(authOptions);
    if(!session){
        return nextError(401, "Unauthorized")
    };
    
    await connectionToDatabase();
    
    const body: IVideo = await request.json();
    if (!body.title || !body.description || !body.videoUrl ) {
        return nextError(400, "Missing required field");
    };
    
    const videoData = { 
        ...body, 
        controls: body?.controls ?? true, 
        transformation: {
            height: 1920, 
            width: 1080,
            quality: body?.transformation?.quality ?? 100, 
        },
        user: new mongoose.Types.ObjectId(session.user._id),
    }
    const newVideo = await Video.create(videoData);
    // console.log(newVideo);
    return nextResponse(201, newVideo);
})



export const DELETE = asyncHandler(async (request: NextRequest):Promise<NextResponse> => {
    await connectionToDatabase();

    const { videoId } = await request.json();
    if(!videoId) return nextError(404, "Video ID is required");

    const video = await Video.findById(videoId);
    if(!video) return nextError(404, "Video not found");

    const [videoResult, commentResult, likeResult, playlistUpdateResult] = await Promise.all([
        Comment.deleteMany({ video: video._id}),
        Like.deleteMany({ video: video._id}),
        Video.deleteOne({_id: videoId}),
        Playlist.updateMany(
            { videos: { videoId }},
            { $pull: { videos: { videoId } } }      
        )
    ])

    if(!videoResult || !commentResult || !likeResult || playlistUpdateResult) return nextError(404, "Error in deleting Video");

    return nextResponse(200,"Video Delete Succesfully!");
})