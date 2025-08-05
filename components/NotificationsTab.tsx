'use client';

import { useEffect, useState } from "react";
import { useSocket } from "@/app/context/SocketContext";
import { Bell, Trash2 } from "lucide-react"
import { INotification } from "@/server/Models/Notification.model";

const NotificationsTab = () => {
  
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const handleDelete = (id: string) => {
    // setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  
    useEffect(() => {
      if (!socket) return;
    
    //   const handler = (notif: INotification) => {
    //     setNotifications((prev) => [notif, ...prev]);
    //   };
    
    //   socket.on("notification", handler);
  
    return () => {
      // socket.off("notification", handler);
    };
    }, [socket]);


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 ml-14 lg:ml-0">Notifications</h2>
      <div className="space-y-4">
        {[
          { id: 1, type: "like", message: "John liked your video", time: "2 hours ago" },
          { id: 2, type: "comment", message: "Sarah commented on your post", time: "4 hours ago" },
          { id: 3, type: "follow", message: "Mike started following you", time: "1 day ago" },
          { id: 4, type: "mention", message: "You were mentioned in a post", time: "2 days ago" },
        ].map((notification) => (
          <div key={notification.id} className="group relative shadow-sm hover:shadow-md transition alert flex gap-2 items-center">
            <Bell className="w-5 h-5" />
              <div className="flex-1">
                  <div className="font-bold">{notification.message}</div>
                  <div className="text-xs opacity-70">{notification.time}</div>
              </div>
            <button
              onClick={() => handleDelete(notification.type)}
              className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-400 hover:text-red-500"
              title="Delete notification"> <Trash2 className="w-5 h-5" />
            </button>
          </div>
          ))}
        </div>
      </div>
  )
}

export default NotificationsTab;