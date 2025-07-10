import { apiClient } from "@/lib/api-client"
import { IVideo } from "@/models/Video"
import { asyncHandlerFront } from "@/utils/FrontAsyncHandler"
import { Video } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const VideosTab = () => {
    const [videos, setVideos] = useState<IVideo[]>([]);
    const router = useRouter();


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

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 ml-14 lg:ml-0">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.length > 0 ? videos?.map((video) => (
                    <div key={video._id?.toString()} className="card bg-base-100 shadow-xl">
                        <figure className="bg-gray-200 h-48 flex items-center justify-center">
                            <Video className="w-12 h-12 text-gray-400" />
                        </figure>
                        <div className="card-body">
                            <h3 className="card-title">{video?.title}</h3>
                            <p>{video?.description}</p>
                            <div className="card-actions">
                                <button onClick={() => router.push(`/video/${video._id?.toString()}`) } className="btn btn-primary btn-sm">Watch</button>
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