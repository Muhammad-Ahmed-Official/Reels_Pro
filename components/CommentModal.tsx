"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X, Heart, Send, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import { Comment } from "@/models/Comment"
import { useForm } from "react-hook-form"
import { asyncHandlerFront } from "@/utils/FrontAsyncHandler"
import toast from "react-hot-toast"
import { apiClient } from "@/lib/api-client"
import { useParams } from "next/navigation"

// interface Comment {
//     id: string
//     user: {
//         username: string
//         avatar: string
//         isVerified: boolean
//     }
//     text: string
//     likes: number
//     isLiked: boolean
//     timestamp: string
//     replies?: Comment[]
// }

interface CommentModal {
    isOpen: Boolean;
    onClose: () => void;
    reelId: string;
    commentCount: Comment[];
    position?: {x : number, y: number}
}


const formatNumber = (num: number): string => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
}


function getDaysAgo(isoDate: Date): string {
    const createdDate = new Date(isoDate);
    const now = new Date();
    const diffInMs = now.getTime() - createdDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
}


const CommentItem = ({ comment }: { comment: Comment }) => {
    // const [isLiked, setIsLiked] = useState(comment.isLiked)
    // const [likes, setLikes] = useState(comment.likes)
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const { id } = useParams();

    // const toggleLike = () => {
    //     setIsLiked(!isLiked)
    //     setLikes(isLiked ? likes - 1 : likes + 1)
    // }
    // console.log(comment);


    const handleReply = async () => {
        if (!replyText.trim()) return;
        // setIsSubmitting(true);
        await asyncHandlerFront(
        async () => {
            await apiClient.replyComment(id?.toString()!, replyText, comment._id);
            toast.success("Reply posted");
            setReplyText("");
            setIsReplying(false);
        },
        (err) => toast.error(err.message)
        );
        // setIsSubmitting(false);
    };


    return (
        <div className="flex space-x-3 py-3">
            <Image
                src={comment.user.profilePic}   
                alt={comment.user.userName}
                className="w-8 h-8 rounded-full flex-shrink-0"
                width={32}
                height={32}
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{comment?.user.userName}</span>
                    {comment.user.isVerified && (
                        <div className="w-3 h-3 bg-primary-500 rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">{getDaysAgo(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{comment.text}</p>
                <div className="flex items-center space-x-4 mt-2">
                    {/* <button
                        onClick={toggleLike}
                        className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                        <Heart className={`w-3 h-3 ${isLiked ? "text-red-500 fill-red-500" : ""}`} />
                        <span>{formatNumber(likes)}</span>
                    </button> */}
                    <button onClick={() => setIsReplying(!isReplying)} className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                        Reply
                    </button>
                    {isReplying && (
                        <div className="mt-2">
                        <input
                            className="w-full text-sm p-1 px-2 rounded bg-gray-100"
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                        />
                        <button
                            onClick={handleReply}
                            // disabled={isSubmitting}
                            className="text-xs text-blue-500 mt-1"
                        >
                            {/* {isSubmitting ? "Posting..." : "Post Reply"} */}
                        </button>
                        </div>
                    )}
                </div>
            </div>
            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <MoreHorizontal className="w-4 h-4" />
            </button>
        </div>
    )
}

type CommentForm = {
  comment: string;
};


export default function CommentModal({ isOpen, onClose, reelId, commentCount, position } : CommentModal) {
    const modalRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const { register, handleSubmit, reset, formState: {errors, isSubmitting} } = useForm<CommentForm>({
        defaultValues: {
            comment: "",
        }
    })


    useEffect(() => {
        if (isOpen && inputRef.current) {
            // Focus input after modal animation
            setTimeout(() => {
                inputRef.current?.focus()
            }, 300)
        }
    }, [isOpen])

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEscape)
            document.body.style.overflow = "hidden"
        }

        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.body.style.overflow = "unset"
        }
    }, [isOpen, onClose])

    const onSubmit = async (data:CommentForm) => {
        await asyncHandlerFront(
            async() => {
                await apiClient.createComment(reelId, data.comment);
                reset();
                toast.success("comment successfully");
            }, 
            (error) => {
                toast.error(error.message)
            }
        )
        // setComments([comment, ...comments])
    }
    // console.log(commentCount);
    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />

            {/* Mobile Modal - Bottom Sheet */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden transform transition-transform duration-300 ${isOpen ? "translate-y-0" : "translate-y-full"
                    }`}
            >
                <div className="bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl h-[70vh] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {/* Comments ({formatNumber(commentCount)}) */}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4" key={reelId}>
                        {commentCount.map((comment) => {
                            return <CommentItem key={comment._id} comment={comment} />;
                        })}
                    </div>


                    {/* Comment Input */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center space-x-3">
                            <Image
                                src="/placeholder.svg"
                                alt="Your avatar"
                                className="w-8 h-8 rounded-full flex-shrink-0"
                                width={32}
                                height={32}
                            />
                            <div className="flex-1 relative">
                                <input
                                    type="text" placeholder="Add a comment..." disabled={isSubmitting}
                                    {...register("comment")}
                                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                                {errors.comment && ( <p className="text-red-500 text-sm">{errors.comment.message}</p>)}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-primary-500 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer">
                                    {isSubmitting ? (
                                        <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Desktop Modal - Positioned next to comment icon */}
            <div
                ref={modalRef}
                className={`hidden lg:block fixed z-50 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-200 ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
                    }`}
                style={{
                    left: position ? Math.max(16, Math.min(position.x + 70, window.innerWidth - 336)) : "50%",
                    top: position ? Math.max(16, Math.min(position.y - 120, window.innerHeight - 416)) : "50%",
                    transform: !position ? "translate(-50%, -50%)" : undefined,
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {/* Comments ({formatNumber(commentCount)}) */}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Comments List */}
                <div className="h-80 overflow-y-auto px-4">
                        {commentCount.map((comment) => (
                            <CommentItem key={comment._id} comment={comment} />
                        ))}
                </div>

                {/* Comment Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center space-x-3">
                        {/* <Image
                            src=""
                            alt="Your avatar"
                            className="w-8 h-8 rounded-full flex-shrink-0"
                            width={32}
                            height={32}
                        /> */}
                        <div className="flex-1 relative">
                            <input
                                type="text" placeholder="Add a comment..." disabled={isSubmitting}
                                {...register("comment")}
                                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            {errors.comment && ( <p className="text-red-500 text-sm">{errors.comment.message}</p>)}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-primary-500 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer">
                                {isSubmitting ? (
                                    <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
