// // 'use client'

// // import { apiClient } from "@/lib/api-client";
// // import { Playlist } from "@/models/Playlist";
// // import { IVideo } from "@/models/Video";
// // import { ListVideo, Loader2, Plus, Trash, TvMinimalPlay, User, X, PlayCircle, } from "lucide-react";
// // import { useEffect, useState } from "react";
// // import { useForm } from "react-hook-form";
// // import toast from "react-hot-toast";

// // interface Profile {
// //   userName: string;
// //   email: string;
// // };


// // interface PasswordFormData {
// //     oldPassword: string;
// //     newPassword: string;
// // }



// // export default function page() {
    
// //     const [isModelOpen, setIsModalOpen] = useState(false);
// //     const [activeTab, setActiveTab] = useState("profile");
    
// //     const [profileData, setProfileData] = useState({
// //         userName: "",
// //         email: "",
// //     })
    
    
// //     const { register, handleSubmit, reset, formState: { isSubmitting }} = useForm<Profile>({
// //         defaultValues: {
// //             userName: profileData.userName,
// //             email: profileData.email
// //         }
// //     })
    
// //     useEffect(() => {
        
// //         const getData = async () => {
// //             const response = await apiClient.getUser();
// //             const userProfile = {
// //                 userName: response.userName || "",
// //                 email: response.email || "",
// //             };
            
// //             reset(userProfile);          
// //         setProfileData(userProfile); 
// //     }
    
// //     getData();
    
// //   }, []);



// //   const onSubmit = async(data: Profile) => {
// //     try {
// //         await apiClient.updateProfile(data.userName, data.email);
// //         toast.success("Profile updated succssfully");
// //     } catch (error) {
// //         const errorMsg = error instanceof Error ? error.message : "Something went wrong";
// //         toast.error(errorMsg);
// //     }
// //   }


// //     const { 
// //         register: registerPassword, 
// //         handleSubmit: handlePasswordSubmit, 
// //         formState: { isSubmitting: isPasswordUpdating }, 
// //         reset: resetPasswordForm 
// //     } = useForm<PasswordFormData>()

// //   const handleUpdatePassword = async(data: PasswordFormData) => {
// //     try {
// //         await apiClient.updatePass(data.oldPassword, data.newPassword);
// //         resetPasswordForm();
// //         toast.success("Passowrd updated successfully");
// //         setIsModalOpen(false);
// //     } catch (error) {
// //         const errorMsg = error instanceof Error ? error?.message : "Something went wrong";
// //         toast.error(errorMsg);
// //     }
// //   }


// //     interface Playlists {
// //       _id?: string;
// //       playlistName: string;
// //       user: string;
// //       videos: IVideo[]; 
// //     }



// //   const [playlistModal, setPlaylistModal] = useState(false);
// //   const [createPlaylistModal, setCreatePlaylistModal] = useState(false);
// //   const [playlistName, setPlaylistName] = useState('');
// //   const [playlists, setPlaylists] = useState<Playlist[]>([]);

// //   console.log(playlists, "")


// //   const handlePlaylist = async() => {
// //     try {
// //       const response = await apiClient.createPlaylist(playlistName);
// //       setPlaylists(prev => [...prev, response?.data])
// //       toast.success("Playlist created successfully");
// //     } catch (error) {
// //       const errorMsg = error instanceof Error ? error?.message : "Something went wrong";
// //       toast.error(errorMsg);
// //     } finally {
// //       setCreatePlaylistModal(false);
// //       setPlaylistName('');
// //     }
// //   }


// //   useEffect(() => {
// //     const getPlaylist = async () => {
// //       const response = await apiClient.getPlaylist();
// //       setPlaylists(response);
// //     }
// //     try {
// //     } catch (error) {
// //       const errorMsg = error instanceof Error ? error?.message : "Something went wrong";
// //       toast.error(errorMsg);
// //     }

// //     getPlaylist();

// //   }, [])

