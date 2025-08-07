import { connectionToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    const token = await getToken({ req: request })
    if(!token) return nextError(401, "Unauthorized: Token not found");
    
    await connectionToDatabase();

    const getAllUsers = await User.find({_id: {$ne: token?._id}}).select("_id userName profilePic").lean();

    return nextResponse(200,"", getAllUsers);
})