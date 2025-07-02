import { connectionToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import bcrypt from "bcryptjs";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


export const PUT = asyncHandler(async (request:NextRequest): Promise<NextResponse> => {
    await connectionToDatabase();

    const token = await getToken({ req: request });
    if(!token || !token._id) return nextError(401, "Unauthorized: Token not found");

    const currentUser = await User.findById(token._id);
    if(!currentUser) return nextError(400, "User not found");

    const { oldPassword, newPassword } = await request.json();
    if(!oldPassword || !newPassword) return nextError(400, "Missing field");

    const isPasswordCorrect = await bcrypt.compare(oldPassword, currentUser.password);
    if(!isPasswordCorrect) return nextError(400, "Incorrect Password");
    
    const hashPassowrd = await bcrypt.hash(newPassword, 10);
    currentUser.password = hashPassowrd;
    
    await currentUser.save();

    return nextResponse(200, "Password updated successfully");
})