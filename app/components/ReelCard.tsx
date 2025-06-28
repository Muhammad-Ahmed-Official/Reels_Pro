import React, { useState } from 'react'
import { Delete, DeleteIcon, Heart, MessageCircle, Share2, Trash } from 'lucide-react';

export default function ReelCard() {
    const [likes, setLikes] = useState(0);
    const handleLike = () => {
        // setLiked(!liked);
        // setLikes(prev => liked ? prev - 1 : prev + 1);
    };
    let liked;

  return (
    <div className="relative w-full max-w-sm h-[420px] bg-black rounded-xl overflow-hidden shadow-lg group">
  <video
    src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    className="w-full h-full object-cover"
    autoPlay
    loop
    muted
    playsInline
    controls
  />

  <div className="absolute top-0 w-full px-4 py-4 pointer-events-none">
    <div className="flex flex-col">
      <span className="text-white text-sm font-semibold">@ahmed_reels</span>
        <span className="text-white text-sm font-semibold">My First Reel!</span>
    </div>
  </div>

  <div className="absolute right-4 bottom-20 flex-col items-center gap-5 text-white hidden group-hover:flex transition-all duration-300 pointer-events-none">
    <button
      onClick={handleLike}
      className="hover:scale-110 transform transition pointer-events-auto">
      <Heart className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
      <span className="text-xs mt-1 text-center font-semibold">10K</span>
    </button>
    <button className="hover:scale-110 transform transition pointer-events-auto">
      <MessageCircle className="w-5 h-5" />
      <span className="text-xs mt-1 text-center font-semibold">2.5K</span>
    </button>
    <button className="hover:scale-110 transform transition pointer-events-auto">
      <Trash className="w-5 h-5" />
      <span className="text-xs mt-1 text-center font-semibold">3.2K</span>
    </button>
    <button className="hover:scale-110 transform transition pointer-events-auto">
      <Share2 className="w-5 h-5" />
      <span className="text-xs mt-1 text-center font-semibold">2.9K</span>
    </button>
  </div>
</div>

  )
}
