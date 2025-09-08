import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import { doSignOut } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";

const Profile = () => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/me`);
        setUser(res.data);
        console.log(res.data);
      } catch (err) {
        console.warn("Not authorized:", err);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogOut = async () => {
    try {
      await doSignOut();
    } catch (err) {
      console.warn("Firebase signOut failed:", err);
    }
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="flex h-screen w-full  text-white absolute">
      {/* Sidebar */}
      <aside className="w-[15rem] bg-[#0e0e0e] rounded-r-[4rem] p-4 flex flex-col justify-between shadow ">
        <div>
          <h1 className="text-2xl font-bold mb-7 text-red-400 name">TaskFlow</h1>
          <nav className="flex items-center gap-4">
            <img src={user?.photoUrl || currentUser?.photoURL } alt="Profile" className="w-[4rem] rounded-full mb-2" />
            <h1 className="block hover:text-green-400">
              {currentUser?.displayName || user?.firstname || "Guest"}
            </h1>
          </nav>
          
        </div>
        <div className="space-y-2">
          <Link to="/settings" className="block hover:text-green-400">Settings</Link>
          <button 
            onClick={handleLogOut} 
            className="block hover:text-green-400 text-left w-full"
          >
            Logout
          </button>
        </div>
      </aside>



      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Dashboard</h2>
        </header>
      </main>
    </div>
  );
};

export default Profile;
