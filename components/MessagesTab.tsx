  // const [isTyping, setIsTyping] = useState(false);





  
  //   useEffect(() => {
  //   if (!socket || !activeUser?._id) return;

  //   socket.emit("joinRoom", activeUser?._id); 

  //   console.log(activeUser?._id);

  //   socket.on("userStartTyping", ({ userId }) => {
  //     console.log(userId, "userrrrrrrrrrrrrrrr")
  //     socket.emit("joinRoom", { chatId: activeUser?._id });
  //     setTypingUsers((prev) =>
  //       prev.includes(userId) ? prev : [...prev, userId]
  //     );
  //   });

  //   socket.on("userStopTyping", ({ userId }) => {
  //     setTypingUsers((prev) => prev.filter((id) => id !== userId));
  //   });

  //   return () => {
 
  //     socket.emit("leaveRoom", { chatId: activeUser._id });
  //   };
  // }, [socket]);


    // const { id } = useParams();
  // const { data: session} = useSession();
  // const sender = id as string;
  // const onsubmit = async(info: z.infer<typeof messageSchema>) => {
  //   const { message, image } = info;
  //   const payload: Partial<typeof info> & {
  //     sender: string;
  //     receiver: string;
  //   } = {
  //     ...(message.trim() && { message }),
  //     ...(image && { image }),
  //     sender,
  //     receiver: session?.user?._id as string,
  //   }

  //   await asyncHandlerFront(
  //     async() => {
  //       await apiClient.createMsg(payload as any);
  //       reset();
  //     },
  //     (error) => {
  //       toast.error(error.message || "Something went wrong");
  //     }
  //   )
  // }
  // const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  // import { zodResolver } from "@hookform/resolvers/zod";
  // import { z } from "zod";
  // import { messageSchema } from "@/schemas/messageSchema";


  
   
  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth < 1024);
  //   };

  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);



import { Check, CheckCheck, ChevronDown, MessageCircleX, MessageSquare, Send, Trash, Trash2, UserRoundPen, X} from "lucide-react";
import { useEffect, useState } from "react";
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


