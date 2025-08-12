import { connectionToDatabase } from "@/lib/db";
import { Follow } from "@/models/Follow";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = asyncHandler(async (request: NextRequest): Promise<NextResponse> => {
  const token = await getToken({ req: request });
  if (!token || !token?._id) return nextError(401, "Unauthorized: Token not found");

  await connectionToDatabase();

  const followers = await Follow.find({ following: token._id }).select("follower -_id").lean();

  if (!followers || followers.length === 0) {
    return nextResponse(200, "No followers found", []);
  }

  // convert object to array
  const receiver = followers.map(f => f.follower);
  return nextResponse(200, "Followers fetched successfully", receiver);
});
