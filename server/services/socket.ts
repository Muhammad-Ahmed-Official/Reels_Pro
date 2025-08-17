import { consumeNotifications } from '../Consumer/notificationConsumer.js';
import { Chat } from '../Models/Chat.models.js';
import { Server } from 'socket.io'
import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config({quiet:true});

const redis = new Redis ({
    host: process.env.REDIS_HOST_URL,
    port: Number(process.env.REDIS_PORT_NUMBER),
    password: process.env.REDIS_PASSWORD,
});


export class SocketService {
    private _io: Server;
    private userSocketMap = new Set<string>();

    constructor(){
        this._io = new Server({
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
                const { sender, receiver, message, _id } = data;
                if (!receiver) return;
                
                const receiverSockets = await io.in(receiver).fetchSockets();
                const isReceiverInRoom = receiverSockets.length > 0;
                const payload = { sender, receiver, message};
                const payload2 = { sender, receiver, message, _id, isReceiverInRoom};
                // console.log(payload2);
                io.to(receiver).emit("newMessage", payload2);
                try {
                    await Chat.create(payload)
                } catch (error: any) {
                   console.error("Message DB save failed:", error.message);
                }
            });

            socket?.on("userMsg", ({sender, receiver}) => {
                if(!sender || !receiver) return;
                console.log(sender, receiver)
                io.to(receiver).emit("userMsg", sender);
            })


            socket.on("delete", async(data) => {
                const { _id, receiver, date} = data; 
                if (!_id || !receiver) return;
                io.to(receiver).emit("deleteMsg", _id);
                try {
                    await Chat.findOneAndDelete({receiver, date});
                } catch (error: any) {
                   console.error("Message DB save failed:", error.message);
                }
            });


            socket.on("edit", async(data) => {
               const { _id, receiver, message } = data;
                if (!receiver || !_id) return;
                const payload = { receiver, message, _id };
                io.to(receiver).emit("editMsg", payload);
                try {
                    await Chat.findByIdAndUpdate(_id, { message });
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
                // console.log("seen connected");
                // console.log(sender, receiver)
                if(!sender || !receiver) return;
                io.to(sender).emit("seenMsg", receiver);
                try {
                    await Chat.updateMany( { sender, receiver, seen: false }, { $set: { seen: true } } )
                } catch (error: any) {
                   console.error("Message DB save failed:", error.message);
                }
            });

            
            
            // Start consumer ONCE
            socket.on("notif", () => {
                consumeNotifications(io);
            })

            socket?.on("reel", async(data) => {
                try {
                    await Chat.create(data)
                } catch (error: any) {
                   console.error("Message DB save failed:", error.message);
                }
            });

            
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

 // socket.on("checkRoomPresence", (receiverId: string, callback) => {
//     console.log(receiverId)
//     // Check if the receiver is in the online users map
//     const isOnline = this.userSocketMap.has(receiverId);
//     console.log(isOnline)
//     callback(isOnline);
// });
