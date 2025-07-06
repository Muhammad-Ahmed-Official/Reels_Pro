'use client'

import React, { useEffect, useState } from 'react'
import ReelCard from './ReelCard';
import { apiClient } from '@/lib/api-client';
import { IVideo } from '@/models/Video';
import toast from 'react-hot-toast';


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
        const response = await apiClient.getVideos();
        setVideo(response);
      } catch (error) {
        const errorMsg = error instanceof Error ? error?.message : "Something went wrong";
        toast.error(errorMsg);
      }
    }

    fetchVideo();
  }, [])

  // console.log(video)

  return (
    <div className='flex flex-wrap gap-6  px-4'>
        {
          video?.length > 0 ?
          video?.map((reel) => (
          <ReelCard key={reel?._id?.toString()} reel={reel} />
          )) : 
          ( <div className='font-semibold text-xl'>No videos uploaded yet.</div> )
        }
    </div>
  )
}
