'use client'

import { sidebarLinks } from "@/constants";
import { THEMES } from "@/constants/theme";
import { SunMoon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useTheme from "../context/themeContext";
export default function Sidebar() {
  const { data: session } = useSession();
  const user = session?.user;
  const pathName = usePathname();
  const { themeMode, setThemeMode } = useTheme();
  const handleThemeChange = (newTheme) => {
    setThemeMode(newTheme);
  }

  return (
    <div className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between p-4 pt-12 max-sm:hidden lg:w-[200px]">
        <div className="flex flex-1 flex-col gap-3">
            <div>
                { 
                    sidebarLinks?.map(link => {
                        const isActive =  pathName === link.route || pathName.startsWith(`${link.route}/`);
                        return (
                            <Link
                                href={session ? link?.route : '/login'} 
                                key={link.label}
                                className={`flex gap-4 items-center p-4 rounded-[7px] justify-start ${isActive ? "bg-white" : ""}`}>
                                <link.icon size={20} />
                                <p className="text-lg font-semibold max-lg:hidden">{link?.label}</p>
                            </Link>
                        ) 
                    }) 
                }
            </div>
           <fieldset className="fieldset">
                <legend htmlFor="theme-select" className="fieldset-legend flex gap-1 px-4 items-center text-lg outline-none">
                  <SunMoon /> Theme
                </legend>
                <select
                  id="theme-select"
                  value={themeMode}
                  onChange={(e) => handleThemeChange(e.target.value)}
                  className="select"
                >
                  {THEMES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </fieldset>

        </div>
        <div className="flex items-center gap-3 bg-white rounded-lg p-2 shadow">
        {/* <Image
          src=""
          width={40}
          height={40}
          alt="User Avatar"
          className="rounded-full object-cover"
        /> */}
        <div className="flex flex-col">
          <p className="text-sm font-semibold">{user?.userName?.toUpperCase() || user?.name?.toUpperCase() || ""}</p>
          <p className="text-[10px] text-gray-500 break-all">{user?.email || ""}</p>
        </div>
      </div>
    </div>
  )
}
