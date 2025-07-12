import { connectionToDatabase } from "@/lib/db";
import { Comment } from "@/models/Comment";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";


export const buildCommentTree = (comments:any) => {
    const map = new Map<string, any>();
    const roots: any[] = [];

    comments.forEach((c:any) => {
        map.set(c._id.toString(), {...c.toObject(), children:[] });
    });

    comments.forEach((c:any) => {
        if(c.parentCommentId){
            const parent = map.get(c.parentCommentId.toString());
            if(parent){
                parent.children.push(map.get(c._id.toString()));
            }
        } else {
            roots.push(map.get(c._id.toString()));
        }
    });

    return roots;
};



export const GET = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    await connectionToDatabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("videoId");
    if(!id) nextError(200, "Missing reqiured fields");
    const comments = await Comment.find({ videoId: id }).sort({ createdAt: -1 });
    if(!comments) return nextError(400, "Error in getting comment");

    const tree = buildCommentTree(comments);
    return nextResponse(200, "Comment fetched successfully", tree);

})



export const POST = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    await connectionToDatabase();

    const token = await getToken({ req: request });
    if(!token || !token?._id) return nextError(401, "Unauthorized: Token not found");
    
    const { videoId, comment } = await request.json();
    if(!videoId) return nextError(400, "VideoId is reqired");
    if(!comment) return nextError(400, "Missing field");
    console.log(videoId)
    await Comment.create({user: new mongoose.Types.ObjectId(token._id), videoId: new mongoose.Types.ObjectId(videoId), comment, parentCommentId: null,})
    return nextResponse(201, "Comment successfully");
})



export const DELETE = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
  await connectionToDatabase();
  
  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get("commentId");

  if(!commentId) return nextError(200, "Missing reuired fields");

  const deleteComment = await Comment.findByIdAndDelete(commentId);
  if(!deleteComment) return nextError(200, "Error in deleting");

  return nextResponse(200, "Comment deleted successfully");
})