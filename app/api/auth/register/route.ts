import { NextRequest } from "next/server";
import { connectionToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { nextError, nextResponse } from "@/utils/Responses";
import { asyncHandler } from "@/utils/AsyncHandler";

export const POST =  asyncHandler(async (request: NextRequest) => {
    const { userName, email, password } = await request.json();
    if(!userName || !email || !password) return nextResponse(400, "Missing Fields");

    await connectionToDatabase();
    
    const existingUser = await User.findOne({ $or: [ { email}, {userName} ] });
    if(existingUser) return nextError(400, "Email or Username already registered")
    
    await User.create({ userName, email, password });

    return nextResponse(201, "User registered successfully")
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