import { connectionToDatabase } from "@/lib/db";
import { sendEmailLink } from "@/lib/nodemailer";
import { User } from "@/models/User";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const POST = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    const token = await getToken({ req: request });
    if(!token) return nextError(401, "Unauthorized: Token not found");

    await connectionToDatabase();

    const { email } = await request.json();
    if(!email) return nextError(400, "Missing Email field");

    const user = await User.findOne({email}).select("isVerified");
    if(!user) return nextError(404, "User nor found");

    if(!user.isVerified) return nextError(200, "Plz verify your account first");

    const resetLink = `${process.env.ALLOWED_ORIGIN_1}/change-password/${user.refreshToken}`;
    sendEmailLink(email, resetLink)
        .then(() => console.log("Reset email sent successfully"))
        .catch((err:any) => console.error("Error sending reset email:", err));

    return nextResponse(200, "Link send successfully");
})