const MessagesTab = () => {

  const { setValue, watch } = useForm({
    // defaultValues: {
    //   image: "",
    // }
  })

  const [activeUser, setActiveUser] = useState({
    _id: "",
    userName: '',
    profilePic: '',
  });
  const [users, setUsers] = useState<IChat>();
  
  const [search, setSearch] = useState<string | null>('');
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounced = useDebounceCallback((val: string) => {
    setDebouncedSearch(val);
  }, 500);

  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");

  const { onlineUsers, socket } = useSocket();
  const { user } = useUser();

  const [menuMessageId, setMenuMessageId] = useState<string | null>(null);

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // console.log("onlineUsers:-",onlineUsers);

  useEffect(() => {
    const searchUser = async () => {
      if(debouncedSearch){
        await asyncHandlerFront(
          async () => {
            const response = await apiClient.searchUserChat(debouncedSearch);
            setUsers(response)
          },
          (error) => {
            toast.error(error.message || "Something went wrong");
          }
        )
      }
    };

    searchUser();
  }, [debouncedSearch])


  useEffect(() => {
    const getAllUsers = async() => {
      await asyncHandlerFront(
        async() => {
          const response = await apiClient.sidebarUsers();
          setUsers(response);
        },
        (error) => {
          toast.error(error.message || "Something went wrong");
        }
      )
    }
    getAllUsers()
  }, [])


  const getMessage = async() => {
    asyncHandlerFront(
      async () => {
        const response = await apiClient.getMsg(activeUser?._id);
        setMessages(response as any);
      },
      (error) => {
        toast.error(error.message || "Something went wrong");
      }
    )
  }

  useEffect(() => {
    activeUser?._id && getMessage()
  }, [activeUser?._id])

  // console.log(users);

  // 📤 Send message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeUser._id) return;

    const payload = {
      sender: activeUser._id,
      receiver:  user?._id,
      message: messageInput,
    };

    socket?.emit("message", payload);
    setMessages((prev) => [...prev, { ...payload, sender: activeUser?._id }]);
    setMessageInput("");
  };

  // 📥 Receive real-time message
  useEffect(() => {
    socket?.on("newMessage", (data) => {
      // console.log(data, "data-:")
      setMessages((prev) => [...prev, data]);
    });

    socket?.on("deleteMsg", (deletedMessageId: string) => {
      // console.log(deletedMessageId, "deleted")
      setMessages((prev) => prev.filter((msg) => msg.sender !== deletedMessageId));
    });

    socket?.on("editMsg", (payload) => {
      setMessages(prev => 
        prev.map((msg) => 
          msg?.sender === payload?.sender ? {...msg, message:payload?.message} : msg
        ) 
      )
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
        const updatedMessages = prevMessages.map(msg => {
          if (msg.sender === senderId && !msg.seen) {
            hasChanged = true;
            return { ...msg, seen: true };
          }
          return msg;
        });

        return hasChanged ? updatedMessages : prevMessages;
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


  
  const handleDelete = async(messageId:string) => {
    const payload = {
      _id: messageId,
      messageId: activeUser?._id,
      receiver: user?._id
    }
    // console.log(payload)
    socket?.emit("delete", payload);
    setMessages((prev) => prev.filter((msg) => msg?._id !== messageId))
  };


  const handleUpdate = async(messageId:string, message:string) => {
    const payload = {
      _id: messageId,
      message,
      sender: activeUser?._id,
      receiver: user?._id
    }
    socket?.emit("edit", payload);
    setMessages((prev) => 
      prev.map((msg) =>
        msg?._id === messageId ? {...msg, message} : msg
      )
    )
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




  // console.log(messages);

  
  return (
    <div className="p-6 h-[calc(100vh-80px)]">
      <h2 className="text-2xl font-bold mb-4 ml-14 lg:ml-0">Messages{activeUser?.userName && `/${activeUser?.userName?.charAt(0).toUpperCase() + activeUser.userName?.slice(1)}`}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        {/* Sidebar */}
        <div className="lg:col-span-1">
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
              <div className="space-y-2">
                {users?.map((name:any) => (
                  <div
                    key={name}
                    className={`flex items-center space-x-3 p-2 rounded-xl cursor-pointer transition-all ${
                      activeUser === name
                        ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md"
                        : "hover:bg-white/60 hover:shadow-sm"
                    }`}
                    onClick={() => {
                      setActiveUser({...activeUser, userName: name?.userName, profilePic: name.profilePic, _id: name?._id});
                      socket?.emit("joinRoom", name?._id);
                      handleSeen();
                    }}>
                    <div className="relative w-10 h-10">
                      <Image
                        src={name.profilePic}
                        alt="profilePic"
                        width={40}
                        height={40}
                        className="object-cover w-full h-full rounded-full border border-gray-200"
                      />
                      {onlineUsers?.includes(name._id) && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-1 border-white rounded-full" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{name?.userName.charAt(0).toUpperCase() + name?.userName.slice(1)}</div>
                      <div className="text-xs opacity-70">
                        {/* {mockMessages[name].at(-1)?.text || "Last message..."} */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-md border border-gray-200 h-full flex flex-col">
          {activeUser?.userName && <div className="p-3 border-b border-gray-200 flex items-center justify-between">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-x-3">
                <div className="avatar">
                    <div className="avatar placeholder w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                      <Image src={activeUser?.profilePic} alt="profilePic" width={40} height={40} className="object-cover w-full h-full" />
                    </div>
                </div>

                <div>
                  <h3 className="font-medium">{activeUser.userName.charAt(0).toUpperCase() + activeUser.userName.slice(1)}</h3>
                  <p className="text-sm text-gray-500">
                    {onlineUsers?.includes(activeUser?._id)? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              
              <button onClick={() => {
                  socket?.emit("leaveRoom", activeUser?._id);
                  socket?.off("seenMsg", activeUser?._id as any);
                  setActiveUser({ _id: "", userName: "", profilePic: "" });
                }} className='cursor-pointer'> <MessageCircleX /> 
              </button>
            </div>
          </div>}
            <div className="card-body flex flex-col h-full">
              {activeUser?.userName ? (
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto h-auto pr-2">
                  {messages?.map((msg, i) => {
                  const isOwn = msg.sender !== user?._id;
                  return (
                    <div
                      key={i}
                      className={`flex items-end gap-2 group ${ isOwn ? "justify-end" : "justify-start"}`}>

                      {/* {!isOwn? <img
                        src={activeUser?.profilePic}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      /> : ""} */}

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
                                  className="text-xs px-1.5 py-1 mb-0.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                                  <Check />
                                </button>
                                <button
                                  onClick={() => {
                                    console.log('Save edited message:', editedText);
                                    handleUpdate(msg._id, editedText);
                                  }}
                                  className="text-xs px-1.5 py-1 mb-0.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                                  <X />
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

                                  {/* Text */}
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
                                  <div className="absolute top-7 right-0 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-32 animate-fade-in-up p-2">
                                    <button
                                      onClick={() => {
                                        setEditedText(msg.message);
                                        setEditingMessageId(msg._id);
                                        setMenuMessageId(null);
                                      }}
                                      className="rounded-md cursor-pointer w-full flex gap-2 items-center px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
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
                                      className="rounded-md cursor-pointer w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                      ❌ Cancel
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                      </div>

                      {/* {isOwn && (
                        <img
                          src={activeUser?.profilePic}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full object-cover border"
                        />
                      )} */}
                    </div>
                  );
                })}
                </div>
              ) : (
                 <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
                    <div className="max-w-md text-center space-y-6">
                      <div className="flex justify-center gap-4 mb-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
                            <MessageSquare className="w-8 h-8 text-primary " />
                          </div>
                        </div>
                      </div>

                      <h2 className="text-2xl font-bold">Welcome to Chatty!</h2>
                      <p className="text-base-content/60">
                        Select a conversation from the sidebar to start chatting
                      </p>
                    </div>
                  </div>
              )}

              { activeUser?.userName && <div className="mt-4 flex flex-col gap-x-2">
                {/* 👇 Typing indicator */}
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

                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => {
                      setMessageInput(e.target.value);
                      handleTyping()
                    }}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none transition"
                    />
                  <button onClick={handleSendMessage} className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-2 rounded-full shadow hover:shadow-lg transition">
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