// //   const handleDeletePlaylist = async(playlistName: string) => {
// //     try {
// //       await apiClient.deletePlaylist(playlistName);
// //       setPlaylists(prev => prev.filter(p => p.playlistName !== playlistName));
// //       toast.success("Playlist deleted successfully");
// //     } catch (error) {
// //       const errorMsg = error instanceof Error ? error?.message : "Something went wrong";
// //       toast.error(errorMsg);
// //     }
// //   }


// //   // videos

// //   const [videos, setVideos] = useState<IVideo[]>([]);
// //     useEffect(() => {
// //       const fetchVideo = async() => {
// //         try {
// //           const response = await apiClient.getVideos();
// //           setVideos(response);
// //         } catch (error) {
// //           const errorMsg = error instanceof Error ? error?.message : "Something went wrong";
// //           toast.error(errorMsg);
// //         }
// //       }
  
// //       fetchVideo();
// //   }, [])
  


// //     const [selectedPlaylist, setSelectedPlaylist] = useState<Playlists | null>(null);
// //     const [isFollowing, setIsFollowing] = useState(false);

// //     const handleOpenPlaylist = (playlist: Playlists) => {
// //       setSelectedPlaylist(playlist);
// //       setPlaylistModal(true);
// //     };

// //     console.log(selectedPlaylist, "select")

// //   return (
// //     <>
// //     <div className="w-full max-w-5xl mx-auto mt-5">
// //         <div className="bg-white rounded-lg shadow-sm border p-1">
// //             <nav className="grid grid-cols-2 md:grid-cols-3 gap-1">
// //                 <button className={`cursor-pointer py-2 sm:py-3 px-1 sm:px-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${ activeTab === "profile"  ? "bg-gray-300  shadow-sm" : "text-gray-600 hover:text-green-600 hover:bg-green-50"}`} onClick={() => setActiveTab("profile")} >
// //                     <div className="flex flex-col items-center gap-0.5 sm:gap-1">
// //                     <User size={14} className="sm:w-4 sm:h-4" />
// //                     <span className="text-xs sm:text-sm">Profile</span>
// //                     </div>
// //                 </button>
// //                 <button className={`cursor-pointer py-2 sm:py-3 px-1 sm:px-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${ activeTab === "videos"  ? "bg-gray-300  shadow-sm" : "text-gray-600 hover:bg-green-50"}`} onClick={() => setActiveTab("videos")} >
// //                     <div className="flex flex-col items-center gap-0.5 sm:gap-1">
// //                     <TvMinimalPlay size={14} className="sm:w-4 sm:h-4" />
// //                     <span className="text-xs sm:text-sm">Videos</span>
// //                     </div>
// //                 </button>
// //                 <button className={`cursor-pointer py-2 sm:py-3 px-1 sm:px-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${ activeTab === "playlist"  ? "bg-gray-300  shadow-sm" : "text-gray-600 hover:text-green-600 hover:bg-green-50"}`} onClick={() => setActiveTab("playlist")} >
// //                     <div className="flex flex-col items-center gap-0.5 sm:gap-1">
// //                     <ListVideo size={14} className="sm:w-4 sm:h-4" />
// //                     <span className="text-xs sm:text-sm">Playlist</span>
// //                     </div>
// //                 </button>
// //             </nav>
// //         </div>
// //     </div>
// //     <div className="px-2 sm:px-4 md:px-6 max-w-5xl mx-auto">
// //     {
// //         activeTab === "profile" ?
// //         (
// //             <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 my-2">
// //               <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800"> Profile Settings </h2>
// //               <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
// //                 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
// //                   <span className="text-xl sm:text-2xl text-yellow-800"> 👤 </span>
// //                 </div>
// //                 <div className="text-center sm:text-left">
// //                   <input type="file" className="hidden" accept="image/*" />
// //                   <button className="text-sm font-medium  hover:text-teal-700 block"> Change picture </button>
// //                   <p className="text-xs text-gray-500 mt-1"> JPG, GIF or PNG. 1MB max. </p>
// //                 </div>
// //               </div>
// //                 <form onSubmit={handleSubmit(onSubmit)}>
// //                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
// //                   <div>
// //                     <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
// //                         <User className="text-gray-400 mr-2" size={16} /> User name
// //                     </label>
// //                     <input
// //                         type="text"
// //                         {...register("userName")}
// //                         className="w-full p-3 border  rounded-md text-sm" />
// //                   </div>
// //                   <div>
// //                     <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
// //                         <User className="text-gray-400 mr-2" size={16} /> Email
// //                     </label>
// //                     <input
// //                         type="text"
// //                         {...register("email")}
// //                         className="w-full p-3 border  rounded-md  focus:ring focus:outline-none text-sm" />
// //                   </div>
// //                  </div>
// //                 <div className="flex justify-stretch sm:justify-end pt-6">
// //                     <button disabled={isSubmitting} type="submit"
// //                     className="w-full sm:w-auto btn cursor-pointer px-6 py-3 rounded-full text-sm font-medium" > {isSubmitting ? ( <Loader2 size={25} className="mr-2 animate-spin" />) : ('Update Profile') }
// //                     </button>
// //                 </div>
// //                 </form>
// //               <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6"> Security </h2>
// //               <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
// //                   <div className="flex-1">
// //                     <h3 className="text-sm font-medium">
// //                       Password
// //                     </h3>
// //                     <p className="text-sm text-gray-500 mt-1">
// //                       Change your password.
// //                     </p>
// //                   </div>
// //                   <button
// //                     onClick={() => setIsModalOpen(true)}
// //                     className="w-full sm:w-auto text-sm cursor-pointer font-medium px-4 py-2 rounded-full btn transition-all">
// //                     Update password
// //                   </button>
// //                 </div>
// //                 { isModelOpen && (
// //                 <form onSubmit={handlePasswordSubmit(handleUpdatePassword)}>
// //                 <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 p-4">
// //                 <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
// //                   <div className="flex justify-between items-center mb-4">
// //                     <h3 className="text-lg font-semibold">Update Password</h3>
// //                     <button onClick={() => setIsModalOpen(false)} className=" cursor-pointer p-2 rounded-full text-sm transition-colors"> <X size={16} /> </button>
// //                   </div>

