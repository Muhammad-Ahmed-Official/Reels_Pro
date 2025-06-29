import { authOptions } from "@/lib/auth";
import { connectionToDatabase } from "@/lib/db";
import { IVideo, Video } from "@/models/Video";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export const GET = asyncHandler(async () => {
    await connectionToDatabase();
    
    const videos = await Video.find({}).sort({createdAt: -1}).lean();
    if(!videos || videos.length === 0) return nextError(400, "Empty field", []);
    
    return nextResponse(201, "Videos get successfully", videos); 
})

export const POST = asyncHandler(async (request: NextRequest) => {
    const session = await getServerSession(authOptions);
    if(!session){
        return nextError(401, "Unauthorized")
    };
    
    await connectionToDatabase();
    
    const body: IVideo = await request.json();
    if (!body.title || !body.description || !body.videoUrl ) {
        return nextError(400, "Missing required field");
    };
    // || !body.thumbnailUrl
    
    const videoData = { 
        ...body, 
        controls: body?.controls ?? true, 
        transformation: {
            height: 1920, 
            width: 1080,
            quality: body?.transformation?.quality ?? 100, 
        }}
    const newVideo = await Video.create(videoData);
    return nextResponse(201, newVideo);
    
})




// export async function GET() {
//     try {
//     } catch (error) {
//         // return nextError(400, "Failed to fetch videos");
//         // return NextResponse.json([], { status: 200})
//         // console.log(error)
//         // return NextResponse.json(videos);
//         // return NextResponse.json({error: "Failed to fetch videos"}, {status: 500})
//     }
// }




// export async function POST(request: NextRequest) {
//     try {
//             // return NextResponse.json({error: "Unauthorized"}, {status: 401})   
//             // return NextResponse.json({error: "Missing required field"}, {status: 400})
//         // return NextResponse.json(newVideo, {status: 201});
//     } catch (error) {

//         return NextResponse.json({error: "Failed to create video"}, {status: 500})
//     }
// }