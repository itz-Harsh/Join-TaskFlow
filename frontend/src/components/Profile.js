import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`http://localhost:5000/api/auth/me`);
        setUser(res.data);
      } catch (err) {
        setUser({ error: "Not Authorized" });
      }
    };

    fetchProfile();
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <div>
      <h2>Profile</h2>
      {user ? (
        user.error ? (
          <p>{user.error}</p>
        ) : (
          <p>
            Welcome, <b>{user.username}</b> ({user.email})
          </p>
        )
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={handleLogOut}>Logout</button>
    </div>
  );
};

export default Profile;
