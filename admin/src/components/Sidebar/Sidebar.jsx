// src/admin/components/Sidebar/Sidebar.jsx
import React from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img className="logo" src={assets.logo} alt="Eclates Logo" />
      </div>

      <div className="sidebar-options">
        <NavLink
          to="/admin/add"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? "active" : ""}`
          }
        >
          <img src={assets.add_icon} alt="Add" />
          <p>Add items</p>
        </NavLink>

        <NavLink
          to="/admin/list"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? "active" : ""}`
          }
        >
          <img src={assets.list_icon || assets.order_icon} alt="List" />
          <p>List items</p>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? "active" : ""}`
          }
        >
          <img src={assets.order_icon} alt="Orders" />
          <p>Orders</p>
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? "active" : ""}`
          }
        >
          <img src={assets.users_icon} alt="Users" />
          <p>Users</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
