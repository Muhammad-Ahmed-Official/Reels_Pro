"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X, Heart, Send, MoreHorizontal } from "lucide-react"
import Image from "next/image"
// import { Comment } from "@/models/Comment"
import { useForm } from "react-hook-form"
import { asyncHandlerFront } from "@/utils/FrontAsyncHandler"
import toast from "react-hot-toast"
import { apiClient } from "@/lib/api-client"
import { useParams } from "next/navigation"
import { useUser } from "@/app/context/userContext"

interface Comment {
    _id: string
    user: {
        userName: string
        profilePic: string
    }
    comment: string;
    parentCommentId?: string;
    children?: Comment[];
    createdAt: Date
}

interface CommentModal {
    isOpen: Boolean;
    onClose: () => void;
    reelId: string;
    commentCount?: Comment[];
    position?: {x : number, y: number}
}


type CommentProp = {
    comment: any;
    depth?:number;
    onAddReply: (parentId: string, newReply: Comment) => void;
    onDeleteComment: (commentId: string) => void;
    onUpdateComment: (parentId: string, updReply: Comment) => void;
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


const CommentItem = ({ comment, depth = 0,  onAddReply, onDeleteComment, onUpdateComment }:CommentProp) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState(comment?.comment);
  const { user } = useUser();

  
    // console.log(comment)
  const handleReply = async () => {
    if (!replyText.trim()) return;
    await asyncHandlerFront(
      async () => {
        const newReply:any = await apiClient.replyComment(comment?.videoId, replyText, comment._id);
        onAddReply(comment?._id, newReply?.data);
        toast.success("Reply posted");
        setReplyText("");
        setIsReplying(false);
      },
      (err) => toast.error(err.message)
    );
  };

  const handleEdit = async () => {
    if (!editText.trim()) return;
    await asyncHandlerFront(
      async () => {
        const updReply:any = await apiClient.updateComment(comment?._id, editText);
        onUpdateComment(comment?._id, updReply?.data);
        toast.success("Comment updated");
        setIsEditing(false);
      },
      (err) => toast.error(err.message)
    );
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this comment?")) {
      await asyncHandlerFront(
        async () => {
          await apiClient.deleteComment(comment._id);
          onDeleteComment(comment?._id);
          toast.success("Comment deleted");
        },
        (err) => toast.error(err.message)
      );
    }
  };

  return (
<>
  <div
    className={`flex gap-3 p-2 rounded-xl bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm hover:shadow-md transition-transform hover:-translate-y-0.5 max-w-full
    ${depth > 0 ? "ml-8" : ""}`}
  >
    <Image
      src={comment?.user?.profilePic || ""}
      alt={comment?.user?.userName}
      className={`rounded-full ring-2 ring-pink-300/40 object-cover
        ${depth > 0 ? "w-8 h-8" : "w-10 h-10"}`}
      width={depth > 0 ? 32 : 40}
      height={depth > 0 ? 32 : 40}
    />

    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-x-2 flex-wrap">
        <span className="font-semibold text-sm bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent truncate">
          {comment?.user?.userName || user?.userName}
        </span>
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {getDaysAgo(comment?.createdAt)}
        </span>
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-2 mt-1">
          <input
            className="w-full text-sm px-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer">
              Save
            </button>
            <button
              className="px-2 py-1 text-xs bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
              onClick={() => {
                setIsEditing(false);
                setEditText(comment.comment);
              }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-800 leading-relaxed break-words mt-1">
          {comment?.comment}
        </p>
      )}

      {!isEditing && !isReplying && (
        <div className="flex gap-3 mt-1 text-xs font-medium">
          <button onClick={() => setIsReplying(!isReplying)} className="text-pink-500 hover:text-pink-600 cursor-pointer">
            Reply
          </button>
          <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-600 cursor-pointer">
            Edit
          </button>
          <button onClick={handleDelete} className="text-red-500 hover:text-red-600 cursor-pointer">
            Delete
          </button>
        </div>
      )}

      {isReplying && (
        <div className="mt-2 flex flex-col gap-2">
          <input
            className="w-full text-sm px-3 py-2 rounded-lg border border-gray-300 focus:outline-none"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleReply}
              className="px-3 py-1.5 text-xs font-medium text-white bg-pink-500 rounded hover:bg-pink-600 cursor-pointer">
              Post
            </button>
            <button
              onClick={() => setIsReplying(false)}
              className="px-2 py-1 text-xs bg-gray-300 rounded hover:bg-gray-400 cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Replies - separate boxes */}
  {comment?.children?.map((reply: any) => (
    <CommentItem key={reply._id} comment={reply} depth={depth + 1} onAddReply={onAddReply} onDeleteComment={onDeleteComment} onUpdateComment={onUpdateComment} />
  ))}
</>
  );
};

