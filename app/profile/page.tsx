'use client'

import { apiClient } from "@/lib/api-client";
import { Playlist } from "@/models/Playlist";
import { IVideo } from "@/models/Video";
import { ListVideo, Loader2, Plus, Trash, TvMinimalPlay, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface Profile {
  userName: string;
  email: string;
};


interface PasswordFormData {
    oldPassword: string;
    newPassword: string;
}




export default function page() {
    
    const [isModelOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    
    const [profileData, setProfileData] = useState({
        userName: "",
        email: "",
    })
    
    
    const { register, handleSubmit, reset, formState: { isSubmitting }} = useForm<Profile>({
        defaultValues: {
            userName: profileData.userName,
            email: profileData.email
        }
    })
    
    useEffect(() => {
        
        const getData = async () => {
            const response = await apiClient.getUser();
            const userProfile = {
                userName: response.userName || "",
                email: response.email || "",
            };
            
            reset(userProfile);          
        setProfileData(userProfile); 
    }
    
    getData();
    
  }, []);



  const onSubmit = async(data: Profile) => {
    try {
        await apiClient.updateProfile(data.userName, data.email);
        toast.success("Profile updated succssfully");
    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Something went wrong";
        toast.error(errorMsg);
    }
  }


    const { 
        register: registerPassword, 
        handleSubmit: handlePasswordSubmit, 
        formState: { isSubmitting: isPasswordUpdating }, 
        reset: resetPasswordForm 
    } = useForm<PasswordFormData>()

  const handleUpdatePassword = async(data: PasswordFormData) => {
    try {
        await apiClient.updatePass(data.oldPassword, data.newPassword);
        resetPasswordForm();
        toast.success("Passowrd updated successfully");
        setIsModalOpen(false);
    } catch (error) {
        const errorMsg = error instanceof Error ? error?.message : "Something went wrong";
        toast.error(errorMsg);
    }
  }


  const [playlistModal, setPlaylistModal] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const handlePlaylist = async() => {
    try {
      const response = await apiClient.createPlaylist(playlistName);
      setPlaylists(prev => [...prev, response?.data])
      toast.success("Playlist created successfully");
    } catch (error) {
      const errorMsg = error instanceof Error ? error?.message : "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setPlaylistModal(false);
      setPlaylistName('');
    }
  }


  useEffect(() => {
    const getPlaylist = async () => {
      const response = await apiClient.getPlaylist();
      setPlaylists([response.data]);
    }
    try {
    } catch (error) {
      const errorMsg = error instanceof Error ? error?.message : "Something went wrong";
      toast.error(errorMsg);
    }

    getPlaylist();

  }, [])

  const handleDeletePlaylist = async(playlistName: string) => {
    try {
      await apiClient.deletePlaylist(playlistName);
      setPlaylists(prev => prev.filter(p => p.playlistName !== playlistName));
      toast.success("Playlist deleted successfully");
    } catch (error) {
      const errorMsg = error instanceof Error ? error?.message : "Something went wrong";
      toast.error(errorMsg);
    }
  }


  // videos

  const [videos, setVideos] = useState<IVideo[]>([]);
    useEffect(() => {
      const fetchVideo = async() => {
        try {
          const response = await apiClient.getVideos();
          setVideos(response);
        } catch (error) {
          const errorMsg = error instanceof Error ? error?.message : "Something went wrong";
          toast.error(errorMsg);
        }
      }
  
      fetchVideo();
  }, [])



  return (
    <>
    <div className="w-full max-w-5xl mx-auto mt-5">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <nav className="grid grid-cols-2 md:grid-cols-3 gap-1">
                <button className={`cursor-pointer py-2 sm:py-3 px-1 sm:px-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${ activeTab === "profile"  ? "bg-gray-300  shadow-sm" : "text-gray-600 hover:text-green-600 hover:bg-green-50"}`} onClick={() => setActiveTab("profile")} >
                    <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                    <User size={14} className="sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">Profile</span>
                    </div>
                </button>
                <button className={`cursor-pointer py-2 sm:py-3 px-1 sm:px-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${ activeTab === "videos"  ? "bg-gray-300  shadow-sm" : "text-gray-600 hover:text-green-600 hover:bg-green-50"}`} onClick={() => setActiveTab("videos")} >
                    <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                    <TvMinimalPlay size={14} className="sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">Videos</span>
                    </div>
                </button>
                <button className={`cursor-pointer py-2 sm:py-3 px-1 sm:px-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${ activeTab === "playlist"  ? "bg-gray-300  shadow-sm" : "text-gray-600 hover:text-green-600 hover:bg-green-50"}`} onClick={() => setActiveTab("playlist")} >
                    <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                    <ListVideo size={14} className="sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">Playlist</span>
                    </div>
                </button>
            </nav>
        </div>
    </div>
    <div className="px-2 sm:px-4 md:px-6 max-w-5xl mx-auto">
    {
        activeTab === "profile" ?
        (
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 my-2">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800"> Profile Settings </h2>
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl sm:text-2xl text-yellow-800"> 👤 </span>
                </div>
                <div className="text-center sm:text-left">
                  <input type="file" className="hidden" accept="image/*" />
                  <button className="text-sm font-medium text-teal-600 hover:text-teal-700 block"> Change picture </button>
                  <p className="text-xs text-gray-500 mt-1"> JPG, GIF or PNG. 1MB max. </p>
                </div>
              </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <User className="text-gray-400 mr-2" size={16} /> User name
                    </label>
                    <input
                        type="text"
                        {...register("userName")}
                        className="w-full p-3 border border-gray-200 rounded-md focus:bg-[#f3faf9] focus:ring focus:outline-none focus:ring-teal-500 text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <User className="text-gray-400 mr-2" size={16} /> Email
                    </label>
                    <input
                        type="text"
                        {...register("email")}
                        className="w-full p-3 border border-gray-200 rounded-md focus:bg-[#f3faf9] focus:ring focus:outline-none focus:ring-teal-500 text-sm" />
                  </div>
                 </div>
                <div className="flex justify-stretch sm:justify-end pt-6">
                    <button disabled={isSubmitting} type="submit"
                    className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white cursor-pointer px-6 py-3 rounded-full text-sm font-medium transition-colors" > {isSubmitting ? ( <Loader2 size={25} className="mr-2 animate-spin text-white" />) : ('Update Profile') }
                    </button>
                </div>
                </form>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800"> Security </h2>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-700">
                      Password
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Change your password.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto text-sm cursor-pointer text-teal-500 hover:text-teal-600 font-medium border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-50 transition-all">
                    Update password
                  </button>
                </div>
                { isModelOpen && (
                <form onSubmit={handlePasswordSubmit(handleUpdatePassword)}>
                <div className="fixed inset-0 flex items-center justify-center bg-[#1d1c1c96] bg-opacity-50 z-50 p-4">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Update Password</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 cursor-pointer bg-gray-200 p-2 rounded-full text-sm transition-colors"> <X size={16} /> </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1"> Old Password </label>
                      <input type="password" {...registerPassword("oldPassword")}
                        className="w-full p-3 border border-gray-200 rounded-md focus:bg-[#f3faf9] focus:ring focus:outline-none focus:ring-teal-500 text-sm"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1"> New Password </label>
                      <input type="password" {...registerPassword("newPassword")}
                        className="w-full p-3 border border-gray-200 rounded-md focus:bg-[#f3faf9] focus:ring focus:outline-none focus:ring-teal-500 text-sm" />
                    </div>
                  </div>
                  <div className="flex flex-col-reverse sm:flex-row justify-end mt-6 gap-3">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-full sm:w-auto text-black cursor-pointer border border-gray-300 rounded-full px-4 py-2 text-sm hover:bg-gray-50 transition-colors" > Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isPasswordUpdating}
                      className="w-full sm:w-auto bg-teal-500 cursor-pointer text-white px-4 py-2 rounded-full text-sm hover:bg-teal-600 transition-colors" > {isPasswordUpdating ?  ( <Loader2 size={25} className="mr-2 animate-spin text-white" />) : ("Update Password")}
                    </button>
                  </div>
                  </div>
                </div>
                </form>
                ) }
            </div>
        ) : activeTab === "videos" ? (
            <div className="my-6 bg-white shadow-sm border border-gray-200 rounded-lg p-4 sm:p-6">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">🎥 Your Uploaded Videos</h2>

    {videos.length === 0 ? (
      <div className="text-center text-gray-500 text-sm">You haven't uploaded any videos yet.</div>
    ) : (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {videos?.map((video) => (
          <div  className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="aspect-video bg-gray-100 overflow-hidden">
              <video
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                src={video?.videoUrl}
                controls
              />
            </div>
            <div className="p-4">
              <h3 className="text-base font-semibold text-gray-800 truncate">{video?.title}</h3>
              <p className="text-sm text-gray-500 mt-1 truncate">{video?.description}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-400">{new Date(video.createdAt!).toLocaleDateString()} </span>
                <span className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full">Published</span>
              </div>
            </div>
          </div>
           ))} 
            </div>
          )}
        </div>
        ) : activeTab === "playlist" ? (
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 my-2 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">🎶 Your Playlists</h2>
                  <button className="cursor-pointer" onClick={() => setPlaylistModal(!playlistModal)}> <Plus /> </button>
                </div>

              {/* Playlist Grid */}
              {playlists.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {playlists.map((playlist) => (
                    <div key={playlist?._id}
                      className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-all bg-gray-50">
                        <div className="flex justify-between">
                          <h3 className="text-md font-semibold text-gray-800 truncate">{playlist.playlistName}</h3>
                          <button
                            onClick={() => handleDeletePlaylist(playlist.playlistName)}
                            className="text-sm text-red-500 hover:text-red-600 cursor-pointer">
                            <Trash size={17} />
                          </button>
                        </div>
                      <p className="text-xs text-gray-500 mt-1">{playlist.videos?.length} videos</p>
                      <div className="flex justify-between items-center mt-4">
                        
                      </div>
                    </div>
                  ))}
                </div>
              ) : ( 
               <p className="text-gray-500 text-sm mt-4">You have no playlists yet.</p>
               )} 
              
              { playlistModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-[#1d1c1c96] bg-opacity-50 z-50 p-4">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Create Playlist</h3>
                    <button onClick={() => setPlaylistModal(false)} className="text-gray-500 hover:text-gray-700 cursor-pointer bg-gray-200 p-2 rounded-full text-sm transition-colors"> <X size={16} /> </button>
                  </div>

                  <div className="space-y-4">
                    
                    <label className="block text-sm font-medium text-gray-700 mb-1">Playlist Name</label>
                    <input
                      type="text" onChange={(e) => setPlaylistName(e.target.value)} placeholder="Enter playlist name..." className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm" />
                  </div>
                  <button
                    type="submit"
                    onClick={handlePlaylist} 
                    className="bg-teal-500 cursor-pointer hover:bg-teal-600 my-2 transition-colors text-white px-4 py-2 rounded-md text-sm shadow-sm" > Create Playlist
                  </button>
                  </div>
                </div>
              ) }
            </div>
        ) : null
    }
    </div>
    </>
  )
}