// //                   <div className="space-y-4">
// //                     <div>
// //                       <label className="block text-sm font-medium mb-1"> Old Password </label>
// //                       <input type="password" {...registerPassword("oldPassword")}
// //                         className="w-full p-3 border rounded-md text-sm"/>
// //                     </div>
// //                     <div>
// //                       <label className="block text-sm font-medium mb-1"> New Password </label>
// //                       <input type="password" {...registerPassword("newPassword")}
// //                         className="w-full p-3 border  rounded-md text-sm" />
// //                     </div>
// //                   </div>
// //                   <div className="flex flex-col-reverse sm:flex-row justify-end mt-6 gap-3">
// //                     <button
// //                       onClick={() => setIsModalOpen(false)}
// //                       className="w-full sm:w-auto  cursor-pointer border rounded-full px-4 py-2 text-sm  transition-colors" > Cancel
// //                     </button>
// //                     <button
// //                       type="submit"
// //                       disabled={isPasswordUpdating}
// //                       className="w-full sm:w-auto cursor-pointer btn px-4 py-2 rounded-full text-sm" > {isPasswordUpdating ?  ( <Loader2 size={25} className="mr-2 animate-spin" />) : ("Update Password")}
// //                     </button>
// //                   </div>
// //                   </div>
// //                 </div>
// //                 </form>
// //                 ) }
// //             </div>
// //         ) : activeTab === "videos" ? (
// //             <div className="my-6 bg-white shadow-sm border border-gray-200 rounded-lg p-4 sm:p-6">
// //     <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">🎥 Your Uploaded Videos</h2>

