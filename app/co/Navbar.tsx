'use client';

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/icon1.png";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="navbar shadow-md px-4 sm:px-10 py-2 sticky top-0 z-50">
      <div className="flex-1">
        <Link href="/" aria-label="Home">
          <Image src={logo} alt="Meraki Logo" height={50} width={50} priority />
        </Link>
      </div>

      <div className="dropdown dropdown-end">
        { session ? 
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="btn mt-2 w-full"> Logout </button> :
            <Link href="/login"> <button className="btn btn-outline w-full"> Login </button> </Link>
        }    
      </div>
    </nav>
  );
}
