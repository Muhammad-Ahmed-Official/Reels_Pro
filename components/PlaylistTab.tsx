"use client";
import { apiClient } from "@/lib/api-client";
import { asyncHandlerFront } from "@/utils/FrontAsyncHandler";
import { X } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const savedItems = [
  {
    id: 1,
    type: "YouTube",
    title: "Chill Lofi Beats",
    author: "Lofi Girl",
    image: "https://i.ytimg.com/vi/jfKfPfyJRdk/maxresdefault.jpg",
    added: "1 day ago",
  },
  {
    id: 2,
    type: "Instagram",
    title: "Sunset Photography",
    author: "@visualsbyemily",
    image:
      "https://images.unsplash.com/photo-1501973801540-537f08ccae7e?fit=crop&w=600&q=80",
    added: "2 days ago",
  },
  {
    id: 3,
    type: "Facebook",
    title: "Food Blog: Keto Recipes",
    author: "Healthy Eats",
    image:
      "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?fit=crop&w=600&q=80",
    added: "5 days ago",
  },
];





export default function PlaylistTab() {
    const [playlistName, setPlaylistName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    
    const handleCreatePlaylist = async() => {
        await asyncHandlerFront(
            async() => {
                await apiClient.createPlaylist(playlistName);
                setIsModalOpen(false);
                toast.success("playlist created successfully");
            }, 
            (error) => {
                toast.error(error.message);
                setIsModalOpen(false);
            }
        )
    }

  return (
    <div className="px-6 md:px-12 py-5 mx-6 md:mx-16 pt-16 space-y-8 text-[#171717] bg-transparent dark:text-white">
      {/* Top Bar: Title + Create Playlist */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-primary-700 dark:text-primary-100">
          Your Saved Collection
        </h2>
        <button onClick={() => setIsModalOpen(!isModalOpen)} className="btn border border-primary-500 cursor-pointer text-primary-500 dark:border-primary-300 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900 transition px-4 py-2 rounded-lg text-sm font-medium">
          + Create Collection
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white dark:bg-[#1c1c1c] p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto border border-[--color-primary-100] dark:border-[--color-primary-500]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-primary-700 dark:text-primary-100">
                Save videos in Playlists
                </h3>
                <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer p-2 rounded-full hover:bg-primary-100 dark:hover:bg-primary-800 transition">
                <X size={16} className="text-primary-700 dark:text-primary-100" />
                </button>
            </div>

            <div className="space-y-1 flex flex-col gap-1 justify-center">
                <label className="block text-sm font-medium text-primary-700 dark:text-primary-200 mb-2"> Playlist Name </label>
                <input
                type="text"
                onChange={(e) => setPlaylistName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[--color-primary-500] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
                />
                <button onClick={handleCreatePlaylist} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base font-medium cursor-pointer">Submit</button>
            </div>
            </div>
        </div>
        )}

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-10">
        <div className="h-44 w-44 flex-none overflow-hidden rounded-xl shadow-xl">
          <img
            src="https://res.cloudinary.com/subframe/image/upload/v1723780559/uploads/302/tkyvdicnwbc5ftuyysc0.png"
            className="w-full h-full object-cover"
            alt="Playlist Cover"
          />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-3">
          <div className="space-y-1">
            <span className="text-sm font-semibold text-primary-500 dark:text-primary-300 uppercase tracking-wide">
              Collection
            </span>
            <h1 className="text-4xl font-bold text-primary-700 dark:text-primary-100">
              Chill Vibes & Social Saves
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              Handpicked content from music & social platforms
            </p>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="avatar">
                <div className="w-6 rounded-full">
                  <img
                    src="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/fychrij7dzl8wgq2zjq9.avif"
                    alt="Emily"
                  />
                </div>
              </div>
              <span className="font-medium text-primary-600 dark:text-primary-300">
                Emily
              </span>
            </div>
            <span>•</span>
            <span>{savedItems.length} items</span>
            <span>•</span>
            <span>Last updated 3 days ago</span>
          </div>
        </div>
      </div>

      {/* Saved Items Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedItems.map((item) => (
          <div
            key={item.id}
            className="rounded-xl overflow-hidden shadow-md bg-white dark:bg-[#1c1c1c] hover:shadow-lg transition"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 text-xs font-semibold bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-100 rounded">
                  {item.type}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {item.added}
                </span>
              </div>
              <h3 className="text-lg font-bold text-primary-700 dark:text-primary-100">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.author}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
