"use client"

import { apiClient, type PlaylistFormData, type VideoFormData } from "@/lib/api-client"
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Play, VolumeX, Volume2, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import CommentModal from "./CommentModal"
import Image from "next/image"
import toast from "react-hot-toast"
import { asyncHandlerFront } from "@/utils/FrontAsyncHandler"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}


const ReelItem = ({ reel, isActive }: { reel: VideoFormData; isActive: boolean }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isLiked, setIsLiked] = useState(reel.isLikedVideo)
  const [isBookmarked, setIsBookmarked] = useState(reel.isSaved);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [commentButtonPosition, setCommentButtonPosition] = useState<{ x: number; y: number } | undefined>()
  const [isFollowing, setIsFollowing] = useState(reel?.isFollow);
  const { id } = useParams();
  // const [openSaveModal, setOpenSaveModal] = useState(false);
  // const [playlistName, setPlaylistName] = useState<PlaylistFormData[]>([]);
  // const { data: session } = useSession();
  // const [likes, setLikes] = useState(reel.likes)
  // console.log(session?.user?._id)
  // console.log(reel) 

  const videoRef = useRef<HTMLVideoElement>(null)
  const commentButtonRef = useRef<HTMLButtonElement>(null)


  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    } else if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [isActive])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleLike = async() => {
    setIsLiked(!isLiked)
    await asyncHandlerFront(
        async() => {
            await apiClient.likeUnlikeVideo(reel?._id);
            toast.success(isLiked ? "Video liked successfully" : "Video unliked successfully" )
        }, 
        (error) => {
          toast.error(error.message)
        }
    )
  }


  const toggleBookmark = async() => {
    setIsBookmarked(!isBookmarked)
    await asyncHandlerFront(
      async() => {
        await apiClient.saveVideo(id?.toString()!);
        toast.success(!isBookmarked ? "Video saved successfully" : "Video unsaved successfully");
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
            toast.success(!isFollowing ? "Follow successfully" : "Unfollow successfully");
        }, 
        (error) => {
            toast.error(error.message)
        }
    )
  }


  const handleCheckboxChange = async(isChecked: boolean, playlistId: string, videoId: string) => {
  }
   
   
   // setLikes(isLiked ? likes - 1 : likes + 1)
   //   const toggleBookmark = () => {
   //     setIsBookmarked(!isBookmarked)
   //   }
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
      <div className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
        {/* Video */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
        //   poster={reel.thumbnail}
        >
          <source src={reel.videoUrl} type="video/mp4" />
        </video>

        {/* Play/Pause Overlay */}
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={togglePlay}>
          {!isPlaying && (
            <div className="bg-black/50 rounded-full p-4">
              <Play className="w-12 h-12 text-white fill-white" />
            </div>
          )}
        </div>

        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <div className="text-white font-semibold text-lg">Reels</div>
          <button onClick={toggleMute} className="bg-black/50 rounded-full p-2">
            {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
          </button>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="flex items-end justify-between">
            {/* Left Content */}
            <div className="flex-1 mr-4">
              {/* User Info */}
              <div className="flex items-center mb-3">
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
                <button onClick={handleFollow} className="ml-4 px-3 py-1 cursor-pointer border border-white rounded-full text-white text-xs font-semibold">
                  {isFollowing ? "Following" : "Follow" }
                </button>
              </div>

              {/* Description */}
              <p className="text-white text-sm sm:text-base leading-relaxed mb-2">{reel.description}</p>
            </div>

            {/* Right Actions */}
            <div className="flex flex-col items-center space-y-4 sm:space-y-6">
              {/* Like */}
              <button onClick={toggleLike} className="flex flex-col items-center cursor-pointer">
                <div className="bg-black/50 rounded-full p-2 sm:p-3">
                  <Heart className={`w-6 h-6 sm:w-7 sm:h-7 ${isLiked ? "text-red-500 fill-red-500" : "text-white"}`} />
                </div>
                <span className="text-white text-xs sm:text-sm font-medium mt-1">{formatNumber(reel.likesCount)}</span>
              </button>

              {/* Comment */}
              <button ref={commentButtonRef} onClick={handleCommentClick} className="flex flex-col items-center cursor-pointer">
                <div className="bg-black/50 rounded-full p-2 sm:p-3">
                  <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                {/* <span className="text-white text-xs sm:text-sm font-medium mt-1">{formatNumber(reel.comments)}</span> */}
              </button>

              {/* Share */}
              <button className="flex flex-col items-center">
                <div className="bg-black/50 rounded-full p-2 sm:p-3">
                  <Share className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                {/* <span className="text-white text-xs sm:text-sm font-medium mt-1">{formatNumber(reel.shares)}</span> */}
              </button>

              {/* Bookmark */}
              <button onClick={toggleBookmark} className="flex flex-col items-center cursor-pointer">
                <div className="bg-black/50 rounded-full p-2 sm:p-3">
                  <Bookmark
                    className={`w-6 h-6 sm:w-7 sm:h-7 ${isBookmarked ? "text-yellow-500 fill-yellow-500" : "text-white"}`}
                  />
                </div>
              </button>

              {/* { openSaveModal && (
                  <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 p-4">
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Save videos in Playlists</h3>
                      <button onClick={() => setOpenSaveModal(false)} className=" cursor-pointer p-2 rounded-full text-sm transition-colors"> <X size={16} /> </button>
                    </div>

                    <div className="space-y-1 flex flex-col gap-1 justify-center">
                      {playlistName && playlistName.map((pl) => (
                        <label className="label" key={pl._id}>
                          <input
                            type="checkbox" checked={pl.isChecked} 
                            className="checkbox bg-primary-400 checkbox-sm"
                            onChange={(e) =>  handleCheckboxChange(e.target.checked, pl._id!, reel?._id!.toString())} 
                            /> {pl.playlistName} 
                        </label>
                      )) 
                      }
                    </div>
                    </div>
                  </div>
                ) } */}

              {/* More */}
              <button className="flex flex-col items-center">
                <div className="bg-black/50 rounded-full p-2 sm:p-3">
                  <MoreHorizontal className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div className="h-full bg-white w-0 animate-pulse"></div>
        </div>
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={closeCommentModal}
        reelId={reel._id}
        commentCount={reel?.commentWithUser}
        position={commentButtonPosition}
      />
    </>
  )
}

export default ReelItem