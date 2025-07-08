import { connectionToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const POST = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    const token = await getToken({ req: request });
    if(!token) return nextError(400, "Unauthorized: Token not found");
    
    await connectionToDatabase();

    const user = await User.findById(token?._id);
    if(!user) return nextError(404, "User nor found");

    user.TFA = !user.TFA;
    await user.save();

    return nextResponse(200, "TFA on");
})