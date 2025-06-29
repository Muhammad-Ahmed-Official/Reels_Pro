import { getUploadAuthParams } from "@imagekit/next/server"
// Your application logic to authenticate the user
// For example, you can check if the user is logged in or has the necessary permissions
// If the user is not authenticated, you can return an error response
// expire: 30 * 60, // Optional, controls the expiry time of the token in seconds, maximum 1 hour in the future
// token: "random-token", // Optional, a unique token for request

export async function GET() {

    try {
        const authenticationParams = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,
        })
    
        return Response.json({ authenticationParams, publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY });
    } catch (error) {
        return Response.json({ error: "Authentication failed for imagekit" }, {status: 500})
    }
}