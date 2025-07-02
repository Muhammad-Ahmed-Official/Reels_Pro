import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Trash } from 'lucide-react';
import { IVideo } from '@/models/Video';
import { apiClient } from '@/lib/api-client';
import { useDebounceCallback } from 'usehooks-ts';

type Prop = {
  reel: IVideo;
};

export default function ReelCard({ reel }: Prop) {

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
          <button  onClick={() => setShowComments((prev) => !prev)} className="hover:scale-110 cursor-pointer transform transition pointer-events-auto">
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

      {showComments && (
        <div className="px-4 pb-4">
          <textarea
            value={liveComment}
            onChange={(e) => {
              setLiveComment(e.target.value)
              debounced(e.target.value)
            }}
            className="w-full border p-2 rounded text-sm"
            rows={2}
            placeholder="Add a comment..."
          />
          <button
            onClick={submitComment}
            className="btn btn-neutral w-[100px] mt-3 cursor-pointer"
            disabled={!newComment.trim()}
          >
            Post
          </button>

          {/* Comments list */}
          <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
            {comments?.length === 0 ? (
              <p className="text-sm text-gray-500">No comments yet.</p>
            ) : (
              comments.map((c) => (
                <div className="bg-gray-100 p-2 rounded text-sm">
                  <p className="font-semibold">{'User'}</p>
                  <p>Good</p>
                  <span className="text-xs text-gray-500">12-21-220</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}


    </div>
  );
}
