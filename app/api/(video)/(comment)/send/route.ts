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
        map.set(c?._id.toString(), {...c?.toObject(), children:[] });
    });

    comments.forEach((c:any) => {
        if(c?.parentCommentId){
            const parent = map.get(c?.parentCommentId.toString());
            if(parent){
                parent?.children.push(map.get(c._id.toString()));
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
    const comments = await Comment.find({ videoId: id }).populate({ path:"user", select: "userName profilePic"}).sort({ createdAt: -1 });
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
    await Comment.create({user: new mongoose.Types.ObjectId(token._id), videoId: new mongoose.Types.ObjectId(videoId), comment, parentCommentId: null,})
    return nextResponse(201, "Comment successfully");
});



export const PUT = asyncHandler(async(request:NextRequest):Promise<NextResponse> => {
    const { commentId, comment} = await request.json();
    console.log(commentId)
    await connectionToDatabase();

    const existingComment = await Comment.findById(commentId);
    if (!existingComment) {
        return nextResponse(404, "Comment not found");
    }

    const updateComment = await Comment.findOneAndUpdate(
        { _id: commentId },
        { $set: { comment } },
        { new: true }
    );

    return nextResponse(200, "Comment updated successfully", updateComment);
})



export const DELETE = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");
    if(!commentId) return nextError(200, "Missing reuired fields");
    
    await connectionToDatabase();

    const hasChildren = await Comment.exists({ parentCommentId: commentId });
    
    if(!hasChildren){
        const deleteComment = await Comment.findByIdAndDelete(commentId);
        if(!deleteComment) return nextError(200, "Error in deleting");
        return nextResponse(200, "Comment deleted successfully");
    } else {
        const result = await Comment.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(commentId) } },
            {
                $graphLookup:{
                    from: "comments",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "parentCommentId",
                    as: "replies"
                }
            },
        ])
        if (!result.length) return nextError(200, "Comment not found");
        const allIds = [
            result[0]._id,
            ...result[0].replies.map((r: any) => r._id)
        ];
        await Comment.deleteMany({ _id: { $in: allIds}});
    }
    return nextResponse(200, "Parent comment and its replies deleted successfully");
})


// from: "comments",                 // 1️⃣ Which collection to look in (same collection here)
// startWith: "$_id",                 // 2️⃣ Starting point (the current document's _id)
// connectFromField: "_id",           // 3️⃣ Field in current level documents to match
// connectToField: "parentCommentId", // 4️⃣ Field in other documents to compare against
// as: "replies"                      // 5️⃣ Where to store all connected documents
