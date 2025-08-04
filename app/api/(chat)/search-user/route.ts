import { connectionToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export const GET = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    const token = await getToken({ req: request })
    if(!token) return nextError(401, "Unauthorized: Token not found");

    const { searchParams } = new URL(request.url);
    const userName = searchParams.get("userName");
    if(!userName) return nextError(400, "Missing fields");
    
    await connectionToDatabase();
    
    const user = await User.aggregate([
        {
            $match: {
                userName: { $regex: userName, $options: "i" }
            }
        },
        {
            $match: {
                _id: { $ne: new mongoose.Types.ObjectId(token?._id)}
            }
        },
        {
            $lookup: {
                from: "follows",
                let: { userId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $or: [
                                    { $and: [{ $eq: ["$follower", new mongoose.Types.ObjectId(token._id)] }, { $eq: ["$following", "$$userId"] }] },
                                    { $and: [{ $eq: ["$following", new mongoose.Types.ObjectId(token._id)] }, { $eq: ["$follower", "$$userId"] }] }
                                ],
                            }
                        }
                    }
                ],
                as: "connection",
            }
        },
        {
            $addFields: {
                isConnectedToLoggedInUser: { $gt: [{ $size: "$connection" }, 0] }
            }
        },
        { $sort: { isConnectedToLoggedInUser: -1 } },
        {
            $project: {
                userName: 1,
                profilePic: 1,
                isConnectedToLoggedInUser: 1,
            }
        },
    ]);

    if (user.length === 0) {
        return nextError(400, "User not found");
    };

    return nextResponse(200,"", user);
});