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

export const GET = asyncHandler(async (request: NextRequest):Promise<NextResponse> => {
    await connectionToDatabase();

    const token = await getToken({ req: request });
    if(!token || !token?._id) return nextError(401, "Unauthorized: Token not found");

    const videos = await Video.aggregate([
    { $sort: { createdAt: -1 } },

    // ✅ 1. Add owner info
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

    // ✅ 2. Add likes info
    {
        $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likedUserDocs"
        }
    },
    {
        $addFields: {
        likes: { $size: { $ifNull: ["$likedUserDocs", []] } },
        likesUserIds: {
            $map: {
            input: "$likedUserDocs",
            as: "like",
            in: "$$like.user"
            }
        }
        }
    },

    // ✅ 3. Get liked user info
    {
        $lookup: {
        from: "users",
        localField: "likesUserIds",
        foreignField: "_id",
        as: "LikedUserInfo"
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

    // ✅ 5. Derive isFollow
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

    // ✅ 6. Project required fields only
    {
        $project: {
        videoUrl: 1,
        title: 1,
        description: 1,
        views: 1,
        likes: 1,
        // user: 1,
        isFollow: 1,
        owner: {
            userName: "$owner.userName",
            profilePic: "$owner.profilePic"
        },
        LikedUser: {
            $map: {
            input: "$LikedUserInfo",
            as: "o",
            in: {
                userName: "$$o.userName",
                profilePic: "$$o.profilePic"
            }
            }
        }
        }
    }
    ]);


//     const videos = await Video.aggregate([
//         { $sort: {createdAt: -1}},
//         {
//             $lookup: {
//                 from: "users",   // target collection
//                 foreignField: "user", // current collection
//                 localField: "_id",
//                 as: "owner",
//             }
//         },
//         {
//             $lookup: {
//                 from: "likes",
//                 localField: "_id",
//                 foreignField: "video",
//                 as: "likedUserDocs",
//             }
//         },
//         {
//             $addFields: {
//                 likes: { $size: { $ifNull: ["$likedUserDocs", []]}},
//                 likesUserIds: {
//                     $map: {
//                         input: "$likedUserDocs",
//                         as: "like",
//                         in: "$$like.user"
//                     }
//                 }
//             }
//         },
//         {
//             $lookup: {
//                 from: "users",
//                 localField: "likesUserIds",
//                 foreignField: "_id",
//                 as: "LikedUserInfo"
//             }
//         },
//         // ...(token
//         //     ? [
//         //         {
//         //             $lookup: {
//         //                 from: "follows",
//         //                 let: { videoOwner: "$user" },
//         //                 pipeline: [
//         //                     {
//         //                         $match: {
//         //                             $expr:{
//         //                                 $and: [
//         //                                     { $eq: ["$following", "$videoOwner"] },
//         //                                     { $eq: ["$follower", new mongoose.Types.ObjectId(token?._id.toString())] }  // follower == logged-in user
//         //                                 ]
//         //                             }
//         //                         }
//         //                     }
//         //                 ],
//         //                 as: "subscriptionInfo"
//         //             }
//         //         }
//         //     ]
//         //     : [
//         //         {
//         //             $addFields: {
//         //                 isFollow: false,
//         //             }
//         //         }
//         //     ]),
// // This stage is used to reshape the owner field of each video document, so it only contains: username profilePic  // Instead of returning the full user object(s).
//         {
//             $project: {
//                 owner: {
//                     $map: {
//                         input: "$owner",
//                         as: "o",
//                         in: {
//                             userName: "$$o.userName",
//                             profilePic: "$$o.profilePic",
//                         }
//                     }
//                 },
//                 LikedUser: {
//                     $map: {
//                         input: "$LikedUserInfo",
//                         as: "o",
//                         in: {
//                             userName: "$$o.userName",
//                             profilePic: "$$o.profilePic",
//                         }
//                     }
//                 },
//                 videoUrl: 1,
//                 views: 1,
//                 likes: 1,
//                 user: 1,
//                 // isFollow: 1
//             }
//         }
//     ])
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