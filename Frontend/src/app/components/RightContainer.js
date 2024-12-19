"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function RightContainer() {
  const [chatUsername, setChatUsername] = useState("");
  const [chatEmail, setChatEmail] = useState("");

  useEffect(() => {
    // Update chat info on component mount
    updateChatInfo();

    // Monitor for changes in sessionStorage manually within this tab
    const originalSetItem = sessionStorage.setItem;
    sessionStorage.setItem = function (key, value) {
      originalSetItem.apply(this, arguments);
      updateChatInfo();
    };

    // Listen to storage events from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === "chat-username" || e.key === "chat-email") {
        updateChatInfo();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      sessionStorage.setItem = originalSetItem;
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const [infoHeight, setInfoHeight] = useState("8vh");
  const [infoExpanded, setInfoExpanded] = useState(false);

  const [imagesHeight, setImagesHeight] = useState("8vh");
  const [imagesExpanded, setImagesExpanded] = useState(false);

  const [pinnedHeight, setPinnedHeight] = useState("8vh");
  const [pinnedExpanded, setPinnedExpanded] = useState(false);

  const [fileHeight, setFileHeight] = useState("8vh");
  const [fileExpanded, setFileExpanded] = useState(false);

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

  const updateChatInfo = () => {
    setChatUsername(sessionStorage.getItem("chat-username") || "");
    setChatEmail(sessionStorage.getItem("chat-email") || "");
  };
  return (
    <div className="r h-[95vh] flex-col justify-center">
      <div className="bg-white h-[22vh] w-[16vw] mx-8 mt-10 rounded-lg flex flex-col justify-center items-center">
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
            className="bg-white w-[16vw] mx-8 mt-5 rounded-lg text-black p-3 font-bold flex justify-between"
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
            className="bg-white w-[16vw] mx-8 mt-5 rounded-lg text-black p-3 font-bold flex justify-between"
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
            className="bg-white w-[16vw] mx-8 mt-5 rounded-lg text-black p-3 font-bold flex justify-between"
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
            className="bg-white w-[16vw] mx-8 mt-5 rounded-lg text-black p-3 font-bold flex justify-between"
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
  );
}
