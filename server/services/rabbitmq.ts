// await amqplib.connect("amqp://admin:admin@localhost:5672")

import { Server } from "socket.io";
import amqplib from "amqplib";
import { INotification } from "../Models/Notification.model.js";
let channel: amqplib.Channel

export const connectRabbitMQ = async() => {
    const connection = 
    await amqplib.connect({
        protocol: "amqp",
        username: process.env.RABBIT_MQ_Username,
        password: process.env.RABBIT_MQ_Password,
        hostname: process.env.RABBIT_MQ_Host,
        port: 5672,
    });
    
    channel = await connection.createChannel();

    await channel.assertExchange("direct_notif", "direct", { durable: true });
    await channel.assertQueue("notifications_queue", { durable: true });
    await channel.bindQueue("notifications_queue", "direct_notif", "notifications");

    await channel.assertExchange("direct_notif2", "direct", { durable: true });
    await channel.assertQueue("video_notifications_queue", { durable: true});
    await channel.bindQueue("video_notifications_queue", "direct_notif2", "video_notifications");
}


export const sendNotification = async(notif:INotification) => {
    const { typeNotification, receiver } = notif;

    const payload = Buffer.from(JSON.stringify(notif))
    switch (typeNotification) {
        case "like":
        case "comment":
        case "follow":
            if(receiver && typeof receiver === "string"){
                channel.publish("direct_notif", "notifications", payload, { persistent: true });
            }
            break;
    
        case "video":
            if(Array.isArray(receiver) && receiver.length > 0){
                for(const r of receiver){
                    const notiForUser = {...notif, receiver:r};
                    const payloadUser = Buffer.from(JSON.stringify(notiForUser));
                    channel.publish("direct_notif2", "video_notifications", payloadUser, { persistent: true });
                }
            }
           break;
        default:
            null;
    }
}
export const getChannel = () => channel;