// src/pages/OrderDetails/OrderDetails.jsx
import React, { useEffect, useState } from "react";
import "./OrderDetails.css";
import { useParams } from "react-router-dom";
import HeroBanner from "../../components/HeroBanner/HeroBanner";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:4000/api/orders/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setOrder(data.order);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Error fetching order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  if (loading) {
    return <div className="orderdetails-loading">Loading order details...</div>;
  }

  if (!order) {
    return <div className="orderdetails-error">Order not found.</div>;
  }

  return (
    <>
      <HeroBanner title="Order Details" />

      <div className="orderdetails-page">
        <div className="orderdetails-card">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total Amount:</strong> ₨ {order.totalAmount}</p>
        </div>

        {/* Delivery Address */}
        <h2>Delivery Address</h2>
        <div className="orderdetails-card">
          <p><strong>Full Name:</strong> {order.address?.fullName}</p>
          <p><strong>Phone:</strong> {order.address?.phone}</p>
          <p><strong>Street:</strong> {order.address?.street}</p>
          <p><strong>City:</strong> {order.address?.city}</p>
          <p><strong>Postal Code:</strong> {order.address?.postalCode}</p>
        </div>

        {/* Items */}
        <h2>Items</h2>
        <div className="orderdetails-items">
          {order.items.map((item) => (
            <div key={item.itemId._id} className="orderdetails-item">
              <p><strong>{item.itemId.name}</strong></p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ₨ {item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
