import { apiClient } from "@/lib/api-client"
import { IVideo } from "@/models/Video"
import { asyncHandlerFront } from "@/utils/FrontAsyncHandler"
import { Video } from "lucide-react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const VideosTab = () => {
    const [videos, setVideos] = useState<IVideo[]>([]);
    const router = useRouter();
    const { data: session } = useSession();


    useEffect(() => {
        const getVideo = async () => {
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
        }

        getVideo();
    }, [])

    console.log(videos)

    function getDaysAgo(isoDate: Date): string {
        const createdDate = new Date(isoDate);
        const now = new Date();
        const diffInMs = now.getTime() - createdDate.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return "Today";
        if (diffInDays === 1) return "1 day ago";
        return `${diffInDays} days ago`;
    }


    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 ml-14 lg:ml-0">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.length > 0 ? videos?.map((video) => (
                    <div key={video._id?.toString()} className="card bg-base-100 shadow-xl">
                        <figure className="bg-gray-200 h-48 flex items-center justify-center">
                            <video src={video.videoUrl} />
                            {/* <Video className="w-12 h-12 text-gray-400" /> */}
                        </figure>
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <span className="px-2 py-1 text-xs font-semibold bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-100 rounded"> {video?.title}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400"> {getDaysAgo(video.createdAt)} </span>
                            </div>
                            {/* <h3 className="card-title">{video?.title}</h3> */}
                            <p className="pt-3">{video?.description}</p>
                            <div className="card-actions">
                                <button onClick={() => session?.user?._id ? router.push(`/video/${video._id?.toString()}`) : router.push('/login') } className="btn btn-primary btn-sm">Watch</button>
                            </div>
                        </div>
                    </div>
                )):
                <h1 className="text-2xl font-bold mb-4 ml-14 lg:ml-0">No video Found</h1> 
                }
            </div>
        </div>
    )
}

export default VideosTab