// //     {videos.length === 0 ? (
// //       <div className="text-center text-gray-500 text-sm">You haven't uploaded any videos yet.</div>
// //     ) : (
// //       <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
// //         {videos?.map((video) => (
// //           <div  className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
// //             <div className="aspect-video bg-gray-100 overflow-hidden">
// //               <video
// //                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
// //                 src={video?.videoUrl}
// //                 controls
// //               />
// //             </div>
// //             <div className="p-4">
// //               <h3 className="text-base font-semibold text-gray-800 truncate">{video?.title}</h3>
// //               <p className="text-sm text-gray-500 mt-1 truncate">{video?.description}</p>
// //               <div className="flex justify-between items-center mt-3">
// //                 <span className="text-xs text-gray-400">{new Date(video.createdAt!).toLocaleDateString()} </span>
// //                 <span className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full">Published</span>
// //               </div>
// //             </div>
// //           </div>
// //            ))} 
// //             </div>
// //           )}
// //         </div>
// //         ) : activeTab === "playlist" ? (
// //               <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 my-2 animate-fadeIn">
// //                 <div className="flex justify-between items-center">
// //                   <h2 className="text-xl font-semibold mb-4 text-gray-800">🎶 Your Playlists</h2>
// //                   <button className="cursor-pointer" onClick={() => setCreatePlaylistModal(!createPlaylistModal)}> <Plus /> </button>
// //                 </div>
// //               {playlists.length > 0 ? (
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
// //                   {playlists?.map((playlist) => (
// //                     <div
// //                       key={playlist._id}
// //                       className="border border-gray-200 rounded-xl shadow hover:shadow-md transition-all bg-white cursor-pointer"
// //                       onClick={() => handleOpenPlaylist(playlist)}
// //                     >
// //                       {playlist.videos?.[0] ? (
// //                         <video
// //                           src={playlist.videos[0]?.videoUrl}
// //                           className="w-full h-44 object-cover rounded-t-xl"
// //                           controls={false}
// //                           muted
// //                           playsInline
// //                         />
// //                       ) : (
// //                         <div className="w-full h-44 bg-gray-100 flex items-center justify-center rounded-t-xl text-gray-500">
// //                           No Video
// //                         </div>
// //                       )}
// //                       <div className="p-3">
// //                         <div className="flex justify-between items-center">
// //                           <h3 className="text-md font-semibold text-gray-800 truncate">
// //                             {playlist.playlistName}
// //                           </h3>
// //                           <button
// //                             onClick={(e) => {
// //                               e.stopPropagation();
// //                               handleDeletePlaylist(playlist.playlistName);
// //                             }}
// //                             className="text-red-500 hover:text-red-600"
// //                           >
// //                             <Trash size={17} />
// //                           </button>
// //                         </div>
// //                         <p className="text-xs text-gray-500 mt-1">{playlist.videos?.length} videos</p>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               ) : (
// //                 <p className="text-gray-500 text-sm">You don't have any playlists yet.</p>
// //               )}

// //               {playlistModal && selectedPlaylist && (
// //                 <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
// //                   <div className="bg-white max-w-2xl w-full rounded-xl shadow-xl p-6 relative">
// //                     <button
// //                       onClick={() => setPlaylistModal(false)}
// //                       className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
// //                     >
// //                       <X size={18} />
// //                     </button>

// //                     <div className="flex items-center justify-between mb-4">
// //                       <h2 className="text-xl font-semibold text-gray-800">
// //                         {selectedPlaylist.playlistName} ({selectedPlaylist.videos.length} videos)
// //                       </h2>
// //                       <button
// //                         onClick={() => setIsFollowing(!isFollowing)}
// //                         className="text-sm bg-teal-500 text-white px-4 py-1.5 rounded-full hover:bg-teal-600"
// //                       >
// //                         {isFollowing ? "Unfollow" : "Follow"}
// //                       </button>
// //                     </div>

