"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

export default function LoginPage() {
  const route = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { email, password };

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      sessionStorage.setItem("username", result.username);
      sessionStorage.setItem("email", formData.email);

      window.location.href = "/home";
    } catch (error) {
      console.error("Error during login:", error);
      errorMsg();
    }
  };

  const errorMsg = () => {
    setErrorMessage("Invalid email or password.");
    setTimeout(() => {
      setErrorMessage("");
    }, 2000);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-900 via-black to-gray-800">
      <div
        className="bg-gray-900 p-10 rounded-lg border-4 w-[400px] border-transparent relative"
        style={{
          boxShadow: "0 0 15px 5px rgba(255, 255, 255, 0.5)",
        }}
      >
        <div className="mt-4 flex flex-col items-center rounded-2xl mb-4">
          <Image
            src="/images/VL-removebg.png"
            alt="Logo"
            width={50}
            height={50}
            className="h-20 w-20 cursor-pointer rounded-2xl "
          />
        </div>
        <h1 className="text-3xl font-bold text-center mb-[2vh] text-gray-200">
          Login
        </h1>

        <div className="h-[5vh] mb-[2vh]">
          {errorMessage && (
            <p className="text-center text-red-500 mb-4">{errorMessage}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-500 bg-gray-800 text-gray-200"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-500 bg-gray-800 text-gray-200"
          />
          <div className="m-auto flex justify-center items-center">
            <HoverBorderGradient
              containerClassName="rounded-lg"
              as="button"
              className="bg-black text-white flex items-center space-x-4"
            >
              Login
            </HoverBorderGradient>
          </div>
        </form>

        <p className="text-center text-gray-400 mt-8">
          Dont have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={() => route.push("/signup")}
          >
            Sign up here
          </span>
        </p>
      </div>
    </div>
  );
}
