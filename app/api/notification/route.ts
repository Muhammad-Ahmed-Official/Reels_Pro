import { connectionToDatabase } from "@/lib/db";
import { Notification } from "@/server/Models/Notification.model";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


export const GET = asyncHandler(async(request:NextRequest):Promise<NextResponse> => {
    const token = await getToken({ req: request })
    if(!token) return nextError(401, "Unauthorized: Token not found");

    await connectionToDatabase();
    const notification = await Notification.find({receiver: token?._id}).sort({createdAt: -1}).lean();

    await Notification.updateMany(
        {receiver: token?._id, isRead: false},
        { $set: { isRead: true } },
    )

    return nextResponse(200,"", notification);
});



export const DELETE = asyncHandler(async (request: NextRequest): Promise<NextResponse> => {
  const token = await getToken({ req: request });
  if (!token) return nextError(401, "Unauthorized: Token not found");

  const { searchParams } = new URL(request.url);
  const _id = searchParams.get("id");
  if (!_id) return nextError(400, "Notification ID is required");

  await connectionToDatabase();

  const result = await Notification.deleteOne({ _id });
  if (result.deletedCount === 0) {
    return nextError(404, "Notification not found or already deleted");
  }

  return nextResponse(200, "Notification deleted successfully");
});
