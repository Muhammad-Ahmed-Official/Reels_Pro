"use client";

import { apiClient } from "@/lib/api-client";
import { asyncHandlerFront } from "@/utils/FrontAsyncHandler";
import toast from "react-hot-toast";
import Loader from "./Loader";
import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import ReelItem from "@/components/ReelItem";
import type { VideoFormData } from "@/lib/api-client";

const VideosTab = forwardRef((_, ref) => {
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [reel, setReel] = useState<VideoFormData[]>([]);

  const getVideo = async () => {
    setLoading(true);
    await asyncHandlerFront(
      async () => {
        const response = await apiClient.getVideos();
        setReel(response as VideoFormData[]);
      },
      (error) => {
        toast.error(error.message);
      }
    );
    setLoading(false);
  };

  useImperativeHandle(ref, () => ({
    refreshVideos: getVideo,
  }));

  useEffect(() => {
    const handleRefresh = () => {
      getVideo();
    };
    window.addEventListener("refreshVideos", handleRefresh);
    return () => window.removeEventListener("refreshVideos", handleRefresh);
  }, []);

  useEffect(() => {
    getVideo();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setCurrentIndex((prev) => Math.min(prev + 1, reel.length - 1));
      } else if (e.key === "ArrowUp") {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [reel.length]);


  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const itemHeight = container.clientHeight;
    container.scrollTo({
      top: currentIndex * itemHeight,
      behavior: "smooth",
    });
  }, [currentIndex]);

  if (loading) return <Loader />;

  return (
    <div className="px-6">
      <div className="relative w-full h-screen flex justify-center overflow-hidden">
        <div
          ref={containerRef}
          className="md:max-w-md h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none"}}>
          {reel!.map((reel, index) => (
        <div key={reel?._id} className="snap-center h-screen flex items-center justify-center">
          <ReelItem reel={reel} isActive={index === currentIndex} />
        </div>
        ))}
        </div>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
            {reel?.map((_, index) => (
            <div key={index} className={`w-1 h-8 rounded-full transition-colors text-white ${index === currentIndex ? "bg-gray-200" : "bg-black/70"}`}/>))}
        </div>
      </div>
    </div>
  )
});

VideosTab.displayName = "VideosTab";

export default VideosTab