type CommentForm = {
  comment: string;
};


export default function CommentModal({ isOpen, onClose, reelId, position } : CommentModal) {
    const modalRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const { user } = useUser() ;
    // console.log(parentId);} = useUser();
    const [comment, setComment] = useState<Comment[]>([]);

    const { register, handleSubmit, reset, formState: {errors, isSubmitting} } = useForm<CommentForm>({
        defaultValues: {
            comment: "",
        }
    })

    const onAddReply = (parentId: string, reply: any) => {
        const addReplyRecursively = (comments: Comment[]): Comment[] =>
            comments.map(c =>
            c._id === parentId
                ? { ...c, children: [...(c.children || []), reply] }
                : { ...c, children: addReplyRecursively(c.children || []) }
            );

        setComment(prev => addReplyRecursively(prev));
    };


    const onUpdateComment = (parentId:string, updateData:any) => {
        const updReplyRecursively = (comments: Comment[]):Comment[] => 
            comments?.map(c => 
                c._id === parentId
                    ? { ...c, ...updateData }
                    : { ...c, children: updReplyRecursively(c.children || [])}
            )
        setComment(prev => updReplyRecursively(prev))
    }

    const onDeleteComment = (commentId: string) => {
        const deleteRecursively = (comments: Comment[]): Comment[] =>
            comments
            .filter(c => c._id !== commentId)
            .map(c => ({ ...c, children: deleteRecursively(c.children || []) }));

        setComment(prev => deleteRecursively(prev));
    };


  // console.log("CommentCount:-",commentCount)
  useEffect(() => {
    const getAllComment = async () => {
      await asyncHandlerFront(
        async () => {
          const response = await apiClient.getComment(reelId);
          console.log(response.data);
          setComment(response?.data as any);
        }
      ).catch((error: any) => {
        toast.error(error.message);
      });
    };

    if (isOpen && comment.length === 0) {
      getAllComment();
    }
  }, [isOpen, reelId]); // run only when modal opens or reel changes



    useEffect(() => {
        if (isOpen && inputRef.current) {
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
                const newComment = {
                createdAt: new Date().toISOString(),
                comment: data?.comment,
                user: {
                    userName: user?.userName,
                    profilePic: "https://ik.imagekit.io/vmknmb1na/zuck-avatar_ghZTGFn2t.png"
                }
                };
                setComment(prev => [...prev, newComment] as any);
            }, 
            (error) => {
                toast.error(error.message)
            }
        )
    }
    if (!isOpen) return null

    return (
        <>
        <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose} />

          {/* Mobile Modal - Themed Bottom Sheet */}
            <div
            className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden transform transition-transform duration-300 ${
                isOpen ? "translate-y-0" : "translate-y-full"
            }`}
            >
            <div className="relative rounded-t-2xl shadow-2xl h-[70vh] flex flex-col border-t border-white/20 backdrop-blur-xl bg-white/70">
                
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 -z-10 rounded-t-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 " />
                <div className="pointer-events-none absolute inset-0 mix-blend-multiply">
                    <div className="absolute top-[-15%] left-[10%] h-[20vmax] w-[20vmax] rounded-full bg-gradient-to-br from-fuchsia-300 via-pink-300 to-purple-300 opacity-30 blur-3xl animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[5%] h-[18vmax] w-[18vmax] rounded-full bg-gradient-to-br from-indigo-300 via-sky-300 to-blue-300 opacity-30 blur-3xl animate-pulse" />
                </div>
                <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(transparent_0,transparent_70%,rgba(0,0,0,0.25)_70%)] [background-size:3px_3px]" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/20">
                {/* <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Comments ({comment?.length || 0})
                </h3> */}
                <button
                    onClick={onClose}
                    className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-white/30 transition cursor-pointer">
                    <X className="w-5 h-5" />
                </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3" key={reelId}>
                {comment?.length > 0 ? (
                    comment?.map((comment) => (
                    <CommentItem key={comment?._id} comment={comment} onAddReply={onAddReply} onDeleteComment={onDeleteComment} onUpdateComment={onUpdateComment} />
                    ))
                ) : (
                    <p className="text-sm text-gray-500 text-center mt-8">No comments yet. Be the first!</p>
                )}
                </div>

                {/* Comment Input */}
                <div className="p-4 border-t border-white/20 bg-white/40 backdrop-blur-md rounded-b-2xl">
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
                        type="text"
                        placeholder="Add a comment..."
                        disabled={isSubmitting}
                        {...register("comment")}
                        className="w-full px-4 py-2 bg-white/60 rounded-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    {errors.comment && (
                        <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-pink-500 hover:text-pink-600 transition disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer">
                        {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                        <Send className="w-4 h-4" />
                        )}
                    </button>
                    </div>
                </form>
                </div>
            </div>
            </div>

            {/* Desktop Modal - Themed */}
            <div
            ref={modalRef}
            className={`hidden lg:block fixed z-50 w-96 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl transform transition-all duration-300 ${
                isOpen
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0 pointer-events-none"
            }`}
            style={{
                left: position
                ? Math.max(16, Math.min(position.x + 70, window.innerWidth - 336))
                : "50%",
                top: position
                ? Math.max(16, Math.min(position.y - 120, window.innerHeight - 416))
                : "50%",
                transform: !position ? "translate(-50%, -50%)" : undefined,
            }} >
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
                <div className="pointer-events-none absolute inset-0 mix-blend-multiply">
                    <div className="absolute top-[-15%] left-[10%] h-[20vmax] w-[20vmax] rounded-full bg-gradient-to-br from-fuchsia-300 via-pink-300 to-purple-300 opacity-30 blur-3xl animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[5%] h-[18vmax] w-[18vmax] rounded-full bg-gradient-to-br from-indigo-300 via-sky-300 to-blue-300 opacity-30 blur-3xl animate-pulse" /></div>
                    <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(transparent_0,transparent_70%,rgba(0,0,0,0.25)_70%)] [background-size:3px_3px]" /></div>

            <div className="flex items-center justify-end px-4 pt-1">
                <button onClick={onClose} className="cursor-pointer p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-white/30 transition-colors"> <X className="w-5 h-5" />
                </button>
            </div>

            <div className="h-80 overflow-y-auto px-4 py-2 space-y-3">
                { comment?.length > 0 ? 
                    ( comment.map((comment) => ( <CommentItem key={comment?._id} comment={comment} onAddReply={onAddReply} onDeleteComment={onDeleteComment} onUpdateComment={onUpdateComment}  />))) : 
                    ( <p className="text-sm text-gray-500 text-center mt-8"> No comments yet. Be the first!</p>)
                }
            </div>
                <div className="p-4 border-t border-white/20 bg-white/40 backdrop-blur-md">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center space-x-3">
                        <div className="flex-1 relative">
                            <input type="text" placeholder="Add a comment..." disabled={isSubmitting} {...register("comment")}
                            className="w-full px-4 py-2 bg-white/60 rounded-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400" />
                            {errors.comment && (<p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>)}
                            <button type="submit" disabled={isSubmitting} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-pink-500 hover:text-pink-600 transition disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer">
                                {isSubmitting ? 
                                    (<div className="w-4 h-4 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />) : 
                                    (<Send className="w-4 h-4" />)
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
