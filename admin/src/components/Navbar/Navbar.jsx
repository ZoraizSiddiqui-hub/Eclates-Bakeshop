// src/admin/components/Navbar/Navbar.jsx
import React, { useState } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Navbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You will be logged out of the admin panel.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d7938f",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        MySwal.fire({
          icon: "success",
          title: "Logged Out",
          text: "You have been logged out successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        navigate("/login");
      }
    });
  };

  return (
    <div className="navbar-admin">
      <div className="navbar-right">
        <FaUserCircle
          className="user-icon"
          onClick={() => setDropdownOpen((prev) => !prev)}
        />

        {dropdownOpen && (
          <div className="dropdown-menu">
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
