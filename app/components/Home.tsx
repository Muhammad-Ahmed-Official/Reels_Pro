'use client'

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import ReelCard from './ReelCard';
import { apiClient } from '@/lib/api-client';
import { IVideo } from '@/models/Video';

export default function Home() {
    // useEffect(() => {
        // const { data: session } = useSession();
        // console.log(session?.user?._id)
        // if(!session?.user?._id) redirect("/login");
    // }, [])

    
  const [video, setVideo] = useState<IVideo[]>([]);
  useEffect(() => {
    const fetchVideo = async() => {
      try {
        const data = await apiClient.getVideos();
        setVideo(data);
      } catch (error) {
        console.error(error)
      }
    }

    fetchVideo();
  }, [])

  console.log(video)

  return (
    <div className='flex flex-wrap gap-6 justify-center p-4'>
        {
          video?.map((reel) => (
          <ReelCard key={reel?._id?.toString()} reel={reel} />
          )) 
        }
    </div>
  )
}
