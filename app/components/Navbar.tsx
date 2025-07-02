'use client';

import { UserRound } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/icon1.png";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="navbar bg-white shadow-md px-4 sm:px-10 py-2 sticky top-0 z-50">
      {/* Left: Logo */}
      <div className="flex-1">
        <Link href="/" aria-label="Home">
          <Image src={logo} alt="Meraki Logo" height={50} width={50} priority />
        </Link>
      </div>

      {/* Right: User/Actions */}
      <div className="dropdown dropdown-end">
        <label
          tabIndex={0}
          className="btn btn-ghost btn-circle avatar hover:bg-gray-100"
        >
          <UserRound className="w-6 h-6" />
        </label>

        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[999] p-4 shadow-lg bg-white rounded-xl w-64 space-y-2 text-sm"
        >
          {session ? (
            <>
              <li>
                <span className="text-sm text-gray-500">Welcome</span>
                <span className="font-semibold text-base text-black">
                  {user?.userName?.toUpperCase() ||
                    user?.name?.toUpperCase() ||
                    user?.email}
                </span>
              </li>
              <li>
                <Link
                  href="/upload"
                  className="hover:text-teal-600 font-medium"
                >
                  Upload Reels
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="hover:text-teal-600 font-medium"
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="btn btn-outline btn-error mt-2 w-full">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login" >
                <button className="btn btn-outline btn-accent w-full">
                  Login
                </button>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
