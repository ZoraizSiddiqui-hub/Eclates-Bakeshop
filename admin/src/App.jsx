// src/admin/App.jsx
import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import Edit from "./pages/Edit/Edit";
import Users from "./pages/Users/Users";
import AdminOrderDetails from "./pages/AdminOrderDetails/AdminOrderDetails"; // ✅ added
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminLogin from "./pages/AdminLogin/AdminLogin"; // ✅ new login page

const App = () => {
  const location = useLocation();

  // ✅ Check if current route is /login
  const isLoginPage = location.pathname === "/login";

  return (
    <div>
      <ToastContainer />

      {/* ✅ Hide Navbar + Sidebar on login page */}
      {!isLoginPage && <Navbar />}
      {!isLoginPage && <hr />}
      <div className="app-content">
        {!isLoginPage && <Sidebar />}

        <Routes>
          {/* ✅ Redirect root to /admin safely */}
          <Route path="/" element={<Navigate to="/admin" replace />} />

          {/* ✅ Admin login route */}
          <Route path="/login" element={<AdminLogin />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <div className="admin-root">
                  <h1>Welcome to Admin Panel</h1>
                  <p>
                    Select a section from the sidebar to manage orders, products,
                    or users.
                  </p>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/add"
            element={
              <ProtectedRoute adminOnly>
                <Add />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/list"
            element={
              <ProtectedRoute adminOnly>
                <List />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute adminOnly>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/order/:orderId" // ✅ added route for order details
            element={
              <ProtectedRoute adminOnly>
                <AdminOrderDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <ProtectedRoute adminOnly>
                <Edit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <Users />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
