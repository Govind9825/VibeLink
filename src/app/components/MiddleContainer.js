"use client";

import Image from "next/image";
import EmojiPicker from "emoji-picker-react";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { HeroHighlight } from "@/components/ui/hero-highlight";

export default function ChatLayout() {
  const [emojiVisible, setEmojiVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [chatUsername, setChatUsername] = useState("");
  const [chatEmail, setChatEmail] = useState("");
  const [showSetting, setShowSetting] = useState(false);
  const [chats, setChats] = useState([]);

  const [infoHeight, setInfoHeight] = useState("8vh");
  const [infoExpanded, setInfoExpanded] = useState(false);

  const [imagesHeight, setImagesHeight] = useState("8vh");
  const [imagesExpanded, setImagesExpanded] = useState(false);

  const [pinnedHeight, setPinnedHeight] = useState("8vh");
  const [pinnedExpanded, setPinnedExpanded] = useState(false);

  const [fileHeight, setFileHeight] = useState("8vh");
  const [fileExpanded, setFileExpanded] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io("http://localhost:3001", {
      withCredentials: true,
      transports: ["websocket"],
    });

    // Emit 'join room' event
    socketRef.current.emit("join room", sessionStorage.getItem("email"));

    // Listen for private messages
    socketRef.current.on("receive private message", (msg) => {
      loadchat(sessionStorage.getItem("chat-email"));
    });

    // Handle session storage changes
    const originalSetItem = sessionStorage.setItem;
    sessionStorage.setItem = function (key, value) {
      originalSetItem.apply(this, arguments);
      updateChatInfo();
      loadchat(sessionStorage.getItem("chat-email"));
    };

    // Cleanup function
    return () => {
      socketRef.current.off("receive private message");
      sessionStorage.setItem = originalSetItem;
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the chat container when chats change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

  const updateChatInfo = () => {
    setChatUsername(sessionStorage.getItem("chat-username") || "");
    setChatEmail(sessionStorage.getItem("chat-email") || "");
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const msg = {
        from: sessionStorage.getItem("email"),
        to: chatEmail,
        message,
      };

      if (socketRef.current) {
        socketRef.current.emit("send private message", msg);
        setMessage("");
      } else {
        console.error("Socket is not defined");
      }
    }
  };

  const loadchat = async (useremail) => {
    try {
      const email = sessionStorage.getItem("email");
      if (!email || !useremail)
        throw new Error("Email or useremail is missing");

      const response = await fetch("http://localhost:3001/messages", {
        method: "GET",
        headers: { "Content-Type": "application/json", email, useremail },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Something went wrong");
      }

      const result = await response.json();
      socketRef.current.emit("join room", useremail);
      setChats(result);
      // console.log(chats)
    } catch (error) {
      console.error("Error loading chat:", error.message);
    }
  };

  const handleEmojiVisibility = () => {
    setEmojiVisible((prev) => !prev);
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setEmojiVisible(false);
  };

  const handleSignOut = async () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  const handleSetting = () => {
    setShowSetting(!showSetting);
  };

  const handleClick = (item) => {
    switch (item) {
      case "info":
        setInfoExpanded(!infoExpanded);
        setInfoHeight(infoExpanded ? "8vh" : "20vh");
        break;
      case "images":
        setImagesExpanded(!imagesExpanded);
        setImagesHeight(imagesExpanded ? "8vh" : "20vh");
        break;
      case "file":
        setFileExpanded(!fileExpanded);
        setFileHeight(fileExpanded ? "8vh" : "20vh");
        break;
      case "pinned":
        setPinnedExpanded(!pinnedExpanded);
        setPinnedHeight(pinnedExpanded ? "8vh" : "20vh");
        break;
      default:
        break;
    }
  };

  const handleCloseChat = () => {
    sessionStorage.removeItem("chat-username");
    sessionStorage.removeItem("chat-email");
    setShowSetting(false);
    updateChatInfo();
  };


  const [showDeleteId, setShowDeleteId] = useState(null);

  const handleDelete = async (id) => {
    const response = await fetch(`http://localhost:3001/deleteMsg/${id}`, {
      method: 'DELETE',
    });

    loadchat(sessionStorage.getItem("chat-email"))
    setShowDeleteId(null);
  }

  if (chatUsername) {
    return (
      <HeroHighlight>
        <div className="flex h-[95vh]">
          {/* Left/Middle Container */}
          <div className="flex flex-col h-full w-[40vw] ">
            <div className="flex h-[7vh] items-center mt-4 pl-4">
              <div className="flex items-center">
                <div className="h-[7vh] w-[7vh] rounded-full bg-transparent border-black border-2 flex items-center justify-center">
                  <Image
                    src="/images/user.png"
                    alt="User Icon"
                    width={28}
                    height={28}
                    className="h-7 w-7 cursor-pointer"
                  />
                </div>
                <div className="mx-4 text-white font-extrabold w-[10vw] ">
                  {chatUsername}
                </div>
                <div className="flex items-center ml-[12vw] space-x-4">
                  <svg
                    class="w-6 h-6 text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M14 7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7Zm2 9.387 4.684 1.562A1 1 0 0 0 22 17V7a1 1 0 0 0-1.316-.949L16 7.613v8.774Z"
                      clip-rule="evenodd"
                    />
                  </svg>

                  <svg
                    class="w-6 h-6 text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.978 4a2.553 2.553 0 0 0-1.926.877C4.233 6.7 3.699 8.751 4.153 10.814c.44 1.995 1.778 3.893 3.456 5.572 1.68 1.679 3.577 3.018 5.57 3.459 2.062.456 4.115-.073 5.94-1.885a2.556 2.556 0 0 0 .001-3.861l-1.21-1.21a2.689 2.689 0 0 0-3.802 0l-.617.618a.806.806 0 0 1-1.14 0l-1.854-1.855a.807.807 0 0 1 0-1.14l.618-.62a2.692 2.692 0 0 0 0-3.803l-1.21-1.211A2.555 2.555 0 0 0 7.978 4Z" />
                  </svg>
                </div>
                <div className="">
                  <button onClick={handleSetting}>
                    <div className="flex items-center ml-[1vw] space-x-2">
                      <div className="bg-black w-px h-[4vh]"></div>
                      <Image
                        src="/images/settings (1).png"
                        alt="Settings Icon"
                        width={16}
                        height={16}
                        className="h-4 w-4 mt-[1vh] cursor-pointer"
                      />
                    </div>
                  </button>
                  {showSetting && (
                    <div className="absolute ml-[1vw] mt-2 w-32 bg-white border border-gray-300 rounded shadow-lg z-50">
                      <ul className="py-2">
                        <li>
                          <button
                            onClick={handleCloseChat}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            Close Chat
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <hr className="border-t-2 border-gray-300 w-[90%] m-auto mt-2" />
            <div className="messages my-8 mx-4 overflow-y-auto h-[65vh] hide-scrollbar">
              {chats.map((chat, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    chat.from !== chatEmail ? "justify-end" : "justify-start"
                  }`}
                >
                  {showDeleteId === chat._id && ( // Show delete confirmation only for the current chat message
                    <div className=" ml-[1vw] mx-2 bg-white border border-gray-300 rounded shadow-lg z-50">
                      <ul className="py-2">
                        <li>
                          <button
                            onClick={() => handleDelete(chat._id)}
                            className="w-full text-left  px-4 text-gray-700 hover:bg-gray-100"
                          >
                            🗑️
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                  {chat.from !== chatEmail && (
                    <div className="flex items-center space-x-2">
                      <div className="bg-blue-400 text-white break-words rounded-md p-2 max-w-[20vw]">
                        {chat.message}
                      </div>
                      <Image
                        src="/images/user.png"
                        alt="User Icon"
                        width={28}
                        height={28}
                        className="h-4 w-4 cursor-pointer"
                        onClick={() =>
                          setShowDeleteId(
                            showDeleteId === chat._id ? null : chat._id
                          )
                        } // Toggle delete confirmation for this specific chat
                      />
                    </div>
                  )}
                  

                  {chat.from === chatEmail && (
                    <div className="flex items-center space-x-2 ">
                      <Image
                        src="/images/user.png"
                        alt="User Icon"
                        width={28}
                        height={28}
                        className="h-4 w-4 cursor-pointer"
                      />
                      <div className="bg-gray-400 text-white break-words rounded-md p-2 max-w-[20vw]">
                        {chat.message}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {/* Invisible div to trigger scroll into view */}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-white w-[90%] h-[8vh] ml-6 my-4 flex items-center">
              <div className="bg-gray-400 ml-2 h-[5.5vh] w-[6vh] flex items-center justify-center">
                <Image
                  src="/images/plus-solid.svg"
                  alt="Plus Icon"
                  width={16}
                  height={16}
                  className="h-6 w-6 cursor-pointer"
                />
              </div>
              <div className="w-[70%] h-[6vh] flex rounded-md text-gray-400">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter Your Text here"
                  className="w-full h-[6vh] rounded-md pl-4 border-none focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      handleSendMessage(sessionStorage.getItem("chat-email"));
                  }}
                />
              </div>
              <div className="h-[5.5vh] flex items-center justify-end ml-[10vw]">
                <button
                  onClick={handleEmojiVisibility}
                  className="focus:outline-none"
                >
                  <Image
                    src="/images/emoji.svg"
                    alt="Emoji Icon"
                    width={20}
                    height={20}
                    className="h-[40px] w-[40px]"
                  />
                </button>
                {emojiVisible && (
                  <div className="absolute bottom-0 right-[1vw] mb-[15vh] w-[52vw]">
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      search
                      emojiStyle="google"
                    />
                  </div>
                )}
              </div>
              <div className="h-[5.5vh] w-[7vw] flex items-center mr-[1vw] justify-end">
                <button onClick={handleSendMessage}>
                  <Image
                    src="/images/send.svg"
                    alt="Send Icon"
                    width={16}
                    height={16}
                    className="h-6 w-6 cursor-pointer"
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white w-[0.5px] h-[95vh]"></div>
          <div className="r h-[95vh] w-[22vw] flex-col justify-center">
            <div className="bg-white h-[22vh] w-[17vw] ml-8 mt-10 rounded-lg flex flex-col justify-center items-center shadow-lg shadow-gray-400">
              <div className="h-[7vh] w-[7vh] rounded-full bg-transparent border-black border-2 flex items-center justify-center">
                <Image
                  src="/images/user-solid.svg"
                  alt="User Icon"
                  width={20}
                  height={20}
                  className="h-7 w-7 cursor-pointer"
                />
              </div>
              <div>
                <div className="text-black font-semibold px-4 text-center my-2">
                  {chatUsername}
                </div>
                <div className="text-gray-400 font-bold text-sm px-4 text-center">
                  {chatEmail}
                </div>
              </div>
            </div>
            <div className="w-[20vw] mt-4 h-[60vh] overflow-y-auto overflow-x-hidden hide-scrollbar">
              <button onClick={() => handleClick("info")}>
                <div
                  className="bg-white w-[17vw] ml-8 mt-5 rounded-lg text-black p-3 font-bold flex justify-between shadow-lg shadow-gray-400"
                  style={{ height: infoHeight }}
                >
                  Information
                  <div className="flex items-center justify-end h-[5.5vh] w-[12vh]">
                    <Image
                      src="/images/drop.svg"
                      alt="Drop Icon"
                      width={16}
                      height={16}
                      className="h-6 w-6 cursor-pointer -mt-3"
                    />
                  </div>
                </div>
              </button>
              <button onClick={() => handleClick("images")}>
                <div
                  className="bg-white w-[17vw] ml-8 mt-5 rounded-lg text-black p-3 font-bold flex justify-between shadow-lg shadow-gray-400"
                  style={{ height: imagesHeight }}
                >
                  Images
                  <div className="flex items-center justify-end h-[5.5vh] w-[12vh]">
                    <Image
                      src="/images/drop.svg"
                      alt="Drop Icon"
                      width={16}
                      height={16}
                      className="h-6 w-6 cursor-pointer -mt-3"
                    />
                  </div>
                </div>
              </button>
              <button onClick={() => handleClick("file")}>
                <div
                  className="bg-white w-[17vw] ml-8 mt-5 rounded-lg text-black p-3 font-bold flex justify-between shadow-lg shadow-gray-400"
                  style={{ height: fileHeight }}
                >
                  Files
                  <div className="flex items-center justify-end h-[5.5vh] w-[12vh]">
                    <Image
                      src="/images/drop.svg"
                      alt="Drop Icon"
                      width={16}
                      height={16}
                      className="h-6 w-6 cursor-pointer -mt-3"
                    />
                  </div>
                </div>
              </button>
              <button onClick={() => handleClick("pinned")}>
                <div
                  className="bg-white w-[17vw] ml-8 mt-5 mb-8 rounded-lg text-black p-3 font-bold flex justify-between shadow-lg shadow-gray-400"
                  style={{ height: pinnedHeight }}
                >
                  Pinned
                  <div className="flex items-center justify-end h-[5.5vh] w-[12vh]">
                    <Image
                      src="/images/drop.svg"
                      alt="Drop Icon"
                      width={16}
                      height={16}
                      className="h-6 w-6 cursor-pointer -mt-3"
                    />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </HeroHighlight>
    );
  } else {
    return (
      <div className="flex flex-col h-[95vh] justify-center items-center m-auto text-center">
        <div className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-800">
          Select a user to Chat with!!
        </div>
        <p className="mt-4 text-gray-500 text-sm md:text-base lg:text-lg">
          Start a conversation and connect with others
        </p>
      </div>
    );
  }
}
