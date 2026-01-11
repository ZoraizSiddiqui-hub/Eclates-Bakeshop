// src/pages/Cart/CartPage.jsx
import React, { useState } from 'react';
import './CartPage.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeItemFromCart,
  clearCartThunk,
  updateCartQuantityThunk,
} from '../../redux/cartSlice.js';
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';
import Swal from "sweetalert2";

const CartPage = () => {
  const cartItems = useSelector((state) =>
    Array.isArray(state.cart.items) ? state.cart.items : []
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [maxReached, setMaxReached] = useState({}); // itemId -> true

  const handleRemove = async (id) => {
    try {
      await dispatch(removeItemFromCart(id)).unwrap();
      Swal.fire({
        icon: "success",
        title: "Item removed from cart",
        confirmButtonColor: "#d7938f"
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err || "Failed to remove item",
        confirmButtonColor: "#d7938f"
      });
    }
  };

  const handleClearCart = async () => {
    try {
      await dispatch(clearCartThunk()).unwrap();
      Swal.fire({
        icon: "success",
        title: "Cart cleared successfully",
        confirmButtonColor: "#d7938f"
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err || "Failed to clear cart",
        confirmButtonColor: "#d7938f"
      });
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleQuantityChange = async (id, value, stock, currentQty) => {
    const quantity = Number(value);

    if (quantity < 1) return;

    // ⭐ CASE 1: Decreasing quantity → ALWAYS ALLOW (no alert)
    if (quantity < currentQty) {
      try {
        await dispatch(updateCartQuantityThunk({ itemId: id, quantity })).unwrap();
        setMaxReached(prev => ({ ...prev, [id]: false })); // reset lock
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: err || "Failed to update quantity",
          confirmButtonColor: "#d7938f"
        });
      }
      return;
    }

    // ⭐ CASE 2: Increasing beyond stock → BLOCK with alert
    if (quantity > stock) {
      setMaxReached(prev => ({ ...prev, [id]: true }));
      Swal.fire({
        icon: "error",
        title: "Only 0 item(s) left in stock",
        confirmButtonColor: "#d7938f"
      });
      return;
    }

    // ⭐ CASE 3: Normal increase → update silently (no alert)
    try {
      await dispatch(updateCartQuantityThunk({ itemId: id, quantity })).unwrap();
    } catch (err) {
      const message = typeof err === 'string' ? err : 'Failed to update quantity';

      if (message.includes("Only")) {
        setMaxReached(prev => ({ ...prev, [id]: true }));
      }

      Swal.fire({
        icon: "error",
        title: message,
        confirmButtonColor: "#d7938f"
      });
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * item.quantity,
    0
  );

  const shipping = subtotal >= 1000 ? 0 : 300;
  const total = subtotal + shipping;

  return (
    <div className="cart-page">
      <div className="cart-banner">
        <h1>Your Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-page-empty">
          <FiShoppingBag className="cart-page-empty-icon" />
          <h2>Your cart is feeling lonely</h2>
          <p>
            Looks like you haven’t added anything yet. Let’s fix that with
            something sweet.
          </p>
          <button
            className="cart-page-shop-btn"
            onClick={() => navigate('/menu')}
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="cart-page-content">
          <div className="cart-page-list">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-page-item">
                {item.image && (
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/images/${item.image}`}
                    alt={item.name}
                    className="cart-page-item-img"
                  />
                )}

                <div className="cart-page-item-details">
                  <h4>{item.name}</h4>

                  <p>
                    ₨ {item.price} ×{" "}
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item._id,
                          e.target.value,
                          item.stock,
                          item.quantity
                        )
                      }
                      className={`cart-page-quantity-input ${
                        maxReached[item._id] ? "disabled" : ""
                      }`}
                    />
                  </p>

                  <p>Total: ₨ {item.price * item.quantity}</p>

                  <button
                    className="cart-page-remove-btn"
                    onClick={() => handleRemove(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-page-summary">
            <h3>Subtotal: ₨ {subtotal}</h3>
            <p>
              Shipping: {shipping === 0 ? "Free Delivery" : `₨ ${shipping}`}
            </p>
            <h3>Estimated Total: ₨ {total}</h3>

            <button
              className="cart-page-clear-btn"
              onClick={handleClearCart}
            >
              Clear Cart
            </button>

            <button
              className="cart-page-checkout-btn"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
