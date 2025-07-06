// 'use client'

// import React, { useState } from 'react';
// import { Heart, MessageCircle, SaveAll, Share2, Trash } from 'lucide-react';
// import { IVideo } from '@/models/Video';
// import { apiClient } from '@/lib/api-client';
// import { useDebounceCallback } from 'usehooks-ts';
// import Image from 'next/image';

// type Prop = {
//   reel: IVideo;
// };

// export default function ReelCard({ reel }: Prop) {
//   console.log(reel)

//   function getTimeAgo(date: Date): string {
//   const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
//   const intervals: [number, string][] = [
//     [60, 'second'],
//     [60, 'minute'],
//     [24, 'hour'],
//     [30, 'day'],
//     [12, 'month'],
//     [Number.POSITIVE_INFINITY, 'year'],
//   ];
  
//   let i = 0;
//   let time = seconds;
  
//   while (time >= intervals[i][0] && i < intervals.length - 1) {
//     time /= intervals[i][0];
//     i++;
//   }
  
//   time = Math.floor(time);
//   const unit = intervals[i][1];
//   return `${time} ${unit}${time !== 1 ? 's' : ''} ago`;
//   }
  
  
//   const createdAtFormatted = reel?.createdAt
//   ? getTimeAgo(new Date(reel.createdAt))
//   : 'Uploaded just now';

 
//   const [likes, setLikes] = useState(0);
//   const [showComments, setShowComments] = useState(false);
//   const [newComment, setNewComment] = useState('');
//   const [comments, setComments] = useState([]);
//   const [liveComment, setLiveComment] = useState("");
//   const debounced = useDebounceCallback(setNewComment, 3000);

//   const handleLike = async() => {
//     if (!reel?._id) return;
//     await apiClient.likeUnlikeVideo(reel._id.toString());
//     setLikes(prev => (prev != 1 ? prev + 1 : prev - 1));
//   };

//   const submitComment = async () => {
//     if (!reel?._id || !newComment) return;
//     await apiClient.createComment(reel?._id.toString(), newComment);
//     setNewComment('')
//   }


//   return (
//     <div className="w-full max-w-sm bg-base-200 rounded-xl overflow-hidden shadow-lg">
//     <div className="relative h-[500px] group">
    
//     <video
//       src={reel.videoUrl}
//       className="w-full h-full object-cover"
//       width={reel.transformation?.width}
//       height={reel.transformation?.height}
//       loop
//       muted
//       playsInline
//       controls={true}
//     />

//     <div className="absolute right-4 bottom-24 flex flex-col items-center gap-5 text-white z-10">
//       <button onClick={handleLike} className="hover:scale-110 transition cursor-pointer">
//         <Heart className={`w-6 h-6 ${likes ? 'fill-red-500 text-red-500' : ''}`} />
//       </button>
//       <button onClick={() => setShowComments(prev => !prev)} className="hover:scale-110 transition cursor-pointer">
//         <MessageCircle className="w-6 h-6" />
//       </button>
//       <button className="hover:scale-110 transition cursor-pointer">
//         <SaveAll className="w-6 h-6" />
//       </button>
//       <button className="hover:scale-110 transition cursor-pointer">
//         <Trash className="w-6 h-6" />
//       </button>
//       <button className="hover:scale-110 transition cursor-pointer">
//         <Share2 className="w-6 h-6" />
//       </button>
//     </div>

//     {/* Bottom Left Info */}
//     <div className="absolute bottom-15 left-4 flex items-center gap-3 text-white z-10">
//       <Image
//         src="/default-avatar.png" // ✅ Use a fallback image
//         width={20}
//         height={5}
//         alt="User Avatar"
//         className="rounded-full h-[40] w-[40] object-cover border border-white"
//       />
//       <div className="flex flex-col">
//         <h2 className="text-sm font-semibold">{reel.title}</h2>
//         <p className="text-xs">{reel.description}</p>
//         {/* <p className="text-[10px] text-gray-300">{createdAtFormatted}</p> */}
//       </div>
//       <button className="ml-3 px-3 py-1 text-sm border border-white rounded-lg cursor-pointer hover:bg-white hover:text-black transition">
//         Follow
//       </button>
//     </div>
//   </div>

//   {/* Comments Slide Panel */}
//   {showComments && (
//     <div className="p-4">
//       <textarea
//         value={liveComment}
//         onChange={(e) => {
//           setLiveComment(e.target.value);
//           debounced(e.target.value);
//         }}
//         className="w-full border p-2 rounded text-sm"
//         rows={2}
//         placeholder="Add a comment..."
//       />
//       <button
//         onClick={submitComment}
//         className="btn btn-neutral w-full mt-2"
//         disabled={!newComment.trim()}
//       >
//         Post
//       </button>

//       {/* Comments list */}
//       {/* <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
//         {comments?.length === 0 ? (
//           <p className="text-sm text-gray-500">No comments yet.</p>
//         ) : (
//           comments.map((c, idx) => (
//             <div key={idx} className="bg-gray-100 p-2 rounded text-sm">
//               <p className="font-semibold">User</p>
//               <p>{c.comment}</p>
//               <span className="text-xs text-gray-500">12-21-220</span>
//             </div>
//           ))
//         )}
//       </div> */}
//     </div>
//   )}
// </div>

//   );
// }
