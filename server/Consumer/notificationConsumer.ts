import { Server } from "socket.io";
import { getChannel } from "../services/rabbitmq.js";
import { Notification } from "../Models/Notification.model.js";

export const consumeNotifications = async (io: Server) => {
  const channel = getChannel();
  await channel.assertExchange("direct_notif", "direct", { durable: true });

  const queueName = "notifications_queue";
  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queueName, "direct_notif", "notifications");

  channel.consume(queueName, async (msg:any) => {
    if (msg) {
      const notification = JSON.parse(msg.content.toString());
      const { receiver } = notification;
      // console.log(notification)
      io.to(receiver).emit("notification", notification);
      try {
        await Notification.create(notification)
      } catch (error) {
        console.error("Message DB save failed:", error);
      }
      channel.ack(msg);
    }
  });
};
