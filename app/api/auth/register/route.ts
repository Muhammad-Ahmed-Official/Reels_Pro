import { NextRequest } from "next/server";
import { connectionToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { nextError, nextResponse } from "@/utils/Responses";
import { asyncHandler } from "@/utils/AsyncHandler";
import { sendEmailOTP } from "@/lib/nodemailer";

export const POST =  asyncHandler(async (request: NextRequest) => {
    const { userName, email, password, profilePic } = await request.json();
    if(!userName || !email || !password || !profilePic) return nextResponse(400, "Missing Fields");

    await connectionToDatabase();
    
    const existingUserVerifiedByUsername = await User.findOne({ userName, isVerified: true });
    if(existingUserVerifiedByUsername) return nextError(400, "Username already taken");

    const existingUserByEmail = await User.findOne({email});
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

    if(existingUserByEmail){
        if(existingUserByEmail?.isVerified){
            return nextError(400, "User alredy exist with this name");
        } else {
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
            await existingUserByEmail.save();
        }
    } else {
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        await User.create({ userName, email, password, verifyCode, verifyCodeExpiry: expiryDate, profilePic: profilePic || ""});
    }

    // if(existingUserByEmail) await User.create({ userName, email, password, profilePic: profilePic || ""});
    // return nextResponse(201, "User created successfully");


    const emailResponse = await sendEmailOTP(email, verifyCode);
    if (emailResponse.success) return nextResponse(200, `OTP sent to ${email}`);
    else return nextError(500, emailResponse.message);
})