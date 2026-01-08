// src/pages/UpdateProfile/UpdateProfile.jsx
import React, { useState, useEffect } from "react";
import "./UpdateProfile.css";
import { useNavigate } from "react-router-dom";
import HeroBanner from "../../components/HeroBanner/HeroBanner";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: ""
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
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
        if (data.success && data.user) {
          setFormData({
            name: data.user.name || "",
            phone: data.user.phone || "",
            address: data.user.address || "",
            city: data.user.city || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setSuccessMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    if (!/^\d{11}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 11 digits";
    }

    if (!formData.address || formData.address.trim().length < 5) {
      newErrors.address = "Address must be provided";
    }

    if (!formData.city || formData.city.trim().length < 2) {
      newErrors.city = "City must be provided";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/users/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMessage("Profile updated successfully!");
        setErrors({});
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      } else {
        setErrors({ general: data.message });
        setSuccessMessage("");
      }
    } catch (error) {
      console.error(error);
      setErrors({ general: "Error updating profile" });
      setSuccessMessage("");
    }
  };

  if (loading) {
    return <div className="updateprofile-loading">Loading profile...</div>;
  }

  return (
    <>
      {/* ✅ Full-width banner */}
      <HeroBanner title="Update Profile" />

      <div className="updateprofile-page">
        <form className="updateprofile-form" onSubmit={handleSubmit}>
          <label>
            Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}

          <label>
            Phone <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="error-text">{errors.phone}</p>}

          <label>
            Address <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <p className="error-text">{errors.address}</p>}

          <label>
            City <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          {errors.city && <p className="error-text">{errors.city}</p>}

          {errors.general && <p className="error-text">{errors.general}</p>}
          {successMessage && <p className="success-text">{successMessage}</p>}

          <button type="submit" className="updateprofile-btn">Save Changes</button>
        </form>
      </div>
    </>
  );
};

export default UpdateProfile;
