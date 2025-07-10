'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface profileContextType {
    profileMode: string;
    setProfileMode: (profile: string) => void;
}


export const ProfileContext = createContext<profileContextType>({
    profileMode: "public",
    setProfileMode: () => {}
})


export const ProfileProvider = ( {children} : { children: ReactNode} ) => {
    const [profileMode, setProfileMode] = useState("public")
    useEffect(() => {    
        const savedMode = localStorage.getItem("profileMode");
        if (savedMode === "private" || savedMode === "public") {
            setProfileMode(savedMode);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("profileMode", profileMode);
    }, [profileMode]);

    return(
        <ProfileContext.Provider value={{ profileMode, setProfileMode}}>
           { children} 
        </ProfileContext.Provider>
    )
}

export default function useProfile() {
    return useContext(ProfileContext)
}