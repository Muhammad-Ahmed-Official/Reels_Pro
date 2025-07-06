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

    const { playlistId, videoId } = await request.json();
    if(!playlistId || !videoId) return nextError(400, "Missing fields");

    const findPlaylist = await Playlist.findById(playlistId);
    if(!findPlaylist) return nextError(404, "Playlist not found");
    const isCheckedVideoIsPresent = findPlaylist.videos.includes(videoId);
    const updatedPlaylist = isCheckedVideoIsPresent ? 
    {
        $pull: { videos: videoId }
    } :
    {

        $push: { videos: videoId }
    }
    const updated = await Playlist.findByIdAndUpdate(playlistId, updatedPlaylist, { new: true })
    return nextResponse(200, isCheckedVideoIsPresent ? "Video Unsaved Successfully!" : "Video Save Successfully!", updated);
})