// //                     <div className="space-y-4 max-h-[60vh] overflow-y-auto">
// //                         {selectedPlaylist.videos.map((video) => {
// //                         return (
// //                           <div key={video._id?.toString()} className="flex gap-4 items-start border-b pb-3">
// //                             <video
// //                               src={video.videoUrl}
// //                               className="w-32 h-20 object-cover rounded-md"
// //                               controls={false}
// //                               muted
// //                               playsInline
// //                             />
// //                             <div className="flex-1">
// //                               <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
// //                                 {video.title}
// //                               </h3>
// //                               <p className="text-xs text-gray-600 mt-1 line-clamp-2">
// //                                 {video.description}
// //                               </p>
// //                               <p className="text-xs text-gray-400 mt-1">
// //                                 {new Date(video.createdAt ?? "").toLocaleDateString()} • {video.views} views
// //                               </p>
// //                             </div>
// //                             <PlayCircle className="text-teal-600 shrink-0" size={22} />
// //                           </div>
// //                         );
// //                       })}

// //                     </div>
// //                   </div>
// //                 </div>
// //               )} 
              
// //               { createPlaylistModal && (
// //                 <div className="fixed inset-0 flex items-center justify-center bg-[#1d1c1c96] bg-opacity-50 z-50 p-4">
// //                 <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
// //                   <div className="flex justify-between items-center mb-4">
// //                     <h3 className="text-lg font-semibold">Create Playlist</h3>
// //                     <button onClick={() => setCreatePlaylistModal(false)} className="text-gray-500 hover:text-gray-700 cursor-pointer bg-gray-200 p-2 rounded-full text-sm transition-colors"> <X size={16} /> </button>
// //                   </div>

// //                   <div className="space-y-4">
                    
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">Playlist Name</label>
// //                     <input
// //                       type="text" onChange={(e) => setPlaylistName(e.target.value)} placeholder="Enter playlist name..." className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm" />
// //                   </div>
// //                   <button
// //                     type="submit"
// //                     onClick={handlePlaylist} 
// //                     className="bg-teal-500 cursor-pointer hover:bg-teal-600 my-2 transition-colors text-white px-4 py-2 rounded-md text-sm shadow-sm" > Create Playlist
// //                   </button>
// //                   </div>
// //                 </div>
// //               ) }
// //             </div>
// //         ) : null
// //     }
// //     </div>
// //     </>
// //   )
// // }














// // // interface Props {
// // //   playlists: Playlist[];
// // //   handleDeletePlaylist: (name: string) => void;
// // // }

// // // export default function PlaylistSection({ playlists, handleDeletePlaylist }: Props) {


// // //   return (
// // //     <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 my-2 animate-fadeIn">
// // //       <div className="flex justify-between items-center mb-4">
// // //         <h2 className="text-xl font-semibold text-gray-800">🎶 Your Playlists</h2>
// // //         <button onClick={() => setPlaylistModal(!playlistModal)} className="text-teal-600 hover:text-teal-800">
// // //           <Plus />
// // //         </button>
// // //       </div>

      
// //     // </div>
// // //   );
// // // }



// "use client"

// import { useState } from "react"
// import { Home, Video, Bell, MessageCircle, Plus, User, Menu, X } from "lucide-react"
// import HomeTab from "@/components/HomeTab"
// import VideosTab from "@/components/VideoTab"
// import NotificationsTab from "@/components/NotificationsTab"
// import MessagesTab from "@/components/MessagesTab"
// import CreateTab from "@/components/CreateTab"
// import ProfileTab from "@/components/ProfileTab"

// // Tab Components
// type TabType = "home" | "videos" | "notifications" | "messages" | "create" | "profile"

// export default function ProfilePage() {
//     const [activeTab, setActiveTab] = useState<TabType>("home");
//     const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
//     const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

//     const tabs = [
//         { id: "home" as TabType, label: "Home", icon: Home },
//         { id: "videos" as TabType, label: "Videos", icon: Video },
//         { id: "notifications" as TabType, label: "Notifications", icon: Bell },
//         { id: "messages" as TabType, label: "Messages", icon: MessageCircle },
//         { id: "create" as TabType, label: "Create", icon: Plus },
//         { id: "profile" as TabType, label: "Profile", icon: User },
//     ]

