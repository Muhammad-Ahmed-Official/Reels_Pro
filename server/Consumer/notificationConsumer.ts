import { Server } from "socket.io";
import { getChannel } from "../services/rabbitmq.js";

export const consumeNotifications = async (io: Server) => {
  const channel = getChannel();
  await channel.assertExchange("direct_notif", "direct", { durable: true });

  const queueName = "notifications_queue";
  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queueName, "direct_notif", "notifications");

  channel.consume(queueName, async (msg:any) => {
    if (msg) {
      const notification = JSON.parse(msg.content.toString());
      console.log(notification);
      const { receiver } = notification;

      // Emit only if user is online
      io.to(receiver).emit("notification", notification);
      channel.ack(msg);
    }
  });
};
