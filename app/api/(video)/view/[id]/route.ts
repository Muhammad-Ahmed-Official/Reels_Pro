import { connectionToDatabase } from "@/lib/db";
import { Video } from "@/models/Video";
import { nextError, nextResponse } from "@/utils/Responses";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, { params }: { params: { id: string} }) => {
    try {
        await connectionToDatabase();
        const url = new URL(req.url);
        const pathParts = url.pathname.split("/");
        const videoId = pathParts[pathParts.length-1]
        console.log(videoId)
        if(!videoId) return nextError(400, "Missing params");
        await Video.findByIdAndUpdate(videoId, { $inc: { views: 1} })
        return nextResponse(200, "");
    } catch (error) {
        return nextError(500, "Internal server error");        
    }
}