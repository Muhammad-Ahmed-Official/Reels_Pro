import { connectionToDatabase } from "@/lib/db";
import { Playlist } from "@/models/Playlist";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


export const POST = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    await connectionToDatabase();

    const token = await getToken({ req: request });
    if(!token || !token._id) return nextError(401, "Unauthorized: Token not found");

    const { playlistName, videoId } = await request.json();
    if(!playlistName || !videoId) return nextError(400, "Missing fields");

    const findPlaylist = await Playlist.findOne({playlistName, user: token._id});
    if(!findPlaylist) return nextError(404, "Playlist not found");
    
    await Playlist.updateOne({ _id: findPlaylist._id }, { $addToSet: { videos: videoId } });

    return nextResponse(200, "Video saved successfully");
})