import { consumeNotifications } from '../Consumer/notificationConsumer.js';
import { Chat } from '../Models/Chat.models.js';
import { Server } from 'socket.io'
import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config({quiet:true});

const redis = new Redis ({
    host: process.env.REDIS_HOST_URL || "redis-15073.crce179.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: Number(process.env.REDIS_PORT_NUMBER) || 15073,
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
                console.log(`User ${userId} left room ${chatId}`);
            });

            // Start consumer ONCE

            socket.on("notif", () => {
                consumeNotifications(io);
            })


            socket.on("message", async (data) => {
                const { sender, receiver, message } = data;
                // console.log(receiver);
                if (!receiver) return;

                const payload = { sender, receiver, message };
                io.to(receiver).emit("newMessage", payload);
                try {
                    await Chat.create(payload)
                } catch (error: any) {
                   console.error("Message DB save failed:", error.message);
                }
            });


            socket.on("delete", async(data) => {
                const { _id, messageId, receiver } = data; 
                if (!receiver || !_id || !messageId) return;
                io.to(receiver).emit("deleteMsg", messageId);
                try {
                    await Chat.deleteOne({_id});
                } catch (error: any) {
                   console.error("Message DB save failed:", error.message);
                }
            });


            socket.on("edit", async(data) => {
               const { _id, receiver, sender, message } = data;
                if (!receiver || !_id) return;
                const payload = { receiver, sender, message };
                io.to(receiver).emit("editMsg", payload);
                try {
                    await Chat.findByIdAndUpdate(_id, { message });
                } catch (error: any) {
                   console.error("Message DB save failed:", error.message);
                }     
            });
            

            socket.on("startTyping", (receiver) => {
                console.log(`User is typing in chat ${receiver}`);
                if(!receiver) return; 
                io.to(receiver).emit("startTyping", receiver)
            });


            socket.on("stopTyping", (receiver) =>{
                console.log(`User is stop typing in chat ${receiver}`);
                if(!receiver) return; 
                io.to(receiver).emit("stopTyping", receiver)
            });


            socket.on("seenMsg", async(sender) => {
                // console.log(sender, "sender");
                if(!sender) return;
                io.to(sender).emit("seenMsg", sender);
                try {
                    await Chat.updateMany( { sender, seen: false }, { $set: { seen: true } } )
                } catch (error: any) {
                   console.error("Message DB save failed:", error.message);
                }
            });


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

          // const fanoutQueue = `fanout`;
            // channel.assertQueue(fanoutQueue, { durable: true });
            // channel.bindQueue(fanoutQueue, "fanout_notif", "")
            // channel.consume(fanoutQueue, (msg) => {
            //     if(msg){
            //         const notif =  JSON.parse(msg.content.toString());
            //         socket.emit("notification", notif);
            //         channel.ack(msg); 
            //     }
            // })
