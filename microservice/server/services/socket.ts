import { Server } from 'socket.io'
import { createAdapter } from "@socket.io/redis-adapter";
import { Redis } from "ioredis";
import { Chat } from '../Models/Chat.model.ts';
import { consumeNotifications } from '../Consumer/notificationConsumer.ts';
import dotenv from "dotenv";

dotenv.config({quiet:true});

const pub = new Redis ({
    host: process.env.REDIS_HOST_URL,
    port: Number(process.env.REDIS_PORT_NUMBER),
    password: process.env.REDIS_PASSWORD,
});

const sub = pub.duplicate();

pub.on("error", (err: any) => {
  console.error("Redis pub error:", err);
});
sub.on("error", (err: any) => {
  console.error("Redis sub error:", err);
});


export default class SocketService {
    private _io: Server;
    private userSocketMap = new Set<string>();

    constructor(){
        this._io = new Server({
            adapter: createAdapter(pub, sub),
            cors: {
                allowedHeaders: ['*'],
                origin: '*'
            }
        });
    };

    public async initListener(){
        const io = this.io;
        

        io.on('connection', (socket) => {
            const userId = socket.handshake?.query?.userId as string;
            console.log(`Socket connected: ${socket.id} for user ${userId}`);
            if(userId && userId !== undefined){
                this.userSocketMap.add(userId)
            }
            console.log("Online users:", Array.from(this.userSocketMap));
            io.emit("getOnlineUser", Array.from(this.userSocketMap));

            

            socket.on("joinRoom", (chatId) => {
                if (!socket.rooms.has(chatId)) {
                   socket.join(chatId);
                }
                console.log(`Socket ${socket.id} joined room ${chatId}`);
            });


            socket.on("leaveRoom", ( chatId ) => {
                socket.leave(chatId);
                console.log(`User ${socket.id} left room ${chatId}`);
            });



            socket.on("message", async (data) => {
                const { sender, receiver, message, customId, userName, profilePic } = data;
                if (!receiver) return;
                
                const receiverSockets = await io.in(receiver).fetchSockets();
                const isReceiverInRoom = receiverSockets.length > 0;
                const payload2 = { sender, receiver, message, customId, userName, profilePic, isReceiverInRoom};
                const payload = { sender, receiver, message, customId, userName, profilePic};
                // console.log(payload);
                io.to(receiver).emit("newMessage", payload2);
                try {
                    await Chat.create(payload)
                } catch (error: any) {
                   console.error("Message DB save failed:", error.message);
                }
            });

            socket?.on("userMsg", ({sender, receiver}) => {
                if(!sender || !receiver) return;
                io.to(receiver).emit("userMsg", sender);
            })


            socket.on("delete", async(data) => {
                const { customId, receiver } = data; 
                console.log(data)
                if (!customId || !receiver) return;
                io.to(receiver).emit("deleteMsg", customId);
                try {
                    await Chat.findOneAndDelete({customId});
                } catch (error: any) {
                   console.error("Message DB save failed:", error.message);
                }
            });


            socket.on("edit", async(data) => {
               const { customId, receiver, message } = data;
                if (!receiver || !customId) return;
                const payload = { receiver, message, customId };
                io.to(receiver).emit("editMsg", payload);
                try {
                    await Chat.findByIdAndUpdate(customId, { message });
                } catch (error: any) {
                   console.error("Message DB save failed:", error.message);
                }     
            });
            

            socket.on("startTyping", ({sender, receiver}) => {
                console.log(`User is typing in chat ${sender}`);
                if(!sender || !receiver) return; 
                io.to(receiver).emit("startTyping", sender)
            });


            socket.on("stopTyping", ({sender, receiver}) =>{
                console.log(`User is stop typing in chat ${sender}`);
                if(!receiver) return; 
                io.to(receiver).emit("stopTyping", sender);
            });


            socket.on("seenMsg", async({ sender, receiver }) => {
                if(!sender || !receiver) return;
                io.to(sender).emit("seenMsg", receiver);
                try {
                    await Chat.updateMany( { sender, receiver, seen: false }, { $set: { seen: true } } )
                } catch (error: any) {
                   console.error("Message DB save failed:", error.message);
                }
            });

            socket.on("checkRoomPresence", (receiverId: string, callback) => {
                console.log(receiverId)
                // Check if the receiver is in the online users map
                const isOnline = this.userSocketMap.has(receiverId);
                console.log(isOnline)
                callback(isOnline);
            });


            // socket?.on("reel", async(data) => {
            //     console.log(data);
            //     if(!data || !data?.receiver) return;
            //     io.to(data?.receiver).emit("reelShareTo", data);
            //     try {
            //         await Chat.create(data)
            //     } catch (error: any) {
            //         console.error("Message DB save failed:", error.message);
            //     }
            // });
            
            
            // Start consumer ONCE
            socket.on("notif", () => {
                consumeNotifications(io);
            })

            
            socket.on("disconnect", () => {
                console.log(`Client disconnected: ${socket.id} for user ${userId}`);
                if(userId){
                    this.userSocketMap.delete(userId);
                    io.emit("getOnlineUser", Array.from(this.userSocketMap));
                }
            });


            socket.on("connect_error", (error) => {
                console.log("Socket Connection Error", error);
            });

        });
    }

    get io(){
        return this._io;
    }
}


