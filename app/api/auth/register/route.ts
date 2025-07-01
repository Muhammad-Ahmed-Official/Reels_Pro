import { NextRequest } from "next/server";
import { connectionToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { nextError, nextResponse } from "@/utils/Responses";
import { asyncHandler } from "@/utils/AsyncHandler";
import { sendEmailOTP } from "@/lib/nodemailer";

export const POST =  asyncHandler(async (request: NextRequest) => {
    const { userName, email, password } = await request.json();
    if(!userName || !email || !password) return nextResponse(400, "Missing Fields");

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
        await User.create({ userName, email, password, verifyCode, verifyCodeExpiry: expiryDate});
    }

    const emailResponse = await sendEmailOTP(email, verifyCode);
    if (emailResponse.success) return nextResponse(200, `OTP sent to ${email}`);
    else return nextError(500, emailResponse.message);
})



// export async function POST(request: NextRequest) {
//     try {
//         } catch (error) {
//             return nextError(500, "Failed to register User");
//     }
// }
// return NextResponse.json( {error: "Missing Fields"}, {status: 400} )
// return NextResponse.json( {error: "Email or Username already registered"}, {status: 400} );
// return NextResponse.json( {error: "Failed to register User"}, {status: 500} );
// return NextResponse.json( {error: "User registered successfully"}, {status: 201} );