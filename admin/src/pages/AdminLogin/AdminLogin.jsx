// src/admin/pages/Login/AdminLogin.jsx
import React, { useState } from "react";
import "./AdminLogin.css"; // ✅ use dedicated admin login styling
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { loginUser } from "../../../../Frontend/src/api/api";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(email, password);
      const result = res.data;

      if (result.success) {
        const token = result.token;
        const user = result.user;

        // ✅ Store token + user
        if (rememberMe) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("user", JSON.stringify(user));
        }

        if (user.isAdmin) {
          // ✅ SweetAlert success
          MySwal.fire({
            icon: "success",
            title: "Login Successful",
            text: "Welcome to the Admin Panel!",
            timer: 2000,
            showConfirmButton: false,
          });
          navigate("/admin"); // ✅ go to admin dashboard
        } else {
          // ✅ SweetAlert error
          MySwal.fire({
            icon: "error",
            title: "Access Denied",
            text: "Only Admin/s can access.",
          });
        }
      } else {
        MySwal.fire({
          icon: "error",
          title: "Login Failed",
          text: result.message || "Invalid credentials",
        });
      }
    } catch (error) {
      console.error(error);
      MySwal.fire({
        icon: "error",
        title: "Server Error",
        text: "Error during login. Please try again later.",
      });
    }
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <h2>Admin Login</h2>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="admin-login-condition">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe((prev) => !prev)}
            />
            <p>Remember me</p>
          </div>

          <div className="admin-login-condition">
            <input type="checkbox" required />
            <p>
              By continuing, I hereby agree to the terms of use and privacy
              policy.
            </p>
          </div>

          <button type="submit" className="admin-login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
