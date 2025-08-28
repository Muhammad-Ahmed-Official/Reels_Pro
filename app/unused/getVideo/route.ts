// import { connectionToDatabase } from "@/lib/db";
// import { Video } from "@/models/Video";
// import { asyncHandler } from "@/utils/AsyncHandler";
// import { nextError, nextResponse } from "@/utils/Responses";
// import { getToken } from "next-auth/jwt";
// import mongoose from "mongoose";
// import { NextRequest, NextResponse } from "next/server";

// export const GET = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
//     const token = await getToken({ req: request });
//     if(!token) return nextError(401, "Unauthorized: Token not found")
//     const { searchParams } = new URL(request.url)
//     const id = searchParams.get("id");
//     if(!id) nextError(200, "Missing reqiured fields");
    
//     await connectionToDatabase();
//     const video = await Video.aggregate([
//         { $match: {_id: new mongoose.Types.ObjectId(id!)} },
//             // Lookup owner info
//         {
//             $lookup: {
//                 from: "users",
//                 foreignField: "_id",
//                 localField: "user",
//                 as: "owner"
//             }
//         },
//         { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true} },
//         // Lookup savedVideo
//         {
//             $lookup: {
//             from: "playlists",
//             let: { videoId: "$_id" },
//             pipeline: [
//                     {
//                     $match: {
//                         $expr: {
//                         $and: [
//                             { $eq: ["$user", new mongoose.Types.ObjectId(token._id)] },
//                             { $in: ["$$videoId", "$videos"] }
//                         ]
//                         }
//                     }
//                 }
//             ],
//             as: "matchedVideo"
//             }
//         },
//         {
//             $addFields: {
//                 isSaved: {
//                     $cond: {
//                         if: { $gt: [{ $size: "$matchedVideo" }, 0] },
//                         then: true,
//                         else: false
//                     }
//                 }
//             }
//         },
//         // Lookup likes
//         {
//             $lookup: {
//                 from: "likes",
//                 localField: "_id",
//                 foreignField: "video",
//                 as: "likedUsers"
//             }
//         },
//         {
//             $addFields: {
//                 likesCount: { $size: "$likedUsers" },
//                 likedUserIds: {
//                     $reduce: {
//                         input: "$likedUsers",
//                         initialValue: [],
//                         in: { $concatArrays: ["$$value", "$$this.users"] }
//                     }
//                 }
//             }
//         },
//         {
//             $addFields: {
//                 isLikedVideo: {
//                     $in: [new mongoose.Types.ObjectId(token._id), "$likedUserIds"]
//                 }
//             }
//         },
            
//             {
//                 $project: {
//                     videoUrl: 1,
//                     title: 1,
//                     description: 1,
//                     views: 1,
//                     createdAt: 1,
//                     owner: {
//                         _id: 1,
//                         userName: "$owner.userName",
//                         profilePic: "$owner.profilePic",
//                         isVerified: "$owner.isVerified",
//                     },
//                     likesCount: 1,
//                     isLikedVideo: 1,
//                     likedUserInfo: {
//                         userName: 1,
//                         profilePic: 1
//                     },
//                     isFollow: 1,
//                     isSaved: 1,
//                 }
//             }  
//         ]);
//         // console.log(video);

//         if (!video || video.length === 0) return nextError(404, "Video not found");
//         return nextResponse(200, "", video);
// })





// // {
// //     $lookup: {
// //         from: "follows", 
// //         let: { videoOwner: "$user"},
// //         pipeline: [
// //             {
// //                 $match: {
// //                     $expr: {
// //                         $and: [
// //                             { $eq: ["$follower", new mongoose.Types.ObjectId(token._id)]},
// //                             { $eq: ["$following", "$$videoOwner"]},
// //                         ]
// //                     }
// //                 }
// //             }
// //         ],
// //         as: "followInfo",
// //     } 
// // },
// // commentWithUser: 1,
// // {
// //                 $lookup: {
// //                     from: "comments",
// //                     let: { videoId: "$_id" },
// //                     pipeline: [
// //                     { $match: { $expr: { $eq: ["$videoId", "$$videoId"] } } },
// //                     {
// //                         $lookup: {
// //                         from: "users",
// //                         localField: "user",
// //                         foreignField: "_id",
// //                         as: "user"
// //                         }
// //                     },
// //                     { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
// //                     {
// //                         $project: {
// //                         _id: 1,
// //                         text: "$comment",
// //                         createdAt: 1,
// //                         user: {
// //                             _id: "$user._id",
// //                             userName: "$user.userName",
// //                             profilePic: "$user.profilePic",
// //                             isVerified: "$user.isVerified"
// //                         }
// //                         }
// //                     }
// //                     ],
// //                     as: "commentWithUser"
// //                 }
// //             },