import { connectionToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { userNameValidation } from "@/schemas/signUpSchema";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { NextRequest } from "next/server";
import { z } from "zod";

const userNameQuerySchema = z.object({
    userName: userNameValidation,
})

export const GET = asyncHandler(async (request: NextRequest) => {
    await connectionToDatabase();
    const { searchParams } = new URL(request.url)
    const queryParam = {
        userName: searchParams.get("userName")
    }
    const result = userNameQuerySchema.safeParse(queryParam);
    if(!result.success){
        const userNameError = result.error.format().userName?._errors || [];
        return nextError(400, "Query Params not found", userNameError.length > 0 ? userNameError.join(', ') : 'Invalid query parameters')
    };
    
    const { userName } = result.data;
    const existingVerifiedUser = await User.findOne({userName, isVerified: true}).lean();
    if(existingVerifiedUser) return nextError(400, "Username alredy taken");
    
    return nextResponse(200, "userName is available");
})