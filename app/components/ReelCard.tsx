import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Trash } from 'lucide-react';
import { IVideo } from '@/models/Video';

type Prop = {
  reel: IVideo;
};

export default function ReelCard({ reel }: Prop) {
  const [likes, setLikes] = useState(0);

  const handleLike = () => {
    setLikes(prev => (prev != 1 ? prev + 1 : prev - 1))
  };

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

  return (
    <div className="w-full max-w-sm bg-base-200 rounded-xl overflow-hidden shadow-lg">
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

        <div className="absolute right-4 bottom-20 flex-col items-center gap-5 text-white hidden group-hover:flex transition-all duration-300 pointer-events-none">
          <button
            onClick={handleLike}
            className="hover:scale-110 cursor-pointer transform transition pointer-events-auto">
            <Heart className={`w-6 h-6 ${likes ? 'fill-red-500 text-red-500' : ''}`} />
            {/* <span className="text-xs mt-1 text-center font-semibold">{likes}</span> */}
          </button>
          <button className="hover:scale-110 cursor-pointer transform transition pointer-events-auto">
            <MessageCircle className="w-5 h-5" />
            {/* <span className="text-xs mt-1 text-center font-semibold">2.5K</span> */}
          </button>
          <button className="hover:scale-110 cursor-pointer transform transition pointer-events-auto">
            <Trash className="w-5 h-5" />
          </button>
          <button className="hover:scale-110 cursor-pointer transform transition pointer-events-auto">
            <Share2 className="w-5 h-5" />
            {/* <span className="text-xs mt-1 text-center font-semibold">2.9K</span> */}
          </button>
        </div>
      </div>

      {/* Below the video */}
      <div className="p-4 space-y-1">
        <h2 className="card-title">{reel.title}</h2>
        <p>{reel.description}</p>
        <p className="text-sm font-semibold relative left-65"> {createdAtFormatted}</p>
      </div>
    </div>
  );
}
