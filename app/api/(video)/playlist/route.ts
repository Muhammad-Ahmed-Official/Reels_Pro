import { connectionToDatabase } from "@/lib/db";
import { Playlist } from "@/models/Playlist";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";


export const GET = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    await connectionToDatabase();

    const token = await getToken({ req: request });
    if(!token || !token?._id) return nextError(401, "Unauthorized: Token not found");

    const getPlaylist = await Playlist.findOne({user: token._id});
    if(!getPlaylist) return nextError(400, "No playlist found");

    return nextResponse(200, "", getPlaylist);
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