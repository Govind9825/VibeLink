"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

export default function SignUpPage() {
  const route = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // State to trigger animation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPressed(true);
  
    // Email Validation Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Check if email is valid
    if (!emailRegex.test(email)) {
      setMessage({ text: "Please enter a valid email address.", color: "red" });
      setIsPressed(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      setMessage({
        text: "Account created successfully. Please Log In.",
        color: "green",
      });
      setTimeout(() => route.push("/"), 1500);
    } catch (error) {
      errorMsg();
    } finally {
      setTimeout(() => setIsPressed(false), 1500);
    }
  };

  const handleLoginClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      route.push("/");
    }, 1000);
  };

  const errorMsg = () => {
    setMessage({ text: "Email is already used. Try again.", color: "red" });
    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-900 via-black to-gray-800">
      <div
        className="bg-gray-900 p-10 rounded-lg border-4 w-[400px] border-transparent relative"
        style={{
          boxShadow: "0 0 15px 5px rgba(255, 255, 255, 0.5)", // Simulate blurred border
        }}
      >
        <div className="mt-4 flex flex-col items-center rounded-2xl mb-4">
          <Image
            src="/images/VL-removebg.png" // Replace with your logo path
            alt="Logo"
            width={50}
            height={50}
            className="h-20 w-20 cursor-pointer rounded-2xl"
          />
        </div>
        <h1 className="text-3xl font-bold text-center mb-[2vh] text-gray-200">
          Sign Up
        </h1>

        <div className="h-[2vh] mb-[5vh]">
          {message && (
            <p
              className="text-center text-sm mb-4"
              style={{ color: message.color }}
            >
              {message.text}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-500 bg-gray-800 text-gray-200"
          />
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
              Sign Up
            </HoverBorderGradient>
          </div>
        </form>

        <p className="text-center text-gray-400 mt-8">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer hover:underline"
            onClick={handleLoginClick}
          >
            Log in here
          </span>
        </p>
      </div>

      <style jsx>{`
        .rotateY-360 {
          transform: rotateY(360deg);
        }
      `}</style>
    </div>
  );
}
