"use client";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

const mockMessages = {
  "Alice Johnson": [
    { sender: "Alice Johnson", text: "Hey there!" },
    { sender: "You", text: "Hi Alice!" },
  ],
  "Bob Smith": [
    { sender: "Bob Smith", text: "Are you coming today?" },
    { sender: "You", text: "Yes, on my way!" },
  ],
  "Carol Davis": [
    { sender: "Carol Davis", text: "Meeting at 4pm." },
    { sender: "You", text: "Got it!" },
  ],
  "David Wilson": [
    { sender: "David Wilson", text: "What's up?" },
    { sender: "You", text: "All good!" },
  ],
};

const MessagesTab = () => {
  const [activeUser, setActiveUser] = useState<string | null>(null);

  return (
    <div className="p-6 h-[calc(100vh-80px)]">
      <h2 className="text-2xl font-bold mb-4 ml-14 lg:ml-0">Messages</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card shadow-xl h-full dark:bg-black/90 bg-primary-50 overflow-y-auto">
            <div className="card-body">
              <h3 className="card-title mb-4">Conversations</h3>
              <div className="space-y-2">
                {Object.keys(mockMessages).map((name) => (
                  <div
                    key={name}
                    className={`flex items-center space-x-3 p-2 rounded cursor-pointer hover:bg-primary-500 hover:text-white ${
                      activeUser === name
                        ? "bg-primary-500 text-white"
                        : "dark:hover:bg-primary-600"
                    }`}
                    onClick={() => setActiveUser(name)}
                  >
                    <div className="avatar placeholder w-10 h-10">
                      <div className="rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-white">
                        {name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{name}</div>
                      <div className="text-xs opacity-70">
                        {mockMessages[name].at(-1)?.text || "Last message..."}
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
          <div className="card shadow-xl h-full dark:bg-black/90 bg-primary-50 flex flex-col">
            <div className="card-body flex flex-col h-full">
              <h3 className="card-title mb-4">
                {activeUser ? activeUser : "Chat"}
              </h3>

              {activeUser ? (
                <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[400px] pr-2">
                  {mockMessages[activeUser].map((msg, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-lg max-w-[70%] text-sm ${
                        msg.sender === "You"
                          ? "ml-auto bg-primary-500 text-white"
                          : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-800 dark:text-gray-400">
                  <MessageCircle className="w-12 h-12 mr-3" />
                  <p>Select a conversation to start messaging</p>
                </div>
              )}

              {/* Input field (optional, not functional for mock) */}
              {activeUser && (
                <div className="mt-4 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    disabled
                  />
                  <button className="bg-primary-500 text-white px-4 py-2 rounded-lg">
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesTab;
