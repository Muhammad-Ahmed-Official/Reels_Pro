'use client'

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "./userContext";
import { useSearchParams } from "next/navigation";

interface ISocketContext {
    socket: Socket | undefined;
    onlineUsers: string[];
}

const SocketContext = createContext<ISocketContext | null>(null);

export const SocketProvider = ( {children} : {children: ReactNode} ) => {
    const { user } = useUser();
    const [socket, setSocket] = useState<Socket>();
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const searchParams = useSearchParams();
    const tab = searchParams.get("tab");
    
    useEffect(() => {
        if(!user?._id) return;
        if (tab !== "messages" && tab !== "notifications" && tab !== "/"){
            socket?.emit("leaveRoom", user?._id);
            socket?.disconnect();
            setSocket(undefined);
            return;
        } 
            const _socket = io("http://localhost:4000", {
                query:{    
                    userId: user?._id
                }}
            );
            setSocket(_socket);

            _socket.on("connect", () => {
                _socket?.emit("joinRoom", user?._id);
            });

            _socket.on("getOnlineUser", (users: string[]) => {
                setOnlineUsers(users)
            });

            return () => {
                _socket.emit("leaveRoom", user?._id);   
                _socket.disconnect();
                setSocket(undefined);
            }
    }, [user?._id, tab])


    return (
        <SocketContext.Provider value={{socket, onlineUsers}}>
            { children }
        </SocketContext.Provider>
    )
};

export const useSocket = () => {
    const state = useContext(SocketContext);
    if(!state) throw new Error("State us undefined");
    return state;
}