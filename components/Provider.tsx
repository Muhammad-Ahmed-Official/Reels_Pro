'use client'

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { ImageKitProvider } from "@imagekit/next";
const urlEndPoints = process.env.NEXT_PUBLIC_URL_ENDPOINT!;

export default function Provider({ children } : { children : ReactNode }) {
    
    return(
        <SessionProvider refetchInterval={5*60}> 
            <ImageKitProvider urlEndpoint={urlEndPoints}> {children} </ImageKitProvider> 
        </SessionProvider> 
    )
}