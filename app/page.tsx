"use client"

import { useEffect, useState } from "react"
import { Video, Bell, MessageCircle, Plus, User, Menu, X, LogOut, ListVideo } from "lucide-react"
import HomeTab from "@/components/HomeTab"
import VideosTab from "@/components/VideoTab"
import NotificationsTab from "@/components/NotificationsTab"
import MessagesTab from "@/components/MessagesTab"
import CreateTab from "@/components/CreateTab"
import ProfileTab from "@/components/ProfileTab"
import { signOut } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import WatchLaterTab from "@/components/WatchLaterTab"
import { useUser } from "./context/userContext"
import { useSocket } from "./context/SocketContext"
import Loader from "@/components/Loader"

type TabType = "reels" | "notifications" | "messages" | "create" | "profile" | "logout" | "watchLater"

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<TabType>("reels");
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [collectionModalOpen, setCollectionModalOpen] = useState<boolean>(false);
    const [unreadCount, setUnreadCount] = useState<number>(10)
    const { socket } = useSocket();
    const { user, loading } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();


    useEffect(() => {
        const receiver = user?._id   
        if (socket && activeTab === "notifications") {
            socket?.emit("joinRoom", receiver);
            socket?.emit("notif");
        }
    }, [socket, activeTab === "notifications"]);

    useEffect(() => {
        const tabFromUrl = searchParams.get("tab") as TabType;
        if (tabFromUrl) {
            setActiveTab(tabFromUrl);
        } else {
            setActiveTab("reels");
        }
    }, [searchParams]);

    const tabs = [
        { id: "reels" as TabType, label: "Reels", icon: Video },
        { id: "notifications" as TabType, label: "Notifications", icon: Bell },
        { id: "messages" as TabType, label: "Chat", icon: MessageCircle },
        { id: "create" as TabType, label: "Create", icon: Plus },
        { id: "watchLater" as TabType, label: "Watch Later", icon: ListVideo },
        { id: "profile" as TabType, label: "Profile", icon: User },
        { id: "logout" as TabType, label: "Logout", icon: LogOut },
    ]

    const renderTabContent = () => {
        switch (activeTab) {
            case "reels":
                return <VideosTab />
            case "notifications":
                return <NotificationsTab />
            case "messages":
                return <MessagesTab />
            case "profile":
                return <ProfileTab />
            default:
                return <HomeTab />
        }
    }


    useEffect(() => {
        if(!loading && !user?._id) router.push("/login")
    }, [loading, user?._id])


    if (loading) return <Loader />;

    return (
        <div className="min-h-screen">
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow hover:shadow-md hover:from-purple-600 hover:to-pink-600 text-sm transition-all cursor-pointer">
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            <div
            className={`fixed inset-y-0 left-0 z-40 w-64 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
                <div className="pointer-events-none absolute inset-0 mix-blend-multiply">
                <div className="absolute top-[-10%] left-[10%] h-[20vmax] w-[20vmax] rounded-full bg-gradient-to-br from-fuchsia-300 via-pink-300 to-purple-300 opacity-30 blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] right-[5%] h-[18vmax] w-[18vmax] rounded-full bg-gradient-to-br from-indigo-300 via-sky-300 to-blue-300 opacity-30 blur-3xl animate-pulse" />
                <div className="absolute top-[50%] left-[40%] h-[14vmax] w-[14vmax] rounded-full bg-gradient-to-br from-violet-200 to-pink-200 opacity-40 blur-2xl animate-pulse" />
                </div>
                <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(transparent_0,transparent_70%,rgba(0,0,0,0.25)_70%)] [background-size:3px_3px]" />
            </div>

            <div className="relative p-6 text-gray-800">
                <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-8 ml-14 lg:ml-0"> Dashboard </h1>
                <nav className="space-y-2">
                {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    const isNotification = tab.id === "notifications";
                    const isActive = activeTab === tab.id;

                    return (
                    <button
                        key={tab.id}
                        onClick={() => {
                        if (tab.id === "create") {
                            setIsCreateModalOpen(true);
                        } else if (tab.id === "logout") {
                            signOut({ callbackUrl: "/login" });
                        } else if (tab.id === "watchLater") {
                            setCollectionModalOpen(!collectionModalOpen);
                        } else {
                            setActiveTab(tab.id);
                            if (tab?.id !== "reels") {
                                router.push(`?tab=${tab.id}`, { scroll: false });
                            } else {
                                router.push("/", { scroll: false });
                            }
                            setSidebarOpen(false);
                        }
                        }}
                        className={`cursor-pointer w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 
                        ${
                            isActive
                            ? "bg-gradient-to-r from-purple-200 to-pink-200 text-purple-800 shadow-md shadow-pink-100"
                            : "bg-white/60 hover:bg-white/80 text-gray-700 hover:text-purple-600"
                        }`}>
                        <div className="relative">
                        <IconComponent
                            className={`w-6 h-6 ${isActive ? "text-white" : "text-purple-600"}`}
                        />
                        {isNotification && unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 font-semibold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                            {unreadCount}
                            </span>
                        )}
                        </div>
                        <span className="font-medium">{tab.label}</span>
                    </button>
                    );
                })}
                </nav>
            </div>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
            <div
                className="fixed inset-0 bg-opacity-50 z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
            />
            )}



            <main className="lg:ml-64">
                <div className="fixed inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
                    <div className="pointer-events-none absolute inset-0 mix-blend-multiply">
                    <div className="absolute top-[-10%] left-[10%] h-[40vmax] w-[40vmax] rounded-full bg-gradient-to-br from-fuchsia-300 via-pink-300 to-purple-300 opacity-30 blur-3xl animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[5%] h-[36vmax] w-[36vmax] rounded-full bg-gradient-to-br from-indigo-300 via-sky-300 to-blue-300 opacity-30 blur-3xl animate-pulse" />
                    <div className="absolute top-[30%] left-[55%] h-[28vmax] w-[28vmax] rounded-full bg-gradient-to-br from-violet-200 to-pink-200 opacity-40 blur-2xl animate-pulse" />
                    </div>
                    <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(transparent_0,transparent_70%,rgba(0,0,0,0.3)_70%)] [background-size:3px_3px]" />
                </div>

                <div className="relative z-10">
                    <main className="min-h-screen bg-transparent">
                    {renderTabContent()}
                    </main>
                </div>
            </main>


            <CreateTab
                isModalOpen={isCreateModalOpen}
                setIsModalOpen={setIsCreateModalOpen}
            />

            <WatchLaterTab
                collectionModalOpen={collectionModalOpen}
                setCollectionModalOpen={setCollectionModalOpen}
            />

        </div>
    )
}