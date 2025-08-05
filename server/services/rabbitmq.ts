import amqplib from "amqplib";
import { INotification } from "../Models/Notification.model.js";
let channel: amqplib.Channel

export const connectRabbitMQ = async() => {
    const connection = 
    // await amqplib.connect("amqp://admin:admin@localhost:5672")
    await amqplib.connect({
        protocol: "amqp",
        username: process.env.RABBIT_MQ_Username,
        password: process.env.RABBIT_MQ_Password,
        hostname: process.env.RABBIT_MQ_Host,
        port: 5672,
    });
    
    channel = await connection.createChannel();
    
    await channel.assertExchange("direct_notif", "direct", { durable: true });
    await channel.assertExchange("fanout_notif", "fanout", { durable: true });
}

export const sendNotification = async(notif:INotification) => {
    const { typeNotification, recipient } = notif;
    const payload = Buffer.from(JSON.stringify(notif))

    switch (typeNotification) {
        case "like":
        case "comment":
        case "follow":
            if(recipient){
                channel.publish("direct_notif", recipient, payload, { persistent: true });
            }
            break;
    
        case "video":
           channel.publish("fanout_notif", "", payload, { persistent: true });
           break;
        default:
            null;
    }
}


export const getChannel = () => channel;