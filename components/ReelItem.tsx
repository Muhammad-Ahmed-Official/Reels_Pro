"use client"

import { apiClient, type PlaylistFormData, type VideoFormData } from "@/lib/api-client"
import { Heart, MessageCircle, Bookmark, Play, VolumeX, Volume2, X, Share2, Eye } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import CommentModal from "./CommentModal"
import Image from "next/image"
import toast from "react-hot-toast"
import { asyncHandlerFront } from "@/utils/FrontAsyncHandler"
import { useSession } from "next-auth/react"
import {  useRouter } from "next/navigation"
import { useSocket } from "@/app/context/SocketContext"
import { useUser } from "@/app/context/userContext"

const formatNumber = (num: number): any => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num;
}


function getDaysAgo(input?: string | Date) {
  try {
    if (!input) return "now"
    const then = new Date(input).getTime()
    const diff = Date.now() - then
    const sec = Math.max(1, Math.floor(diff / 1000))
    if (sec < 60) return `${sec}s ago`
    const min = Math.floor(sec / 60)
    if (min < 60) return `${min}m ago`
    const hrs = Math.floor(min / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    return `${days}d ago`
  } catch {
    return "now"
  }
}


const ReelItem = ({ reel, isActive }: { reel: VideoFormData; isActive: boolean }) => {
  const [isMuted, setIsMuted] = useState(true)
  const [isLiked, setIsLiked] = useState(reel.isLiked)
  const [isBookmarked, setIsBookmarked] = useState(reel?.savedVideo);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [commentButtonPosition, setCommentButtonPosition] = useState<{ x: number; y: number } | undefined>()
  const [isFollowing, setIsFollowing] = useState(reel?.isFollow);
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false);
  const [viewed, setViewed] = useState(false);
  const commentButtonRef = useRef<HTMLButtonElement>(null)
  const [watch, setWatch] = useState(reel?.views);
  const { data: session } = useSession();
  const { user } = useUser();
  const router = useRouter();

  // Auto play/pause when reel is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              await videoRef.current.play();
              setIsPlaying(true);

              if (!viewed && reel?.owner?._id !== user?._id) {
                try {
                  await apiClient.viewVideo(reel?._id);
                  setViewed(true);
                  setWatch(watch + 1);
                } catch (error: any) {
                  toast.error(error?.message || "Error counting view");
                }
              }
            } else {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [reel?._id, viewed]);


  const togglePlay = async() => {
    if (!videoRef.current) return;
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const sendNotification = async(typeNotification:string, message:string) => {
     const payload = {
      receiver: reel.owner._id,
      reelId: reel?._id,
      message,
      typeNotification,
      createdAt: new Date(),
    };
    await fetch('http://localhost:3000/api/sendNotification', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }

  const toggleLike = async() => {
    setIsLiked(!isLiked)
    await asyncHandlerFront(
        async() => {
            await apiClient.likeUnlikeVideo(reel?._id);
            // sendNotification("like", isLiked ? "liked your reel" : "Unliked your reel");
        }, 
        (error) => {
          toast.error(error.message || "Something went wrong");
        }
    )
  }


  const toggleBookmark = async(id:string) => {
    setIsBookmarked(!isBookmarked)
    await asyncHandlerFront(
      async() => {
        await apiClient.saveVideo(id);
      }, 
      (error) => {
        toast.error(error.message)
      }
    )
  }


  const handleFollow = async () => {
    setIsFollowing(!isFollowing);
    await asyncHandlerFront(
        async() => {
            await apiClient.follow(reel.owner._id as string);
            // sendNotification("follow", !isFollowing ? "Follow's you" : "Unfollow you")
        }, 
        (error) => {
          toast.error(error.message)
        }
    )
  }



  const handleSelect = async(id:string, video:string) => {
    const payload = {
      customId: crypto.randomUUID(),
      sender: user?._id,
      receiver: id,
      video, 
    }
    
    if(!user?._id || !id || !video) {
      toast.error("Missing fields!");
      return;
    } 

    if(user?._id === id) {
      toast.error("Can't share your self");
      return
    };
      // socket?.emit("reel", payload);
    await asyncHandlerFront(
      async() => {
        await apiClient.shareVideo(payload as any);
      },
      (err) => toast.error("Error share video")
    )

    setShowModal(false);
    toast.success("Reel shared");
  }


  const handleCommentClick = () => {
    if (commentButtonRef.current) {
      const rect = commentButtonRef.current.getBoundingClientRect()
      setCommentButtonPosition({
        x: rect.left,
        y: rect.top - 50,
      })
    }
    setIsCommentModalOpen(true)
    setIsCommentModalOpen(!isCommentModalOpen)
  }

  const closeCommentModal = () => {
    setIsCommentModalOpen(false)
  }

  return (
    <>
      <div className="relative w-full h-[710px] flex items-center justify-center overflow-hidden rounded-xl">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline>
          <source src={reel.videoUrl} type="video/mp4" />
        </video>

        <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={togglePlay}>
          {!isPlaying && (
            <div className="bg-black/50 rounded-full p-4">
              <Play className="w-12 h-12 text-white fill-white" />
            </div>
          )}
        </div>

        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <div className="flex flex-col">
            <span className="text-black font-semibold text-lg">{reel?.title}</span>
            <span className="text-black text-[14px] font-semibold opacity-80">
              {getDaysAgo(reel?.createdAt)}
            </span>
          </div>
          <button onClick={toggleMute} className="bg-black/50 rounded-full p-2">
            {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
          </button>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="flex items-end justify-between">
            <div className="flex-1 mr-4">
              <div className="flex items-center">
                <button onClick={() => router.push('?tab=profile')} className="flex items-center mb-1 cursor-pointer">
                  <Image
                    src={reel.owner.profilePic || "/placeholder.svg"}
                    alt={reel.owner.userName}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-3"
                    width={40}
                    height={40}
                  />
                  <div className="flex items-center">
                    <span className="text-white font-semibold text-sm sm:text-base">@{reel.owner.userName}</span>
                    {reel.owner.isVerified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center ml-1">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  </button>
                  {session?.user?._id !== reel?.owner?._id && <button onClick={handleFollow} className="ml-4 px-3 py-1 cursor-pointer border border-white rounded-full text-white text-xs font-semibold">
                    {isFollowing ? "Following" : "Follow" }
                  </button>
                  }
              </div>
              <p className="text-white text-sm sm:text-base leading-relaxed mb-2">{reel.description}</p>
            </div>

            <div className="flex flex-col items-center space-y-4 sm:space-y-6">
              <button onClick={toggleLike} className="flex flex-col items-center cursor-pointer mb-0">
                <div className="bg-[#a4a0a0ac] rounded-full p-3 font-semibold">
                  <Heart className={`w-6 h-6 ${isLiked ? "text-red-500 fill-red-500" : "text-white"}`} />
                </div>
                <span className="text-white text-xs sm:text-sm font-medium my-2">{formatNumber(reel.likes as number)}</span>
              </button>

              {/* Comment */}
              <button ref={commentButtonRef} onClick={handleCommentClick} className="flex flex-col items-center cursor-pointer">
                <div className="rounded-full p-3 bg-[#a4a0a0ac]">
                  <MessageCircle className="w-7 h-7 text-white font-semibold" />
                </div>
                {/* <span className="text-white text-xs sm:text-sm font-medium mt-1">{formatNumber(reel.comments)}</span> */}
              </button>

              {/* Share */}
              <button  onClick={() => setShowModal(!showModal)} className="flex flex-col items-center">
                <div className="bg-[#a4a0a0ac] rounded-full p-3 font-semibold">
                  <Share2 className="w-7 h-7 text-white cursor-pointer font-semibold" />
                </div>
                {/* <span className="text-white text-xs sm:text-sm font-medium mt-1">{formatNumber(reel.shares)}</span> */}
              </button>

              {/* Bookmark */}
              <button onClick={() => toggleBookmark(reel?._id)} className="flex flex-col items-center cursor-pointer">
                <div className="bg-[#a4a0a0ac] rounded-full p-3 font-semibold">
                  <Bookmark
                    className={`w-6 h-6 sm:w-7 sm:h-7 ${isBookmarked ? "text-yellow-500 fill-yellow-500" : "text-white"}`}
                  />
                </div>
              </button>

              <div className="flex flex-col items-center cursor-pointer">
                <div className="bg-[#a4a0a0ac] rounded-full p-3 font-semibold">
                  <Eye
                    className={`w-6 h-6 sm:w-7 sm:h-7 text-white`}
                  />
                </div>
                <span className="text-white text-xs sm:text-sm font-medium">{formatNumber(watch || 0)}</span>
              </div>

              {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ease-in-out">
                  <div className="bg-white w-full max-w-md mx-auto rounded-2xl p-4 shadow-lg animate-slide-up">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Share To</h2>
                      <button className="cursor-pointer hover:bg-gray-200 p-1 rounded-full" onClick={() => setShowModal(false)}><X size={15} /></button>
                    </div>

                    <div className="space-y-3 max-h-72 overflow-y-auto">
                      {reel?.allUsersExceptLoggedIn?.map((user) => (
                        <div onClick={() => handleSelect(user?._id as any, reel?.videoUrl)} key={user?.profilePic} className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg cursor-pointer">
                          <img src={user.profilePic} alt={user?.userName} className="w-10 h-10 rounded-full object-cover" />
                          <span className="font-medium">{user?.userName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div className="h-full bg-white w-0 animate-pulse"></div>
        </div>
      </div>

      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={closeCommentModal}
        reelId={reel._id}
        position={commentButtonPosition}
      />
    </>
  )
}
export default ReelItem