import { connectionToDatabase } from "@/lib/db";
import { Playlist } from "@/models/Playlist";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";


export const GET = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    
    const token = await getToken({ req: request });
    if(!token || !token?._id) return nextError(401, "Unauthorized: Token not found");

    await connectionToDatabase();
    
    const getPlaylist = await Playlist.find({user: token._id});
    if(!getPlaylist || getPlaylist.length === 0) return nextError(400, "No playlist found");

    const playlistWithVideo = await Playlist.aggregate([
        { $match: { user: new Types.ObjectId(token._id)}},
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
                playlistName: 1,
                videos: 1,
                "user._id": 1,
                "user.userName": 1,
                "user.email": 1
            }
        }
    ]);

    return nextResponse(200, "", playlistWithVideo);
})



export const POST = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    await connectionToDatabase();

    const token = await getToken({ req: request });
    if(!token || !token?._id) return nextError(401, "Unauthorized: Token not found");

    const { playlistName } = await request.json();
    if(!playlistName) return nextError(400, "Missing field");

    const existingPlaylist = await Playlist.findOne({ playlistName });
    if(existingPlaylist) return nextError(409, "Playlist name alredy exist");

    await Playlist.create({ playlistName, user: new mongoose.Types.ObjectId(token._id), videos: []});
    return nextResponse(201, "Playlist created");
})



export const DELETE = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    await connectionToDatabase();
    const token = await getToken({ req: request });
    if(!token || !token?._id) return nextError(401, "Unauthorized: Token not found");

    const { playlistName } = await request.json();
    if(!playlistName) return nextError(400, "Missing field");

    await Playlist.findOneAndDelete({ playlistName, user: token._id });
    return nextResponse(200, "Playlist deleted successfully");
})