import { apiClient } from "@/lib/api-client"
import { IVideo } from "@/models/Video"
import { asyncHandlerFront } from "@/utils/FrontAsyncHandler"
import { Video } from "lucide-react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import Loader from "./Loader"

function getDaysAgo(isoDate: Date): string {
    const createdDate = new Date(isoDate);
    const now = new Date();
    const diffInMs = now.getTime() - createdDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
}

const VideosTab = () => {
    const [videos, setVideos] = useState<IVideo[]>([]);
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getVideo = async () => {
            setLoading(true);
            asyncHandlerFront(
                async() => {
                    const reseponse = await apiClient.getVideos();
                    setVideos(reseponse);
                    console.log(reseponse)
                }, 
                (error) => {
                    toast.error(error.message);
                }
            )
            setLoading(false);
        }

        getVideo();
    }, [])

    // console.log(videos)

    if(loading) return <Loader />

    return (
        <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 ml-14 lg:ml-0 text-gray-900"> Videos </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.length > 0 ? (
            videos.map((video) => (
                <div
                key={video._id?.toString()}
                className="group bg-white/70 backdrop-blur-lg border border-white/40 shadow-sm hover:shadow-lg rounded-2xl overflow-hidden transition-all duration-300">
                {/* Video Preview */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                    {video.videoUrl ? (
                    <video
                        src={video.videoUrl}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    ) : (
                    <Video className="w-12 h-12 text-gray-400" />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 shadow-sm">
                        {video?.title}
                    </span>
                    <span className="text-xs text-gray-500">
                        {getDaysAgo(video.createdAt)}
                    </span>
                    </div>

                    <p className="text-sm text-gray-700 line-clamp-2">
                    {video?.description}
                    </p>

                    {/* Action */}
                    <div className="flex justify-end">
                    <button
                        onClick={() =>
                        session?.user?._id
                            ? router.push(`/video/${video._id?.toString()}`)
                            : router.push("/login")
                        }
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow hover:shadow-md hover:from-purple-600 hover:to-pink-600 text-sm transition-all cursor-pointer">
                        Watch
                    </button>
                    </div>
                </div>
                </div>
            ))
            ) : (
            <h1 className="text-2xl font-bold ml-14 lg:ml-0 text-gray-500">
                No video found
            </h1>
            )}
        </div>
        </div>
    )
}

export default VideosTab