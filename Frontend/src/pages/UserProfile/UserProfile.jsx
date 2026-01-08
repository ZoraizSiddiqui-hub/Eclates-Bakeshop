// src/pages/UserProfile/UserProfile.jsx
import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { useNavigate } from "react-router-dom";
import HeroBanner from "../../components/HeroBanner/HeroBanner";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        const res = await fetch("http://localhost:4000/api/users/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="userprofile-loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="userprofile-error">Unable to load profile.</div>;
  }

  return (
    <>
      {/* ✅ Full-width banner */}
      <HeroBanner title="My Profile" />

      <div className="userprofile-page">
        <div className="userprofile-card">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
          {user.address && <p><strong>Address:</strong> {user.address}</p>}
          {user.city && <p><strong>City:</strong> {user.city}</p>}
        </div>

        <button
          className="userprofile-update-btn"
          onClick={() => navigate("/update-profile")}
        >
          Update Profile
        </button>
      </div>
    </>
  );
};

export default UserProfile;
