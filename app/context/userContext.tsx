'use client'

import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext } from "react";

interface IUserContext {
    user: {
    _id?: string;
    userName?: string;
    email?: string;
  } | null;
}

const userContext = createContext<IUserContext | undefined>(undefined);

export const UserProvider = ( {children}: {children:ReactNode} ) => {
    const { data: session } = useSession();
    const contextValue:IUserContext = {
        user: session?.user ?? null
    }

    return (
        <userContext.Provider value={contextValue}>
            {children}
        </userContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(userContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}