//     const renderTabContent = () => {
//         switch (activeTab) {
//             case "home":
//                 return <HomeTab />
//             case "videos":
//                 return <VideosTab />
//             case "notifications":
//                 return <NotificationsTab />
//             case "messages":
//                 return <MessagesTab />
//             // case "create":
//             //     return <CreateTab />
//             case "profile":
//                 return <ProfileTab />
//             default:
//                 return <HomeTab />
//         }
//     }

//     return (
//         <div className="min-h-screen">
//             {/* Mobile menu button */}
//             <div className="lg:hidden fixed top-4 left-4 z-50">
//                 <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn btn-square btn-primary">
//                     {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//                 </button>
//             </div>

//             {/* Sidebar */}
//             <div
//                 className={`fixed inset-y-0 left-0 z-40 w-64 bg-black/100 text-white/80 lg:text-black lg:bg-primary-50 dark:bg-black/100 dark:text-white/80 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
//                     }`}
//             >
//                 <div className="p-6">
//                     <h1 className="text-2xl font-bold text-primary mb-8 ml-14 lg:ml-0">Dashboard</h1>
//                     <nav className="space-y-2">
//                         {tabs.map((tab) => {
//                             const IconComponent = tab.icon
//                             return (
//                                 <button
//                                     key={tab.id}
//                                     onClick={() => {
//                                         if (tab.id === "create") {
//                                             setIsCreateModalOpen(true)
//                                         } else {
//                                             setActiveTab(tab.id)
//                                             setSidebarOpen(false)
//                                         }
//                                     }}
//                                     className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${activeTab === tab.id ? "bg-primary-500 text-white hover:bg-primary-600" : "hover:bg-primary-600 hover:text-white/95"
//                                         }`}
//                                 >
//                                     <IconComponent className="w-5 h-5" />
//                                     <span className="font-medium">{tab.label}</span>
//                                 </button>
//                             )
//                         })}
//                     </nav>
//                 </div>
//             </div>

//             {/* Overlay for mobile */}
//             {sidebarOpen && (
//                 <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-30 lg:hidden text-white" onClick={() => setSidebarOpen(false)} />
//             )}

//             {/* Main content */}
//             <div className="lg:ml-64">
//                 <main className="min-h-screen dark:bg-black/80 dark:text-white/70">{renderTabContent()}</main>
//             </div>

//             <CreateTab
//                 isModalOpen={isCreateModalOpen}
//                 setIsModalOpen={setIsCreateModalOpen}
//             />

//         </div>
//     )
// }


"use client"

import { useState, useRef, useEffect } from "react"
import ReelItem from "@/components/ReelItem";
import { apiClient } from "@/lib/api-client";
import { useParams } from "next/navigation";

// export interface Reel {
//   id: string
//   videoUrl: string
//   thumbnail: string
//   user: {
//     username: string
//     avatar: string
//     isVerified: boolean
//   }
//   description: string
//   likes: number
//   comments: number
//   shares: number
//   isLiked: boolean
//   isBookmarked: boolean
// }

