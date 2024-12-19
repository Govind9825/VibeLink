"use client";

import { useState } from "react";
import Nav from "../(navbar)/page";
import Profile from "./page";

export default function Layout() {
  return (
    <div className="p-2 bg-white flex pr-4">
      <div className="bg-gray-200 w-full h-[95vh] overflow-hidden rounded-lg flex m-auto">
        <Nav />
        <div className=" w-[100vw] bg-gray-700 flex justify-center items-center">
          <Profile />
        </div>
      </div>
    </div>
  );
}
