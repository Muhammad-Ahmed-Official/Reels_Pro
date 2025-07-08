import { connectionToDatabase } from "@/lib/db";
import { sendEmailOTP } from "@/lib/nodemailer";
import { User } from "@/models/User";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const POST = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    
    const token = await getToken({ req: request });
    if(!token) return nextError(400, "Unauthorized: Token not found");
    
    await connectionToDatabase();

    const { email } = await request.json();
    if(!email) return nextError(400, "Missing Email field");

    const user = await User.findOne({email});
    if(!user) return nextError(404, "User nor found");

    const now = new Date();
    if (user.verifyCode && user.verifyCodeExpiry && user.verifyCodeExpiry > now) {
        return nextError(429, "An OTP has already been sent. Please wait before requesting a new one.");
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    user.verifyCode = verifyCode;
    user.verifyCodeExpiry = expiryDate;
    
    await user.save();

    const emailResponse = await sendEmailOTP(email, verifyCode);
    if (emailResponse.success) return nextResponse(200, `OTP sent to ${email}`);
    else return nextError(500, emailResponse.message);

})