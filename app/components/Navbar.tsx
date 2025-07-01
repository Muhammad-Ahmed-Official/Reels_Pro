// 'use client'

// import { UserRound } from "lucide-react";
// import { User } from "next-auth";
// import { signOut, useSession } from "next-auth/react"
// import Link from "next/link";
// import logo from '../../public/icon1.png'
// import Image from "next/image";

// export default function Navbar() {
//     const { data: session } = useSession();
//     const user: User = session?.user as User;
//     return (
//         <div className="navbar bg-base-100 shadow-sm p-0 px-10">
//         <div className="flex-1">
//             <Image src={logo} alt="logo" height={60} width={60} />
//         </div>
//         <div className="dropdown dropdown-end">
//         <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
//             <UserRound />
//         </div>
//       <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
//         {
//             session ? 
//             (
//                 <>
//                     <li>
//                         <span className="text-sm text-gray-500">Welcome</span>
//                         <span className="font-semibold text-base text-black">
//                         {user?.userName?.toUpperCase() ||
//                             user?.name?.toUpperCase() ||
//                             user?.email}
//                         </span>
//                     </li>
//                     <li className="font-semibold text-2xl"> <Link href='/upload'> Upload Reels </Link> </li>
//                     <li  className="font-semibold text-2xl"> <Link href='/upload'> Profile </Link> </li>
//                     <button className="btn btn-outline btn-accent " onClick={() => signOut()}>Logout</button>
//                 </>
//             ) : 
//             (
//                 <li> <Link href='/login'> <button className="btn btn-outline btn-accent h-[35px] w-[95px]">Login</button> </Link> </li>
//             )
//         }
//         </ul>
//   </div>
//     </div>
//   )
// }

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
                  onClick={() => signOut()}
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
