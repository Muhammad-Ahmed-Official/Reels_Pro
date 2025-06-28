import { NextResponse, NextRequest } from "next/server";
import { connectionToDatabase } from "@/lib/db";
import { User } from "@/models/User";

export async function POST(request: NextRequest) {
    try {
        const { userName, email, password } = await request.json();
        if(!userName || !email || !password) return NextResponse.json( {error: "Missing Fields"}, {status: 400} );
        
        await connectionToDatabase();
        
        const existingUser = await User.findOne({ $or: [ { email}, {userName} ] });
        if(existingUser) return NextResponse.json( {error: "Email or Username already registered"}, {status: 400} );

        await User.create({ userName, email, password });
        return NextResponse.json( {error: "User registered successfully"}, {status: 201} );
    } catch (error) {
        return NextResponse.json( {error: "Failed to register User"}, {status: 500} );
    }
}