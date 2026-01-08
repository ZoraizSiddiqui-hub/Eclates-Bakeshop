// src/admin/pages/AdminOrderDetails/AdminOrderDetails.jsx
import React, { useEffect, useState, useCallback } from "react";
import "./AdminOrderDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOrderByIdAPI,
  updateOrderStatusAPI,
} from "../../../../Frontend/src/api/api"; // centralized APIs
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Stable fetch function
  const fetchOrderDetails = useCallback(async () => {
    try {
      const res = await getOrderByIdAPI(orderId);
      if (res.data.success) {
        setOrder(res.data.order);
      } else {
        MySwal.fire({
          icon: "error",
          title: "Oops...",
          text: res.data.message || "Failed to fetch order details",
        });
      }
    } catch (error) {
      console.error(error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Error fetching order details",
      });
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  // ✅ Update order status without causing loop
  const updateStatus = async (newStatus) => {
    try {
      const res = await updateOrderStatusAPI(orderId, newStatus);
      if (res.data.success) {
        MySwal.fire({
          icon: "success",
          title: "Order Updated",
          text: "Order status has been updated successfully!",
          timer: 2000,
          showConfirmButton: false,
        });
        // Update local state instead of refetching
        setOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
      } else {
        MySwal.fire({
          icon: "error",
          title: "Update Failed",
          text: res.data.message || "Failed to update status",
        });
      }
    } catch (error) {
      console.error(error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Error updating status",
      });
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  if (loading) {
    return (
      <div className="adminorderdetails-loading">Loading order details...</div>
    );
  }

  if (!order) {
    return <div className="adminorderdetails-error">Order not found.</div>;
  }

  const timelineSteps = ["Pending", "Preparing", "Ready", "Delivered"];
  const currentStep = timelineSteps.indexOf(order.status);

  return (
    <div className="adminorderdetails-page">
      <button
        className="adminorderdetails-back"
        onClick={() => navigate("/admin/orders")}
      >
        ← Back to Orders
      </button>

      <h1>Order Details</h1>

      {/* Timeline */}
      <div className="timeline-container">
        {timelineSteps.map((step, index) => (
          <div key={step} className="timeline-step">
            <div
              className={`timeline-circle ${
                index <= currentStep ? "timeline-active" : ""
              }`}
            >
              {index + 1}
            </div>
            <p
              className={`timeline-label ${
                index <= currentStep ? "timeline-label-active" : ""
              }`}
            >
              {step}
            </p>
            {index < timelineSteps.length - 1 && (
              <div
                className={`timeline-line ${
                  index < currentStep ? "timeline-line-active" : ""
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="adminorderdetails-card">
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Total Amount:</strong> ₨ {order.totalAmount}
        </p>
      </div>

      {/* Customer Info */}
      <h2>Customer Information</h2>
      <div className="adminorderdetails-card">
        <p>
          <strong>Name:</strong> {order.userId?.name || "Unknown"}
        </p>
        <p>
          <strong>Email:</strong> {order.userId?.email || "Unknown"}
        </p>
      </div>

      {/* Delivery Address */}
      <h2>Delivery Address</h2>
      <div className="adminorderdetails-card">
        <p>
          <strong>Full Name:</strong> {order.address?.fullName}
        </p>
        <p>
          <strong>Phone:</strong> {order.address?.phone}
        </p>
        <p>
          <strong>Street:</strong> {order.address?.street}
        </p>
        <p>
          <strong>City:</strong> {order.address?.city}
        </p>
        <p>
          <strong>Postal Code:</strong> {order.address?.postalCode}
        </p>
      </div>

      {/* Items */}
      <h2>Items</h2>
      <div className="adminorderdetails-items">
        {order.items?.map((item) => (
          <div key={item.itemId._id} className="adminorderdetails-item">
            <p>
              <strong>{item.itemId.name}</strong>
            </p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ₨ {item.price}</p>
          </div>
        ))}
      </div>

      {/* Update Status */}
      <h2>Update Status</h2>
      <select
        className="adminorderdetails-select"
        value={order.status}
        onChange={(e) => updateStatus(e.target.value)}
      >
        <option value="Pending">Pending</option>
        <option value="Preparing">Preparing</option>
        <option value="Ready">Ready</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    </div>
  );
};

export default AdminOrderDetails;
