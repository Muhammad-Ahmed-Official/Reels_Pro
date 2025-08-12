
// "use client"

// // import { useParams } from "next/navigation";
// import { useState, useRef, useEffect } from "react"
// import ReelItem from "@/components/ReelItem";
// import { apiClient } from "@/lib/api-client";
// import type { VideoFormData } from "@/lib/api-client"

// export default function Home() {
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [reel, setReel] = useState<VideoFormData[]>([]);
  
  
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "ArrowDown") {
//         setCurrentIndex((prev) => Math.min(prev + 1, reel!.length - 1));
//       } else if (e.key === "ArrowUp") {
//         setCurrentIndex((prev) => Math.max(prev - 1, 0));
//       }
//     };
    
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, []);
  
//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;
//     const itemHeight = container.clientHeight;
//     container.scrollTo({
//       top: currentIndex * itemHeight,
//       behavior: "smooth",
//     });
//   }, [currentIndex]);
  
//   useEffect(() => {
//     const getVideo = async () => {
//       const response = await apiClient.getVideos();
//       setReel(response as any) 
//     }
    
//     console.log(reel);
//     getVideo();
//   }, [])
  
  
//   return (
//     <div className="relative w-full h-screen flex justify-center overflow-hidden">
//       <div
//         ref={containerRef}
//         className="md:max-w-md h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
//         style={{
//           scrollbarWidth: "none",
//           msOverflowStyle: "none",
//         }}>
//         {reel!.map((reel, index) => (
//           <div key={reel?._id} className="snap-start pt-2">
//             <ReelItem reel={reel} isActive={index === currentIndex} />
//           </div>
//         ))}
//       </div>

//       {/* Scroll Indicators */}
//       <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
//         {reel?.map((_, index) => (
//           <div
//           key={index}
//           className={`w-1 h-8 rounded-full transition-colors ${index === currentIndex ? "dark:bg-white bg-black" : "dark:bg-white/30 bg-black/70"}`}
//           />
//         ))}
//       </div>
//     </div>
//   )
// }

// // const response = await apiClient.getVideo(id);
// // setVideos(response);
// // const { id } = useParams<{id: string}>();  