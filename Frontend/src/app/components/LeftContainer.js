"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function LeftContainer() {
  const [users, setUsers] = useState([]);  
  const [addUsers, setAddUsers] = useState([]);  
  
  const [showAddList, setShowAddList] = useState(false); 
    const [email,setEmail] = useState("")
    useEffect(() => {
      if (typeof window !== 'undefined' && sessionStorage) {
        const storedEmail = sessionStorage.getItem("email");
        setEmail(storedEmail);
      }
    }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/chat-list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          email: email,  
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch chat list");
      }

      const result = await response.json();
      setUsers(result);  
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };


  const fetchAddUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/add-users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          email: email,  
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setAddUsers(result);  
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const addtochat = async (useremail) => {
    try {
      const response = await fetch("http://localhost:3001/add-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          email: email, 
          useremail: useremail, 
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      await fetchUsers();  
      await fetchAddUsers(); 

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (email) {
      fetchUsers();  
      fetchAddUsers();  
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);


  const handleChatUser = (user) => {
    if (typeof window !== 'undefined' && sessionStorage) {
      sessionStorage.setItem("chat-username", user.username);
      sessionStorage.setItem("chat-email", user.email);
    }
  };
  

  const handleAddUser = () => {
    setShowAddList(!showAddList);
  };


  return (
    <div className="flex flex-col items-center overflow-y-auto hide-scrollbar">
      <div
        className="h-[6vh] mt-[2vh] bg-white w-[20vw] rounded-md flex items-center justify-center shadow-lg px-4 cursor-pointer"
        onClick={handleAddUser}
      >
        {!showAddList ? (
          <>
            <Image
              src="/images/plus-solid.svg"
              alt="Plus Icon"
              width={16}
              height={16}
              className="h-4 w-4"
            />
            <div className="bg-black w-[0.15px] h-[4vh] mx-4"></div>
            <div className="text-black text-center text-md h-[4vh]">
              New Conversation
            </div>
          </>
        ) : (
          <div className="text-black text-center text-md h-[4vh]">
            Show Chats
          </div>
        )}
      </div>

      {showAddList ? (
        <>
          <div className="text-black text-lg mt-[5vh] font-bold mb-2">
            Add Users
          </div>
          <div className="add-users-list h-[75vh] overflow-y-auto hide-scrollbar">
            {addUsers.map((user) => (
              <div
                key={user.email}
                className="h-[10vh] w-[18vw] mt-4 cursor-pointer"
                onClick={() => addtochat(user.email)}
              >
                <div className="flex items-center w-[18vw] my-2">
                  <div className="h-[7vh] w-[7vh] rounded-full bg-transparent border-black border-2">
                    <Image
                      src="/images/user-solid.svg"
                      alt="User Icon"
                      width={20}
                      height={20}
                      className="h-7 w-7 ml-[6px] mt-1 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="text-black font-semibold px-4">
                      {user.username}
                    </div>
                    <div className="text-gray-400 font-bold text-[10px] px-4">
                      {user.email}
                    </div>
                  </div>
                </div>
                <hr className="border-t-2 border-gray-300 w-[18vw]" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="text-black text-lg font-bold mb-2 mt-[5vh]">
            Chat Users
          </div>
          <div className="chat-list h-[75vh] mt-4 overflow-y-auto hide-scrollbar">
            {users.map((user) => (
              <div
                key={user.email}
                className="h-[10vh] w-[18vw] mt-4 cursor-pointer"
                onClick={() => handleChatUser(user)}
              >
                <div className="flex items-center w-[18vw] my-2">
                  <div className="h-[7vh] w-[7vh] rounded-full bg-transparent border-black border-2">
                    <Image
                      src="/images/user-solid.svg"
                      alt="User Icon"
                      width={20}
                      height={20}
                      className="h-7 w-7 ml-[6px] mt-1 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="text-black font-semibold px-4">
                      {user.username}
                    </div>
                    <div className="text-gray-400 font-bold text-[10px] px-4">
                      {user.email}
                    </div>
                  </div>
                </div>
                <hr className="border-t-2 border-gray-300 w-[18vw]" />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
