import { connectionToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { NextRequest } from "next/server";

export const POST =  asyncHandler(async (request: NextRequest) => {
    await connectionToDatabase();

    const { email, code } = await request.json();
    const user = await User.findOne({ email: email });
    if(!user) return nextError(400, "user not found");

    const isCodeValid = user.verifyCode === code;
    const isCodeNodeExpired = new Date(user.verifyCodeExpiry) > new Date();
    if(isCodeValid && isCodeNodeExpired) {
        await User.updateOne(
        { _id: user._id },
        {
            $set: { isVerified: true },
            $unset: { verifyCode: "", verifyCodeExpiry: "" }
        }
        );
        return nextResponse(201, "You register successfully");
    } else if (!isCodeNodeExpired){
        return nextError(400, "Verification code has expired");
    } else {
        return nextError(400, "Incorrect Verification code");
    }
})