// const mockReels: Reel[] = [
//   {
//     id: "1",
//     videoUrl: "/placeholder.svg?height=800&width=450",
//     thumbnail: "/placeholder.svg?height=800&width=450",
//     user: {
//       username: "johndoe",
//       avatar: "/placeholder.svg",
//       isVerified: true,
//     },
//     description: "Amazing sunset timelapse from my rooftop! 🌅 #sunset #timelapse #photography",
//     likes: 12500,
//     comments: 234,
//     shares: 89,
//     isLiked: false,
//     isBookmarked: false,
//   },
//   {
//     id: "2",
//     videoUrl: "/placeholder.svg?height=800&width=450",
//     thumbnail: "/placeholder.svg?height=800&width=450",
//     user: {
//       username: "creativestudio",
//       avatar: "/placeholder.svg",
//       isVerified: false,
//     },
//     description: "Quick design tutorial: Creating smooth animations in Figma ✨ Follow for more tips!",
//     likes: 8900,
//     comments: 156,
//     shares: 67,
//     isLiked: true,
//     isBookmarked: false,
//   },
//   {
//     id: "3",
//     videoUrl: "/placeholder.svg?height=800&width=450",
//     thumbnail: "/placeholder.svg?height=800&width=450",
//     user: {
//       username: "foodielove",
//       avatar: "/placeholder.svg",
//       isVerified: true,
//     },
//     description: "Perfect pasta recipe in 60 seconds! 🍝 Save this for later #cooking #pasta #recipe",
//     likes: 15600,
//     comments: 445,
//     shares: 234,
//     isLiked: false,
//     isBookmarked: true,
//   },
//   {
//     id: "4",
//     videoUrl: "/placeholder.svg?height=800&width=450",
//     thumbnail: "/placeholder.svg?height=800&width=450",
//     user: {
//       username: "techreview",
//       avatar: "/placeholder.svg",
//       isVerified: true,
//     },
//     description: "iPhone 15 Pro Max camera test - the results will shock you! 📱 #tech #iphone #camera",
//     likes: 23400,
//     comments: 567,
//     shares: 123,
//     isLiked: true,
//     isBookmarked: false,
//   },
//   {
//     id: "5",
//     videoUrl: "/placeholder.svg?height=800&width=450",
//     thumbnail: "/placeholder.svg?height=800&width=450",
//     user: {
//       username: "fitnessjourney",
//       avatar: "/placeholder.svg",
//       isVerified: false,
//     },
//     description: "5-minute morning workout routine 💪 No equipment needed! #fitness #workout #morning",
//     likes: 9800,
//     comments: 234,
//     shares: 78,
//     isLiked: false,
//     isBookmarked: true,
//   },
// ]



// export interface IUserInfo {
//   userName: string;
//   profilePic: string;
// }

// export interface IVideoDetail {
//   _id: string;
//   title: string;
//   description: string;
//   videoUrl: string;
//   views: number;
//   createdAt?: string; 
//   owner: IUserInfo;
//   likesCount: number;
//   likedUserInfo: IUserInfo[];
// }


  // useEffect(() => {
  //   (
  //     async () => {
  //       await asyncHandlerFront(async () => {
  //         const res = await apiClient.getToken();

  //         console.log("res ==>", res);
  //       }, (error) => {
  //         console.log("error ==>", error.message);
  //       })
  //     }
  //   )()
  // }, [])
  
import type { VideoFormData } from "@/lib/api-client"

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null);
  const [reel, setReel] = useState<VideoFormData[]>([]);
  
  const { id } = useParams<{id: string}>();  
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setCurrentIndex((prev) => Math.min(prev + 1, reel!.length - 1));
      } else if (e.key === "ArrowUp") {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const itemHeight = container.clientHeight;
    container.scrollTo({
      top: currentIndex * itemHeight,
      behavior: "smooth",
    });
  }, [currentIndex]);

  useEffect(() => {
    const getVideo = async () => {
      const response = await apiClient.getVideo(id);
      setReel(response) 
    }
    
    getVideo();
  }, [])
  
  // console.log(reel);

  return (
    <div className="relative w-full h-screen dark:bg-black/80 flex justify-center overflow-hidden">
      <div
        ref={containerRef}
        className="md:max-w-md h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}>
        {reel!.map((reel, index) => (
          <div key={reel._id?.toString()} className="snap-start">
            <ReelItem reel={reel} isActive={index === currentIndex} />
          </div>
        ))}
      </div>

      {/* Scroll Indicators */}
      {/* <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
        {mockReels.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-8 rounded-full transition-colors ${index === currentIndex ? "dark:bg-white bg-black" : "dark:bg-white/30 bg-black/70"}`}
          />
        ))}
      </div> */}
    </div>
  )
}