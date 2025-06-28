'use client'

import { UserRound } from "lucide-react";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react"
import Link from "next/link";
import logo from '../../public/icon1.png'
import Image from "next/image";

export default function Navbar() {
    const { data: session } = useSession();
    const user: User = session?.user as User;

  return (
    <div className="navbar bg-base-100 shadow-sm p-0 px-10">
        <div className="flex-1">
            <Image src={logo} alt="logo" height={60} width={60} />
            {/* <a className="btn btn-ghost text-xl">Reel Pro</a> */}
        </div>
        <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <UserRound />
        </div>
      <ul
      tabIndex={0}
      className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
      <li className="font-semibold text-2xl"> <Link href='/upload'> Upload Reels </Link> </li>
      {
          session ? 
          ( <> <span className="m-4 text-black font-semibold">Welcome, {user?.userName?.toLocaleUpperCase() || user?.email}</span> <button className="btn btn-outline btn-accent " onClick={() => signOut()}>Logout</button> </> ) : 
          ( <Link href='/login'> <button className="btn btn-outline btn-accent">Login</button> </Link> )
        }
  </ul>
  </div>
    </div>
  )
}



{/* <li>
<a className="justify-between">
    Profile
    <span className="badge">New</span>
</a>
</li> */}

{/* <div className="flex gap-2 items-center">
    {
        session ? 
        ( <> <span className="m-4 text-black font-semibold">Welcome, {user?.userName?.toLocaleUpperCase() || user?.email}</span> <button className="btn btn-outline btn-accent " onClick={() => signOut()}>Logout</button> </> ) : 
        ( <Link href='/login'> <button className="btn btn-outline btn-accent">Login</button> </Link> )
    }
</div> */}
{/* <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" /> */}
  {/* <div className="dropdown dropdown-end">
  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
      <div className="w-10 rounded-full">
      <img
          alt="Tailwind CSS Navbar component"
          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
      </div>
  </div> */}
  {/* <ul
      tabIndex={0}
      className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
      <li>
      <a className="justify-between">
          Profile
          <span className="badge">New</span>
      </a>
      </li>
      <li><a>Settings</a></li>
      {
          session ? 
          ( <> <span className="m-4 text-black font-semibold">Welcome, {user?.userName?.toLocaleUpperCase() || user?.email}</span> <button className="btn btn-outline btn-accent " onClick={() => signOut()}>Logout</button> </> ) : 
          ( <Link href='/sign-in'> <button className="btn btn-outline btn-accent">Login</button> </Link> )
      }
  </ul>
  </div> */}