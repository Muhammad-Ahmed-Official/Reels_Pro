'use client'

import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, SaveAll, Share2, Trash, X } from 'lucide-react';
import { IVideo } from '@/models/Video';
import { apiClient } from '@/lib/api-client';
import { useDebounceCallback } from 'usehooks-ts';
import Image from 'next/image';
import { Playlist } from '@/models/Playlist';
import toast from 'react-hot-toast';

type Prop = {
  reel: IVideo;
};

export default function ReelCard({ reel }: Prop) {
  // console.log(reel)

  function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  const intervals: [number, string][] = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [30, 'day'],
    [12, 'month'],
    [Number.POSITIVE_INFINITY, 'year'],
  ];
  
  let i = 0;
  let time = seconds;
  
  while (time >= intervals[i][0] && i < intervals.length - 1) {
    time /= intervals[i][0];
    i++;
  }
  
  time = Math.floor(time);
  const unit = intervals[i][1];
  return `${time} ${unit}${time !== 1 ? 's' : ''} ago`;
  }
  
  
  const createdAtFormatted = reel?.createdAt
  ? getTimeAgo(new Date(reel.createdAt))
  : 'Uploaded just now';

 
  const [likes, setLikes] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [liveComment, setLiveComment] = useState("");
  const debounced = useDebounceCallback(setNewComment, 3000);
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isfollow, setIsFollow] = useState(false);

  const handleLike = async() => {
    if (!reel?._id) return;
    await apiClient.likeUnlikeVideo(reel._id.toString());
    setLikes(prev => (prev != 1 ? prev + 1 : prev - 1));
  };

  const submitComment = async () => {
    if (!reel?._id || !newComment) return;
    await apiClient.createComment(reel?._id.toString(), newComment);
    setNewComment('')
  }


  const handleSave = async () => {
    setOpenSaveModal(true);    
    try {
      const response = await apiClient.getPlaylist();
      setPlaylists(response);
    } catch (error) {
      const errorMsg = error instanceof Error ? error?.message : "Something went wrong";
      toast.error(errorMsg);
    }
  }



  const handleCheckboxChange = async (isChecked: boolean, playlistId: string, videoId: string) => {
    try {
      await apiClient.saveVideo(playlistId, videoId);
      setPlaylists((prev) => prev.map((pl) => pl._id === playlistId ? {...pl, isChecked: isChecked} : pl ) );
      toast.success(isChecked ? "Video saved successfully" : "Video unsaved successfully");
    } catch (error) {
      const errorMsg = error instanceof Error ? error?.message : "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setOpenSaveModal(false);
    }
  }


  const handleVideoPlay = async () => {
    // if (reel?._id) {
    //   try {
    //     await apiClient.viewVideo(reel._id.toString());
    //     console.log("View incremented");
    //   } catch (error) {
    //     console.error("Error tracking view", error);
    //   }
    // }
  };

  // console.log(reel)


  const handleFollow = async (followingId: string) => {
    setIsFollow(!isfollow);
    try {
      // await apiClient.follow(followingId);
      toast.success(isfollow ? "Followed successfully" : "Unfollow successfully");
    } catch (error) {
      const errorMsg = error instanceof Error ? error?.message : "Something went wrong";
      toast.error(errorMsg);
      setIsFollow(!isfollow);
    }
  }



  return (
    <div className="w-full max-w-sm bg-base-200 rounded-xl overflow-hidden shadow-lg">
    <div className="relative h-[500px] group">
    
    <video
      src={reel.videoUrl}
      className="w-full h-full object-cover"
      width={reel.transformation?.width}
      height={reel.transformation?.height}
      loop
      muted
      playsInline
      controls={true}
      onPlay={handleVideoPlay}
    />

    <div className="absolute right-4 bottom-24 flex flex-col items-center gap-5 z-10">
      <button onClick={handleLike} className="hover:scale-110 transition cursor-pointer">
        <Heart className={`w-6 h-6 ${likes ? 'fill-red-500 text-red-500' : ''}`} />
         {/* <span className="text-xs mt-1 text-center font-semibold">{likes}</span> */}
      </button>
      <button onClick={() => setShowComments(prev => !prev)} className="hover:scale-110 transition cursor-pointer">
        <MessageCircle className="w-6 h-6" />
      </button>
      <button onClick={handleSave} className="hover:scale-110 transition cursor-pointer">
        <SaveAll className="w-6 h-6" />
      </button>
      <button className="hover:scale-110 transition cursor-pointer">
        <Trash className="w-6 h-6" />
      </button>
      <button className="hover:scale-110 transition cursor-pointer">
        <Share2 className="w-6 h-6" />
      </button>
    </div>

    { openSaveModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Save videos in Playlists</h3>
          <button onClick={() => setOpenSaveModal(false)} className=" cursor-pointer p-2 rounded-full text-sm transition-colors"> <X size={16} /> </button>
        </div>

        <div className="space-y-1 flex flex-col gap-1 justify-center">
          {playlists && playlists.map((pl) => (
            <label className="label" key={pl._id}>
              <input onChange={(e) =>  handleCheckboxChange(e.target.checked, pl._id!, reel?._id!.toString())} checked={pl.isChecked} type="checkbox" className="checkbox checkbox-sm checkbox-accent" /> {pl.playlistName} 
            </label>
          )) 
          }
        </div>
        </div>
      </div>
    ) }

    {/* Bottom Left Info */}
    <div className="absolute bottom-15 left-4 flex items-center gap-3 z-10">
      <Image
        src="/default-avatar.png"
        width={20}
        height={5}
        alt="User Avatar"
        className="rounded-full h-[40] w-[40] object-cover border"
      />
      <div className="flex flex-col">
        <h2 className="text-sm font-semibold">{reel.title}</h2>
        <p className="text-xs">{reel.description}</p>
        {/* <p className="text-[10px] text-gray-300">{createdAtFormatted}</p> */}
      </div>
      <button onClick={() => handleFollow(reel.user.toString())} className="ml-3 px-5 py-1 text-sm border rounded-lg cursor-pointer transition">
      {isfollow ? "Following" : "Follow"}
      </button>
    </div>
  </div>

  {/* Comments Slide Panel */}
  {showComments && (
    <div className="p-4">
      <textarea
        value={liveComment}
        onChange={(e) => {
          setLiveComment(e.target.value);
          debounced(e.target.value);
        }}
        className="w-full border p-2 rounded text-sm"
        rows={2}
        placeholder="Add a comment..."
      />
      <button
        onClick={submitComment}
        className="btn btn-neutral w-full mt-2"
        disabled={!newComment.trim()}
      >
        Post
      </button>

      {/* Comments list */}
      {/* <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
        {comments?.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet.</p>
        ) : (
          comments.map((c, idx) => (
            <div key={idx} className="bg-gray-100 p-2 rounded text-sm">
              <p className="font-semibold">User</p>
              <p>{c.comment}</p>
              <span className="text-xs text-gray-500">12-21-220</span>
            </div>
          ))
        )}
      </div> */}
    </div>
  )}
</div>

  );
}
