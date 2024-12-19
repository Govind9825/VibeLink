"use client"

const Profile = () => {
    const username = sessionStorage.getItem("username");
  const email = sessionStorage.getItem("email");
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="max-w-lg w-full bg-gray-200 shadow-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center">
            <img 
              src="/images/user-solid.svg" 
              alt="User" 
              className="w-28 h-28 rounded-full shadow-md mb-6"
            />
            <h1 className="text-2xl font-bold text-gray-800">{username}</h1>
            <p className="text-sm text-gray-500 mt-1">{email}</p>
          </div>
  
          <div className="mt-6 text-center">
            <p className="text-gray-700 text-lg leading-relaxed">
              Passionate frontend developer specializing in building dynamic and beautiful user interfaces using React, Tailwind CSS. Love crafting interactive experiences that delight users.
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Profile;
  