import { connectionToDatabase } from "@/lib/db";
import { Playlist } from "@/models/Playlist";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const POST = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    const token = await getToken({ req: request });
    if(!token || !token._id) return nextError(401, "Unauthorized: Token not found");
    
    await connectionToDatabase();

    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get("id");
    if(!videoId) return nextError(400, "Missing fields");

    let savedPlaylists = await Playlist.findOne({ user: token._id });
    if(!savedPlaylists){
        await Playlist.create({
            user: new mongoose.Types.ObjectId(token._id), videos: [videoId]
        })
    };
    
    const isPresentVideo = savedPlaylists.videos.some((v:string) => v.toString() === videoId);
    const update = isPresentVideo ?
    { $pull: { videos: videoId} }:
    { $addToSet: { videos: videoId}}
    
    await Playlist.findByIdAndUpdate(savedPlaylists._id, update, { new: true});
    return nextResponse(200, isPresentVideo ? "Video unsaved successfully" : "Video saved successfully")
})




export const GET = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    const token = await getToken({ req: request });
    if(!token || !token?._id) return nextError(401, "Unauthorized: Token not found");

    await connectionToDatabase();
    
    const getPlaylist = await Playlist.find({user: token._id});
    if(!getPlaylist || getPlaylist.length === 0) return nextError(400, "No playlist found");

    const playlistWithVideo = await Playlist.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(token._id)}},
        {
            $lookup: {
                from: "videos",                 // The target collection to join with (MUST match MongoDB collection name)
                localField: "videos",           // Field in the current (Playlist) collection that holds reference(s)
                foreignField: "_id",            // Field in the target (Video) collection to match with
                as: "videos"              // Name of the new array field that will hold matched documents
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: "$user"},
        // { $unwind: "$videos" },
        {
            $project: {
                createdAt: 1,
                videos: 1,
                "user._id": 1,
                "user.userName": 1,
                "user.email": 1
            }
        }
    ]);
    return nextResponse(200, "", playlistWithVideo);
})




export const DELETE = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    const token = await getToken({ req: request });
    if(!token || !token?._id) return nextError(401, "Unauthorized: Token not found");
    
    await connectionToDatabase();

    await Playlist.findOneAndDelete({ user: token._id });
    return nextResponse(200, "Playlist deleted successfully");
})