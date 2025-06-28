'use client'

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { ImageKitProvider } from "@imagekit/next";
// import { redirect } from "next/navigation";
const urlEndPoints = process.env.NEXT_PUBLIC_URL_ENDPOINT!;

export default function Provider({ children } : { children : ReactNode }) {
    //   const { data: session } = useSession();
    //   console.log(session?.user)
    //   if(!session) redirect("/api/auth/login");
    
    return(
        <SessionProvider > 
            <ImageKitProvider urlEndpoint={urlEndPoints}> {children} </ImageKitProvider> 
        </SessionProvider> 
    )
}
// refetchInterval={5*60}