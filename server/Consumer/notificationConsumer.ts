import { Server } from "socket.io";
import { getChannel } from "../services/rabbitmq.ts";
import { Notification } from "../Models/Notification.model.ts";

export const consumeNotifications = async (io: Server) => {
  const channel = getChannel();

  await channel.assertExchange("direct_notif", "direct", { durable: true });
  const queueName = "notifications_queue";
  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queueName, "direct_notif", "notifications");
  
  
  await channel.assertExchange("direct_notif2", "direct", { durable: true });
  const queueName2 = "video_notifications_queue";
  await channel.assertQueue(queueName2, { durable: true });
  await channel.bindQueue(queueName2, "direct_notif2", "video_notifications")



  channel.consume(queueName, async (msg:any) => {
    console.log("OK")
    if (msg) {
      const notification = JSON.parse(msg.content.toString());
      const { receiver } = notification;
      io.to(receiver).emit("notification", notification);
      try {
        await Notification.create(notification)
      } catch (error) {
        console.error("Message DB save failed:", error);
      }
      channel.ack(msg);
    }
  });



  channel.consume(queueName2, async(msg:any) => {
    if (!msg) return
      const notification = JSON.parse(msg.content.toString());
      const { receiver } = notification;
      // io.to(receiver).emit("notification", notification);
      try {
        await Notification.create(notification)
      } catch (error) {
        console.error("Message DB save failed:", error);
      }
      channel.ack(msg);
  });
  
};
