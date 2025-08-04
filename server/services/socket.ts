// socket.emit  frontend
// backened
// socket.on
// io.emilt

import dbConnect from '../db.js';
import { Chat } from '../Models/Chat.models.js';
import { getChannel } from './rabbitmq.js';

import { Server } from 'socket.io'

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

    public initListener(){
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


            socket.on("message", async (data) => {
                const { sender, receiver, message } = data;
                if (!receiver) return;

                const payload = { sender, receiver, message };
                io.to(receiver).emit("newMessage", payload);
                try {
                    // await dbConnect();
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
                    // await dbConnect();
                    await Chat.findByIdAndUpdate(_id, { message });
                } catch (error: any) {
                   console.error("Message DB save failed:", error.message);
                }     
            });
            

            socket.on("userStartTyping", (data) => {
                console.log(`User ${data?.userId} is typing in chat ${data.chatId}`);
                socket.to(data?.chatId).emit("userStartTyping", {
                    chatId: data.chatId,
                    userId: data?.userId,
                })
            })

            socket.on("userStopTyping", (data) =>{
                console.log(`User ${data?.userId} is stop typing in chat ${data.chatId}`);
                socket.to(data?.chatId).emit("userStopTyping", {
                    chatId: data.chatId,
                    userId: data?.userId,
                })
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

// const channel = getChannel();
            // const queueName = `queue_${userId}`
            // channel.assertQueue(queueName, { durable: true });
            // channel.bindQueue(queueName, "direct_notif", userId);
            // channel.consume(queueName, (msg) => {
            //     if(msg){
            //         const notif =  JSON.parse(msg.content.toString());
            //         socket.emit("notification", notif);
            //         channel.ack(msg);
            //     }
            // });

            // const fanoutQueue = `fanout`;
            // channel.assertQueue(fanoutQueue, { durable: true });
            // channel.bindQueue(fanoutQueue, "fanout_notif", "")
            // channel.consume(fanoutQueue, (msg) => {
            //     if(msg){
            //        const notif =  JSON.parse(msg.content.toString());
            //         socket.emit("notification", notif);
            //         channel.ack(msg); 
            //     }
            // })