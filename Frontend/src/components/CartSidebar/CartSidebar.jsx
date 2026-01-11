// src/components/CartSidebar/CartSidebar.jsx
import React, { useState } from 'react';
import './CartSidebar.css';
import { RxCross2 } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeItemFromCart,
  clearCartThunk,
  updateCartQuantityThunk,
} from '../../redux/cartSlice';
import Swal from "sweetalert2";

const CartSidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [maxReached, setMaxReached] = useState({}); // itemId -> true

  const cartItems = useSelector((state) =>
    Array.isArray(state.cart.items) ? state.cart.items : []
  );

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item?.price || 0) * (item?.quantity || 1),
    0
  );
  const shipping = subtotal >= 1000 ? 0 : 300;
  const total = subtotal + shipping;
  const belowMinimum = subtotal < 1000;

  const handleViewCart = () => {
    onClose();
    navigate('/cart');
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

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

  const handleQuantityChange = async (id, newQty, stock, currentQty) => {
    if (newQty < 1) return;

    // ⭐ CASE 1: Decreasing quantity → ALWAYS ALLOW (silent)
    if (newQty < currentQty) {
      try {
        await dispatch(updateCartQuantityThunk({ itemId: id, quantity: newQty })).unwrap();
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
    if (newQty > stock) {
      setMaxReached(prev => ({ ...prev, [id]: true }));
      Swal.fire({
        icon: "error",
        title: "Only 0 item(s) left in stock",
        confirmButtonColor: "#d7938f"
      });
      return;
    }

    // ⭐ CASE 3: Normal increase → silent update
    try {
      await dispatch(updateCartQuantityThunk({ itemId: id, quantity: newQty })).unwrap();
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

  return (
    <div className="cart-sidebar-overlay">
      <div className="cart-sidebar">
        <div className="cart-sidebar-header">
          <h3>Shopping Cart</h3>
          <RxCross2 className="close-cart-icon" onClick={onClose} />
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>No products in the cart.</p>
              <button
                className="return-shop-btn"
                onClick={() => {
                  navigate('/menu');
                  onClose();
                }}
              >
                Return to shop
              </button>

              {belowMinimum && (
                <p className="min-order-warning">
                  You must have an order with a minimum of Rs 1,000 to place
                  your order, your current order total is Rs {subtotal}.
                </p>
              )}
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                {item.image && (
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/images/${item.image}`}
                    alt={item.name}
                    className="cart-item-img"
                  />
                )}

                <div className="cart-item-details">
                  <p className="cart-item-name">{item.name}</p>

                  <div className="cart-item-qty">
                    {/* Minus button */}
                    <button
                      className={item.quantity <= 1 ? "disabled" : ""}
                      onClick={() =>
                        handleQuantityChange(
                          item._id,
                          item.quantity - 1,
                          item.stock,
                          item.quantity
                        )
                      }
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    {/* Plus button */}
                    <button
                      className={maxReached[item._id] ? "disabled" : ""}
                      onClick={() =>
                        handleQuantityChange(
                          item._id,
                          item.quantity + 1,
                          item.stock,
                          item.quantity
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <p className="cart-item-price">₨ {item.price}</p>
                  <p className="cart-item-subtotal">
                    Subtotal: ₨ {item.price * item.quantity}
                  </p>
                </div>

                <RxCross2
                  className="remove-item-icon"
                  onClick={() => handleRemove(item._id)}
                />
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-summary">
            <p>Subtotal: ₨ {subtotal}</p>
            <p>Shipping: {shipping === 0 ? "Free Delivery" : `₨ ${shipping}`}</p>
            <p>Estimated Total: ₨ {total}</p>

            {belowMinimum && (
              <p className="min-order-warning">
                You must have an order with a minimum of Rs 1,000 to place your
                order, your current order total is Rs {subtotal}.
              </p>
            )}
          </div>
        )}

        <div className="cart-sidebar-actions">
          <button className="view-cart-btn" onClick={handleViewCart}>
            View Cart
          </button>

          <button className="checkout-btn" onClick={handleCheckout}>
            Checkout
          </button>

          {cartItems.length > 0 && (
            <button className="clear-cart-btn" onClick={handleClearCart}>
              Clear Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
