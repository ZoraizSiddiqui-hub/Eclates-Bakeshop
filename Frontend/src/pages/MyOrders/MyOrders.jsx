// src/pages/MyOrders/MyOrders.jsx
import React, { useEffect, useState } from "react";
import "./MyOrders.css";
import { useNavigate } from "react-router-dom";
import HeroBanner from "../../components/HeroBanner/HeroBanner"; // ✅ import reusable banner

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ FIXED header
        },
      });

      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="myorders-loading">Loading your orders...</div>;
  }

  return (
    <div className="myorders-page">
      {/* ✅ Reusable HeroBanner */}
      <HeroBanner title="My Orders" />

      {orders.length === 0 ? (
        <p className="myorders-empty">You have no orders yet.</p>
      ) : (
        <div className="myorders-list">
          {orders.map((order) => (
            <div key={order._id} className="myorders-card">
              <div className="myorders-info">
                <p>
                  <strong>Order ID:</strong> {order._id}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Total:</strong> ₨ {order.totalAmount}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </p>
              </div>

              <button
                className="myorders-details-btn"
                onClick={() => navigate(`/order/${order._id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
