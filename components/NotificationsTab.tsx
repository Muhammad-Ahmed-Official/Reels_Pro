'use client';

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { INotification } from "@/server/Notification.model";
import { useSocket } from "@/app/context/SocketContext";

const NotificationsTab = () => {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handler = (notif: INotification) => {
      setNotifications((prev) => [notif, ...prev]);
    };

    socket.on("notification", handler);

    return () => {
      socket.off("notification", handler);
    };
  }, [socket]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 ml-14 lg:ml-0">Notifications</h2>
      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <div key={index} className="alert flex gap-2 items-center">
            <Bell className="w-5 h-5" />
            <div>
              <div className="font-bold">{notification.typeNotification.toUpperCase()}</div>
              <div className="text-xs opacity-70">{notification.sender} {notification.typeNotification}ed</div>
              <div className="text-xs opacity-50">{new Date(notification.createdAt).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsTab;