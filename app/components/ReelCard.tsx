import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Trash } from 'lucide-react';
import { IVideo } from '@/models/Video';

type Prop = {
  reel: IVideo;
};

export default function ReelCard({ reel }: Prop) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    // setLiked(!liked);
    // setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const createdAtFormatted = reel?.createdAt
    ? new Date(reel.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Unknown time';

  return (
    <div className="w-full max-w-sm bg-base-200 rounded-xl overflow-hidden shadow-lg">
      {/* Video */}
      <div className="relative h-[420px] bg-black group">
        <video
          src={reel.videoUrl}
          className="w-full h-full object-cover"
          width={reel.transformation?.width}
          height={reel.transformation?.height}
          controls
          muted
          loop
          playsInline
        />

        {/* Action Buttons */}
        <div className="absolute right-4 bottom-20 flex-col items-center gap-5 text-white hidden group-hover:flex transition-all duration-300 pointer-events-none">
          <button
            onClick={handleLike}
            className="hover:scale-110 transform transition pointer-events-auto"
          >
            <Heart className={`w-6 h-6 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
            <span className="text-xs mt-1 text-center font-semibold">{likes}K</span>
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

      {/* Below the video */}
      <div className="p-4 space-y-1">
        <h2 className="card-title">{reel.title}</h2>
        <p>{reel.description}</p>
        <p className="text-sm font-semibold relative left-70"> {createdAtFormatted}</p>
      </div>
    </div>
  );
}
