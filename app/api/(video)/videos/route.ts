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
        { $match: { user: new mongoose.Types.ObjectId(token._id)}},
        { $sort: {createdAt: -1}},
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes",
            }
        },
    ])
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