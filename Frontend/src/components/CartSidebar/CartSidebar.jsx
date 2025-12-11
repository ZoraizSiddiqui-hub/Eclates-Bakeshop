// src/components/CartSidebar/CartSidebar.jsx
import React, { useEffect } from 'react';
import './CartSidebar.css';
import { RxCross2 } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchCart,
  removeItemFromCart,
  clearCartThunk,
  updateQuantity
} from '../../redux/cartSlice';

const CartSidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  useEffect(() => {
    dispatch(fetchCart()); // ✅ load backend cart on sidebar open
  }, [dispatch]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
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

  const handleRemove = (id) => {
    dispatch(removeItemFromCart(id)); // ✅ backend + redux
  };

  const handleClearCart = () => {
    dispatch(clearCartThunk()); // ✅ backend + redux
  };

  const handleQuantityChange = (id, value) => {
    const quantity = Math.max(1, parseInt(value));
    dispatch(updateQuantity({ _id: id, quantity })); // still local, can be wired later
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
                  You must have an order with a minimum of Rs 1,000 to place your order, your current order total is Rs {subtotal}.
                </p>
              )}
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={`http://localhost:4000/images/${item.image}`} alt={item.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <p className="cart-item-name">{item.name}</p>
                  <div className="cart-item-qty">
                    <button
                      onClick={() =>
                        item.quantity > 1 &&
                        handleQuantityChange(item._id, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item._id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <p className="cart-item-price">₨ {item.price}</p>
                  <p className="cart-item-subtotal">Subtotal: ₨ {item.price * item.quantity}</p>
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
            <p>Shipping: {shipping === 0 ? 'Free Delivery' : `₨ ${shipping}`}</p>
            <p>Estimated Total: ₨ {total}</p>
            {belowMinimum && (
              <p className="min-order-warning">
                You must have an order with a minimum of Rs 1,000 to place your order, your current order total is Rs {subtotal}.
              </p>
            )}
          </div>
        )}

        <div className="cart-sidebar-actions">
          <button className="view-cart-btn" onClick={handleViewCart}>View Cart</button>
          <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
          {cartItems.length > 0 && (
            <button className="clear-cart-btn" onClick={handleClearCart}>Clear Cart</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
