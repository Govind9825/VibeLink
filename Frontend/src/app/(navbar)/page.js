"use client";

import React from "react";
import Image from "next/image";
import { useState } from "react";

const Nav = () => {
  const [showSetting, setShowSetting] = useState(false);

  const handleSignOut = async () => {
    sessionStorage.clear();
    window.location.href = "/";
  };

  const handleSetting = () => {
    setShowSetting(!showSetting);
  };

  const handleprofile = () => {
    window.location.href = "/profile";
  };

  const handlemessage = () => {
    window.location.href = "/home";
  };

  return (
    <div className="lc bg-gray-800 h-[95vh] w-32 flex flex-col items-center justify-between">
      <div className="mt-4 flex flex-col items-center -ml-2 ">
        <Image
          src="/images/VL-removebg.png"
          alt="Logo"
          width={50}
          height={50}
          className="h-20 w-20 cursor-pointer rounded-2xl"
        />
      </div>

      <div className="flex flex-col items-center space-y-6">
        <Image
          onClick={handlemessage}
          src="/images/message.png"
          alt="Message Icon"
          width={24}
          height={24}
          className="h-6 w-6 cursor-pointer hover:scale-150 transition-transform duration-500 ease-in-out"
        />
        <Image
          src="/images/bell.png"
          alt="Notifications Icon"
          width={24}
          height={24}
          className="h-6 w-6 cursor-pointer hover:scale-150 transition-transform duration-500 ease-in-out"
        />
      </div>

      <div className="mb-4 flex flex-col items-center space-y-6">
        <Image
          src="/images/plus.png"
          alt="Add Icon"
          width={24}
          height={24}
          className="h-6 w-6 cursor-pointer hover:scale-150 transition-transform duration-500 ease-in-out"
        />
        <div onClick={handleSetting}>
          <Image
            src="/images/settings (1).png"
            alt="Settings Icon"
            width={24}
            height={24}
            className="h-6 w-6 cursor-pointer hover:scale-150 transition-transform duration-500 ease-in-out"
          />
          {showSetting && (
            <div className="absolute ml-[3vw] -mt-[4vh] w-[8vw] bg-white border border-gray-300 rounded shadow-lg ">
              <ul className="py-2">
                <li>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-center px-2 py-1 text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
        <Image
          onClick={handleprofile}
          src="/images/user.png"
          alt="Profile Icon"
          width={24}
          height={24}
          className="h-6 w-6 cursor-pointer hover:scale-150 transition-transform duration-500 ease-in-out"
        />
      </div>
    </div>
  );
};

export default Nav;
