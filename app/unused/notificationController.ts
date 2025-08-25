// // // server/controllers/notificationController.ts

// // import { getChannel } from "./services/rabbitmq.js";


// // export const sendNotification = async (req:any, res:any) => {
// //   try {
// //     const payload = req.body; // contains sender, receiver, msg, etc.
// //     if(!payload) return;
// //     const channel = getChannel();
    
// //     channel.publish(
// //       "direct_notif",
// //       "notifications",
// //       Buffer.from(JSON.stringify(payload))
// //     );

// //     res.status(200).json({ success: true });
// //   } catch (error) {
// //     console.error("Failed to send RabbitMQ message:", error);
// //     res.status(500).json({ error: "Failed to send notification" });
// //   }
// // };


// import { Server } from "socket.io";
// import { getChannel } from "./services/rabbitmq.js";

// const queueName = "notifications_queue";
// let channel: any;

// // Call this once when app starts (e.g. in main socket file)
// // io: Server
// export const setupNotificationHandler = async () => {
//   try {
//     channel = getChannel();
//     await channel.assertExchange("direct_notif", "direct", { durable: true });
//     await channel.assertQueue(queueName, { durable: true });
//     await channel.bindQueue(queueName, "direct_notif", "notifications");

//     // Consume messages and emit to socket
//     channel.consume(queueName, async (msg: any) => {
//       if (msg) {
//         const notification = JSON.parse(msg.content.toString());
//         console.log("Received from RabbitMQ:", notification);

//         const { sender } = notification;
//         // io.to(sender).emit("notification", notification); // Emit to sender room
//         channel.ack(msg);
//       }
//     });

//     console.log("✅ RabbitMQ notification consumer started.");
//   } catch (error) {
//     console.error("❌ Failed to setup RabbitMQ consumer:", error);
//   }
// };

// // Send notification (called from your route/controller)
// export const sendNotification = async (req: any, res: any) => {
//   try {
//     const payload = req.body; // should contain sender, receiver, message, etc.
//     if (!payload) return res.status(400).json({ error: "No payload provided" });

//     if (!channel) {
//       return res.status(500).json({ error: "RabbitMQ channel not ready" });
//     }

//     channel.publish(
//       "direct_notif",
//       "notifications",
//       Buffer.from(JSON.stringify(payload))
//     );

//     console.log("Sent to RabbitMQ:", payload);
//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.error("❌ Failed to send RabbitMQ message:", error);
//     res.status(500).json({ error: "Failed to send notification" });
//   }
// };
