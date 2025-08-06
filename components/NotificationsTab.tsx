'use client';

import { useEffect, useState } from "react";
import { useSocket } from "@/app/context/SocketContext";
import { Bell, Trash2, X } from "lucide-react"
import { INotification } from "@/server/Models/Notification.model";
import { asyncHandlerFront } from "@/utils/FrontAsyncHandler";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api-client";
import Loader from "./Loader";
import { useUser } from "@/app/context/userContext";
import { useRouter } from "next/navigation";

  const NotificationsTab = () => {
    const { socket } = useSocket();
    const { user } = useUser();
    const [loading, setLoading] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<INotification[]>([]);

    function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // in seconds
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    if (diff < 60) return rtf.format(-diff, "second");
    if (diff < 3600) return rtf.format(-Math.floor(diff / 60), "minute");
    if (diff < 86400) return rtf.format(-Math.floor(diff / 3600), "hour");
    return rtf.format(-Math.floor(diff / 86400), "day");

  }

  useEffect(() => {
    if (!socket) return;

    socket?.on("notification", (notif) => {
      // console.log(notif, "");
      setNotifications((prev) => [notif, ...prev]);
    });
    
    
    const getNotif = async() => {
      setLoading(true);
      await asyncHandlerFront(
        async() => {
          const response = await apiClient.getNotification();
          setNotifications(response as any)
        },
        (error) => {
          toast.error(error.message || "Something went wrong");
        }
      )
      setLoading(false);
    }
    
    getNotif();


    return () => {
      socket?.off("notification");
    };
  }, [socket]);

  const handleDelete = async(id: string) => {
    setNotifications((prev) => prev.filter((msgId) => msgId?._id !== id));
    await asyncHandlerFront(
      async() => {
        await apiClient.delNotification(id);
      },
      (error) => {
        toast.error(error.message || "Something went wrong");
      }
    )
  };



  return (
    <div className="p-6 relative">
      <button
        onClick={() => {
          socket?.emit("leaveRoom", user?._id);
           window.location.href = "/";
        }}
        className="absolute right-6 top-6 text-gray-500 cursor-pointer transition"
        title="Close notifications">
        <X className="w-5 h-5" />
      </button>
      <h2 className="text-2xl font-bold mb-4 ml-14 lg:ml-0">Notifications</h2>
      <div className="space-y-4">
        { loading ? 
          <Loader />  :
         notifications.length > 0 ?  notifications?.map((notification) => (
          <div key={notification?._id || notification?.typeNotification} className="group relative shadow-sm hover:shadow-md transition alert flex gap-2 items-center">
            <Bell className="w-5 h-5" />
              <div className="flex-1">
                  <div className="font-bold">{notification.message}</div>
                  <div className="text-xs opacity-70">{timeAgo(notification?.createdAt as any)}</div>
              </div>
            <button
              onClick={() => handleDelete(notification?._id as string)}
              className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-400 hover:text-red-500"
              title="Delete notification"> <Trash2 className="w-5 h-5" />
            </button>
          </div>
          )) : 
          <div>No Notification found</div>
        }
        </div>
      </div>
  )
}

export default NotificationsTab;