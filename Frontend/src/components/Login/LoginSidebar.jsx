import React, { useState } from 'react';
import './LoginSidebar.css';
import { RxCross2 } from 'react-icons/rx';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

// ✅ Import API functions
import { loginUser, registerUser } from '../../api/api';

const LoginSidebar = ({ setShowLogin, setIsLoggedIn }) => {
  const [currState, setCurrState] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;
      if (currState === "Login") {
        res = await loginUser(data.email, data.password);
      } else {
        res = await registerUser(data.name, data.email, data.password);
      }

      const result = res.data; // axios returns data inside res.data

      if (result.success) {
        // ✅ Store token based on "Remember me"
        if (rememberMe) {
          localStorage.setItem("token", result.token);
        } else {
          sessionStorage.setItem("token", result.token);
        }

        toast.success(`${currState} successful!`);

        if (currState === "Login") {
          setIsLoggedIn(true);       // 🔐 Notify parent that user is logged in
          setShowLogin(false);       // ✅ Close sidebar
        } else {
          setCurrState("Login");     // 🔄 Switch to login mode after signup
        }
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Server error");
      console.error(error);
    }
  };

  return (
    <div className="login-sidebar-overlay">
      <div className="login-sidebar">
        <div className="login-sidebar-header">
          <h2>{currState}</h2>
          <RxCross2 className="close-icon" onClick={() => setShowLogin(false)} />
        </div>

        <form className="login-sidebar-form" onSubmit={handleSubmit}>
          {currState === "Login" ? null : (
            <input
              type="text"
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              placeholder="Enter your name"
              required
            />
          )}
          <input
            type="email"
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            placeholder="Enter your email"
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              placeholder="Enter your password"
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="login-sidebar-condition">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(prev => !prev)}
            />
            <p>Remember me</p>
          </div>

          <div className="login-sidebar-condition">
            <input type="checkbox" required />
            <p>By continuing, I hereby agree to the terms of use and privacy policy.</p>
          </div>

          <button type="submit" className="login-btn">
            {currState === "Sign up" ? "Create account" : "Login"}
          </button>

          {currState === "Login" ? (
            <p>Create a new account? <span onClick={() => setCurrState("Sign up")}>Click here!</span></p>
          ) : (
            <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here!</span></p>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginSidebar;
