import { ArrowLeft, Check, CheckCheck, ChevronDown, LucideUser, MessageCircleX, MessageSquare, Send, Trash2, UserRoundPen, X} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import FileUpload from "./FileUplod";
import { asyncHandlerFront } from "@/utils/FrontAsyncHandler";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/api-client";
import { IChat } from "@/server/Models/Chat.models";
import { useDebounceCallback } from "usehooks-ts";
import Image from "next/image";
import { useSocket } from "@/app/context/SocketContext";
import { useUser } from "@/app/context/userContext";

function SidebarSkelton() {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside className="h-full w-20 lg:w-72 border-gray-200 flex flex-col transition-all duration-200">
      <div className="overflow-y-auto w-full py-3 space-y-3">
        {skeletonContacts.map((_, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 px-3 py-2">
            <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse flex-shrink-0" />

            <div className="hidden lg:flex flex-col gap-2 flex-1">
              <div className="h-4 w-48 bg-gray-300 rounded animate-pulse" />
              <div className="h-3 w-28 bg-gray-300 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}




const MessagesTab = () => {
  const { setValue, watch } = useForm({
  })

  const [activeUser, setActiveUser] = useState({
    _id: "",
    userName: '',
    profilePic: '',
  });
  const [users, setUsers] = useState<IChat[]>([]);
  const [search, setSearch] = useState<string | null>('');
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounced = useDebounceCallback((val: string) => {setDebouncedSearch(val)}, 500);

  const [messages, setMessages] = useState<Map<string, any>>(new Map());
  const [messageInput, setMessageInput] = useState("");
  const [menuMessageId, setMenuMessageId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showChat, setShowChat] = useState(false);
  
  const { onlineUsers, socket } = useSocket();
  const { user } = useUser();

  useEffect(() => {
    const searchUser = async () => {
      if(debouncedSearch){
        setLoading(true);
        await asyncHandlerFront(
          async () => {
            const response = await apiClient.searchUserChat(debouncedSearch);
            setUsers(response as any)
          },
          (error) => {
            toast.error(error.message || "Something went wrong");
          }
        )
        setLoading(false);
      }
    };

    searchUser();
  }, [debouncedSearch])


  useEffect(() => {
    const getAllUsers = async() => {
      setLoading(true);
      await asyncHandlerFront(
        async() => {
          const response = await apiClient.sidebarUsers();
          setUsers(response as any);
        },
        (error) => {
          toast.error(error.message || "Something went wrong");
        }
      )
      setLoading(false);
    }
    getAllUsers()
  }, [])


  const getMessage = async() => {
    asyncHandlerFront(
      async () => {
        const response:any = await apiClient.getMsg(activeUser?._id);
        const messageMap = new Map(
          response?.map((msg:any) => [msg?._id, msg])
        )
        setMessages(messageMap as any);
      },
      (error) => {
        toast.error(error.message || "Something went wrong");
      }
    )
  }

  useEffect(() => {
    activeUser?._id && getMessage()
  }, [activeUser?._id])




  // 📥 Receive real-time message
  useEffect(() => {
    socket?.on("newMessage", (data) => {
      const tempId = `temp-${Date.now()}`;
      setMessages(prev => {
        const updated = new Map(prev);
        updated.set(tempId, data)
        return updated;
      })
    });

    socket?.on("deleteMsg", (deletedMessageId: string) => {
      if (!deletedMessageId) return;
      setMessages(prev => {
        if (!prev.has(deletedMessageId)) return prev;
        const updated = new Map(prev);
        updated.delete(deletedMessageId);
        return updated;
      });
    });


    socket?.on("editMsg", (payload) => {
      setMessages(prev => {
        if(!prev.has(payload?._id)) return prev;
        const updated = new Map(prev);
        updated.set(payload?._id, {
          ...updated.get(payload?._id),
          message: payload?.message
        });
        return updated;
      })
    });

    
    socket?.on("startTyping", (receiver: string) => {
      setTypingUsers([...typingUsers, receiver])
    });


    socket?.on("stopTyping", (receiver: string) => {
      setTypingUsers((prev) => prev.filter((id) => id !== receiver));
    });


    socket?.on("seenMsg", (senderId: string) => {
      if (!senderId) return;
      setMessages(prevMessages => {
        let hasChanged = false;
        const updated = new Map(prevMessages)
        updated.forEach(msg => {
          if (msg.sender === senderId && !msg.seen) {
            updated.set(msg?._id, { ...msg, seen: true });
            hasChanged = true;
          }
          return msg;
        });

        return hasChanged ? updated : prevMessages;
      });
    });


    return () => {
      socket?.off("newMessage");
      socket?.off("deleteMsg");
      socket?.off("editMsg");
      socket?.off("startTyping");
      socket?.off("stopTyping");
    };
  }, [socket]);


  
  // 📤 Send message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeUser._id) return;
    const tempId = `temp-${Date.now()}`;
    const payload = {
      sender: activeUser?._id,
      receiver:  user?._id,
      message: messageInput,
    };

    socket?.emit("message", payload);
    setMessages(prev => {
        const updated = new Map(prev)
        updated.set(tempId, payload)
        return updated
      } 
    )
    setMessageInput("");
  };


  const handleDelete = async(messageId:string) => {
    const payload = {
      _id: messageId,
      receiver: user?._id
    }
    socket?.emit("delete", payload);
    setMessages(prev => {
      const deleteMap = new Map(prev)
      deleteMap.delete(messageId)
      return deleteMap
    })
  };


  const handleUpdate = async(messageId:string, message:string) => {
    const payload = {
      _id: messageId,
      message,
      sender: activeUser?._id,
      receiver: user?._id
    }
    socket?.emit("edit", payload);
      setMessages((prev) => {
        if(!prev.has(messageId)) return prev;
        const updated = new Map(prev);
        updated.set(messageId, {
          ...updated.get(messageId),
          message
        });
        return updated;
      })
    setEditingMessageId(null);
    setEditedText("");
    setMenuMessageId(null);
  };


  const handleTyping = () => {
    if(!socket || !activeUser?._id) return;
    if(messageInput.trim().length > 0){
      if(!user?._id) return;
      let receiver =  user?._id;
      socket.emit("startTyping", receiver);
      setTypingUsers(prev => [...prev, receiver]);

      setTimeout(() => {
        socket.emit("stopTyping",  receiver)
      }, 1000);

    };
  };

  const handleSeen = () => {
    if(user?._id) socket?.emit("seenMsg", user?._id)
  }

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  
  return (
    <div className="p-6 h-[calc(100vh-80px)]">
      <h2 className="text-2xl font-bold mb-4 ml-14 lg:ml-0">Messages{activeUser?.userName && `/${activeUser?.userName?.charAt(0)?.toUpperCase() + activeUser.userName?.slice(1)}`}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        {/* Sidebar */}
        <div className={`${showChat ? "hidden" : "block"} lg:block lg:col-span-1`}>
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-md border border-gray-200 h-full overflow-y-auto">
            <div className="card-body">
              <h3 className="card-title mb-4">Conversations</h3>
              <div className="relative w-full mb-4">
                <input
                  type="text"
                  value={search as string}
                  onChange={(e) =>{ debounced(e.target.value), setSearch(e.target.value);}}
                  placeholder="Search a user..."
                  className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none transition"
                />
                {search && (
                  <button
                    onClick={() => {
                      setSearch("");
                      debounced("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                    <X size={18} />
                  </button>
                )}
              </div>
            {loading ? <SidebarSkelton /> : <div className="space-y-2">
              {users?.map((users: any) => {
                const isActive = activeUser?._id === users?.userId || users?._id;
                const formatTime = (dateString: string) => {
                  const date = new Date(dateString);
                  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                };
                return (
                  <div
                    key={users?.userId || users?._id}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md"
                        : "hover:bg-white/60 hover:shadow-sm"
                    }`}
                    onClick={() => {
                      setActiveUser({
                        _id: users?.userId || users?._id,
                        userName: users?.userName,
                        profilePic: users.profilePic
                      });
                      socket?.emit("joinRoom", users?.userId || users?._id);
                      handleSeen();
                      setShowChat(true);
                    }}>
                    {/* Left Section: Avatar + Name + Last Message */}
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={users.profilePic}
                          alt="profilePic"
                          width={48}
                          height={48}
                          className="object-cover w-full h-full rounded-full border border-gray-200"
                        />
                        {onlineUsers?.includes( users?.userId || users?._id) && (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="font-semibold truncate">{users?.userName?.charAt(0)?.toUpperCase() + users?.userName?.slice(1)}</div>
                        <div className={`text-sm truncate ${isActive ? "text-white/80" : "text-gray-500"}`}>
                          {users?.latestMessage?.length
                            ? users.latestMessage.slice(0, 25) + "..."
                            : users.latestMessage || "No messages yet"}
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Time */}
                    <div className={`text-xs ${isActive ? "text-white/80" : "text-gray-400"}`}>
                      {formatTime(users.createdAt)}
                    </div>
                  </div>
                );
              })}
            </div>}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${showChat ? "block" : "hidden"} lg:block lg:col-span-2`}>
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-md border border-gray-200 h-full flex flex-col">
          {activeUser?.userName && <div className="p-3 border-b border-gray-200 flex items-center justify-between">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-x-3">
                  <button 
                  className="lg:hidden p-2 rounded-full hover:bg-gray-200"
                  onClick={() => setShowChat(false)} // This will hide chat and show sidebar
                >
                  <ArrowLeft />
                </button>
                <div className="avatar">
                    <div className="avatar placeholder w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                      <Image src={activeUser?.profilePic} alt="profilePic" width={40} height={40} className="object-cover w-full h-full" />
                    </div>
                </div>

                <div>
                  <h3 className="font-medium">{activeUser?.userName?.charAt(0)?.toUpperCase() + activeUser?.userName?.slice(1)}</h3>
                  <p className="text-sm text-gray-500">
                    {onlineUsers?.includes(activeUser?._id)? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              
              <button onClick={() => {
                  socket?.emit("leaveRoom", activeUser?._id);
                  socket?.off("seenMsg", activeUser?._id as any);
                  setActiveUser({ _id: "", userName: "", profilePic: "" });
                  setShowChat(false)
                }} className='cursor-pointer'> <MessageCircleX /> 
              </button>
            </div>
          </div>}
            <div className="card-body flex flex-col h-full">
              {activeUser?.userName ? (
                <div ref={chatContainerRef} className="flex-1 flex flex-col gap-2 overflow-y-auto pr-2 max-h-[calc(100vh-300px)]">
                  {Array.from(messages.values()!)?.map((msg, i) => {
                    const isOwn = msg?.sender !== user?._id;
                  return (
                    <div
                      key={i}
                      className={`flex items-end gap-2 group ${ isOwn ? "justify-end" : "justify-start"}`}>
                      <div className={`relative max-w-[75%]`}>
                        <div
                            className={`px-3 pt-2 rounded-xl text-sm shadow-md break-words flex ${
                              isOwn
                              ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-br-none"
                              : "bg-gray-100 text-gray-800 rounded-bl-none"
                            }`}>
                            
                            {editingMessageId === msg._id ? (
                              <div className="flex items-center gap-2 w-full">
                                <input
                                  type="text"
                                  value={editedText}
                                  onChange={(e) => setEditedText(e.target.value)}
                                  className="bg-transparent outline-none border-b border-gray-400 text-sm flex-1"
                                  autoFocus
                                />
                                <button
                                  onClick={() => {
                                    console.log('Save edited message:', editedText);
                                    handleUpdate(msg._id, editedText);
                                  }}
                                  className="text-xs px-1.5 py-1 mb-0.5 text-white rounded hover:bg-gray-400 transition cursor-pointer">
                                  <Check size={18} />
                                </button>
                                <button
                                  onClick={() => {
                                    console.log('Save edited message:', editedText);
                                    handleUpdate(msg._id, editedText);
                                  }}
                                  className="text-xs px-1.5 py-1 mb-0 text-white rounded hover:bg-gray-400 transition cursor-pointer">
                                  <X size={18} />
                                </button>
                              </div>
                            ) : (
                              <>
                                  {msg.video && (
                                    <video
                                      controls
                                      className="rounded-lg max-w-64 mb-2">
                                      <source src={msg.video} type="video/mp4" />
                                    </video>
                                  )}

                                  {msg.image && (
                                    <img src={msg.image} alt="Sent image"className="rounded-lg max-w-64 mb-2" />
                                  )}

                                  {msg.message && (
                                    <p className=" text-sm whitespace-pre-line">
                                      {msg.message}
                                    </p>
                                  )}

                                  {isOwn && (
                                    <div className="flex justify-end mt-1"> <CheckCheck size={16} className={`ml-1 ${msg.seen ? 'text-[#00a6ff]' : 'text-gray-400'}`} />
                                    </div>
                                  )}
                              </>
                            )}

                            {isOwn && (
                              <div className="relative group ml-2">
                                <button
                                  onClick={() => setMenuMessageId(msg._id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform hover:translate-y-1">
                                 {!editingMessageId && <ChevronDown size={18} className="text-gray-500 cursor-pointer hover:text-black dark:hover:text-white transition-transform duration-200" /> }
                                </button>

                                {menuMessageId === msg._id && (
                                  <div className="absolute top-7 right-0 z-20 bg-gray-800 rounded-lg shadow-xl w-32 animate-fade-in-up p-2">
                                    <button
                                      onClick={() => {
                                        setEditedText(msg.message);
                                        setEditingMessageId(msg._id);
                                        setMenuMessageId(null);
                                      }}
                                      className="rounded-md cursor-pointer w-full flex gap-2 items-center px-4 py-2 text-left text-sm hover:bg-gray-400 transition-colors">
                                      <UserRoundPen size={17} /> Edit
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleDelete(msg._id);
                                        setMenuMessageId(null);
                                      }}
                                      className="rounded-md cursor-pointer w-full flex gap-1 items-center px-4 py-2 text-left text-sm transition-colors hover:bg-[#9c3e41]">
                                      <Trash2 size={17} /> Delete
                                    </button>
                                    <button
                                      onClick={() => setMenuMessageId(null)}
                                      className="rounded-md cursor-pointer w-full px-4 py-2 text-left text-sm hover:bg-gray-400 transition-colors">
                                      ❌ Cancel
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                      </div>
                    </div>
                  );
                })}
                </div>
              ) : (
                 <div className="hidden w-full md:flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
                    <div className="max-w-md text-center space-y-6">
                      <div className="flex justify-center gap-4 mb-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
                            <MessageSquare className="w-8 h-8 text-primary " />
                          </div>
                        </div>
                      </div>

                      <h2 className="text-2xl font-bold">Welcome to Chatty!</h2>
                      <p className="text-base-content/60"> Select a conversation from the sidebar to start chatting </p>
                    </div>
                  </div>
              )}

              { activeUser?.userName && <div className="mt-4 flex flex-col gap-x-2">
                {typingUsers.includes(activeUser._id) && (
                  <div className="flex items-center space-x-2 px-2 pb-1">
                    <span className="text-sm text-gray-500">Typing</span>
                    <div className="flex space-x-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
                    </div>
                  </div>
                )}
                
                {watch("image") && (
                  <div className="relative w-[150px] h-[100px] rounded-lg overflow-hidden mb-1">
                    <img
                      src={watch("image")}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center gap-1 flex-wrap sm:flex-nowrap">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => {
                        setMessageInput(e.target.value);
                        handleTyping();
                      }}
                      placeholder="Type a message..."
                      className="flex-1 min-w-[150px] px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none transition"
                    />

                    <button
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-2 rounded-full shadow hover:shadow-lg transition cursor-pointer"
                    >
                      <Send size={19} />
                    </button>

                    <FileUpload
                      fileType="image"
                      onSuccess={(res) => setValue("image", res.url)}
                    />
                  </div>

              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesTab;