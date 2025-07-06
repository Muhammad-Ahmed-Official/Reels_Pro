import { House, MonitorPlay, MonitorUp, Settings } from "lucide-react";

export const sidebarLinks = [
    {
        label: "Home",
        route: "/",
        icon: House
    },
    {
        label: "Upload Reel",
        route: "/upload",
        icon: MonitorUp,
    },
    {
        label: "Profile",
        route: "/profile",
        icon:  Settings,
    }
]