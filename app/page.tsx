"use client"

import { useEffect, useState } from "react"
import { Home, Video, Bell, MessageCircle, Plus, User, Menu, X, LogOut, ListVideo } from "lucide-react"
import HomeTab from "@/components/HomeTab"
import VideosTab from "@/components/VideoTab"
import NotificationsTab from "@/components/NotificationsTab"
import MessagesTab from "@/components/MessagesTab"
import CreateTab from "@/components/CreateTab"
import ProfileTab from "@/components/ProfileTab"
import { asyncHandlerFront } from "@/utils/FrontAsyncHandler"
import toast from "react-hot-toast"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import PlaylistTab from "@/components/PlaylistTab"

// Tab Components
type TabType = "home" | "videos" | "notifications" | "messages" | "create" | "profile" | "logout" | "playlist"

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<TabType>("home");
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    const tabs = [
        { id: "home" as TabType, label: "Home", icon: Home },
        { id: "videos" as TabType, label: "Videos", icon: Video },
        { id: "notifications" as TabType, label: "Notifications", icon: Bell },
        { id: "messages" as TabType, label: "Messages", icon: MessageCircle },
        { id: "create" as TabType, label: "Create", icon: Plus },
        { id: "playlist" as TabType, label: "Playlist", icon: ListVideo },
        { id: "profile" as TabType, label: "Profile", icon: User },
        { id: "logout" as TabType, label: "Logout", icon: LogOut },
    ]

    const renderTabContent = () => {
        switch (activeTab) {
            case "home":
                return <HomeTab />
            case "videos":
                return <VideosTab />
            case "notifications":
                return <NotificationsTab />
            case "messages":
                return <MessagesTab />
            case "profile":
                return <ProfileTab />
            case "playlist":
                return <PlaylistTab />
            default:
                return <HomeTab />
        }
    }

    const { data: session } = useSession();
    // console.log(session?.user?._id)
    const router = useRouter();

    // useEffect(() => {
    //     if(!session?.user?._id){
    //         // router.push("/login")
    //     }
    // }, [])

    return (
        <div className="min-h-screen">
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn btn-square btn-primary">
                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-black/100 text-white/80 lg:text-black lg:bg-primary-50 dark:bg-black/100 dark:text-white/80 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-primary mb-8 ml-14 lg:ml-0">Dashboard</h1>
                    <nav className="space-y-2">
                        {tabs.map((tab) => {
                            const IconComponent = tab.icon
                            return (
                                <button
                                key={tab.id}
                                    onClick={() => {
                                        if (tab.id === "create") {
                                            setIsCreateModalOpen(true)
                                        } else if (tab.id === "logout"){
                                            signOut({ callbackUrl: "/login" });
                                        } else {
                                            setActiveTab(tab.id)
                                            setSidebarOpen(false)
                                        }
                                    }}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${activeTab === tab.id ? "bg-primary-500 text-white hover:bg-primary-600" : "hover:bg-primary-600 hover:text-white/95"
                                        }`}>
                                    <IconComponent className="w-5 h-5" />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            )
                        })}
                    </nav>
                </div>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-30 lg:hidden text-white" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main content */}
            <div className="lg:ml-64">
                <main className="min-h-screen dark:bg-black/80 dark:text-white/70">{renderTabContent()}</main>
            </div>

            <CreateTab
                isModalOpen={isCreateModalOpen}
                setIsModalOpen={setIsCreateModalOpen}
            />

        </div>
    )
}