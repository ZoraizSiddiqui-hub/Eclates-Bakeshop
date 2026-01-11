// src/pages/PlaceOrder/PlaceOrder.jsx
import React from 'react';
import './PlaceOrder.css';
import { useNavigate, useParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { width, height } = useWindowSize();

  return (
    <div className="placeorder-page">
      <div className="confetti-wrapper">
        <Confetti width={width} height={height} numberOfPieces={150} recycle={false} />
      </div>

      <div className="placeorder-banner">
        <h1>Order Confirmed</h1>
      </div>

      <div className="placeorder-content">
        <div className="placeorder-message">
          <h2>🎉 Thank you for your order!</h2>

          <p>Your order has been successfully placed.</p>

          <p className="placeorder-orderid">
            <strong>Order ID:</strong> {orderId}
          </p>

          <p className="placeorder-email">
            📧 A confirmation email has been sent to your inbox.
          </p>

          {/* ✅ Updated button wrapper */}
          <div className="placeorder-buttons">
            <button
              className="placeorder-btn"
              onClick={() => navigate('/MyOrders')}
            >
              View My Orders
            </button>

            <button
              className="placeorder-btn"
              onClick={() => navigate('/')}
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
