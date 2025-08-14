"use client";

import { apiClient, PlaylistFormData } from "@/lib/api-client";
import { asyncHandlerFront } from "@/utils/FrontAsyncHandler";
import { Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "./Loader";

interface SavedCollection {
  _id: string;
  videos: Map<string, any>;
}


export default function WatchLaterTab({ collectionModalOpen, setCollectionModalOpen }: {
  collectionModalOpen: boolean;
  setCollectionModalOpen: (open: boolean) => void;
}) {
  const [savedVideo, setSavedVideo] = useState<SavedCollection | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!collectionModalOpen) return; // Only run when modal opens

    const getSavedVideo = async () => {
      setLoading(true);
      await asyncHandlerFront(
        async () => {
          const response = await apiClient.getSavedVideo();
          const collection = response?.data?.[0];
          if (!collection) return;
          const videoMap = new Map<string, any>();
          collection.videos.forEach((video: any) => videoMap.set(video._id, video));
          setSavedVideo({
            _id: collection._id!,
            videos: videoMap,
          });

        },
        (error) => toast.error(error.message)
      );
      setLoading(false);
    };

    getSavedVideo();
  }, [collectionModalOpen]);

  
  const handleDeleteCollection = async (id:string) => {
    // if (savedVideo.length === 0) return;
    await asyncHandlerFront(
      async () => {
        await apiClient.deletePlaylist(id);
        toast.success("Collection deleted successfully");
        setCollectionModalOpen(false);
      },
      (error) => console.log(error.message)
    );
  };


  const handleDeleteVideo = async (collectionId:string, id:string) => {
    await asyncHandlerFront(
      async() => {
        await apiClient.deleteSavedVideo(collectionId, id)
        setSavedVideo(prev => {
          if (!prev) return prev;
          const newMap = new Map(prev?.videos)
          newMap.delete(id);
          toast.success("Video deleted successfully");
          return { ...prev, videos: newMap};
        })
      },
      (error) => console.log(error.message)
    )
  }

  // console.log(savedVideo)

  return (
    <div>
      {collectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start md:items-center overflow-hidden justify-center px-4 pt-10 md:pt-0 bg-black/30">
          <div className="relative w-full max-w-5xl max-h-[80vh] p-6 rounded-3xl shadow-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-y-auto">
            <div className="absolute top-[-10%] left-[10%] h-[20vmax] w-[20vmax] rounded-full bg-gradient-to-br from-fuchsia-300 via-pink-300 to-purple-300 opacity-30 blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[5%] h-[18vmax] w-[18vmax] rounded-full bg-gradient-to-br from-indigo-300 via-sky-300 to-blue-300 opacity-30 blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute top-[50%] left-[40%] h-[14vmax] w-[14vmax] rounded-full bg-gradient-to-br from-violet-200 to-pink-200 opacity-40 blur-2xl animate-pulse pointer-events-none" />

            <button
              className="absolute top-2 right-4 p-1.5 rounded-full bg-white shadow hover:bg-gray-100 transition cursor-pointer"
              onClick={() => setCollectionModalOpen(false)}>
              <X size={20} className="text-gray-800" />
            </button>

            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Watch Later
                </h2>
              </div>

              {savedVideo?.videos.size! > 0 && (
                <button
                  onClick={() => handleDeleteCollection(savedVideo?._id!)}
                  className="flex items-center gap-2 px-5 py-2 mt-5 rounded-full text-sm bg-red-100 text-red-600 hover:bg-red-200 transition cursor-pointer">
                  <Trash2 size={18} />
                  Delete Collection
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader />
              </div>
            ) : savedVideo?.videos.size! > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[60vh] overflow-y-auto pb-5">
                {Array.from(savedVideo?.videos.values()!).map((video: any) => (
                  <div
                    key={video._id}
                    className="relative bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-lg transition flex flex-col">

                    <video
                      src={video.videoUrl}
                      className="w-full h-44 object-cover rounded-xl"
                      controls
                    />
                    <button
                      onClick={() => handleDeleteVideo(savedVideo?._id!, video._id)}
                      className="cursor-pointer absolute top-3 right-3 p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition ">
                      <Trash2 size={16} />
                    </button>
                    <div className="mt-3 flex flex-col gap-1">
                      <p className="text-sm font-semibold text-gray-500">{video.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{video.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-6">No videos saved yet.</p>
            )}
          </div>
        </div>
        )}
      </div>
      );
    }
