'use client'

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react'
import ReelCard from './ReelCard';

export default function Home() {
    // useEffect(() => {
        // const { data: session } = useSession();
        // console.log(session?.user?._id)
        // if(!session?.user?._id) redirect("/login");
    // }, [])

  return (
    <div className='flex flex-wrap gap-6 justify-center p-4'>
        <ReelCard />
        {/* <ReelCard />
        <ReelCard />
        <ReelCard /> */}
    </div>
  )
}
