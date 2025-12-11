// src/pages/CartPage.jsx
import React, { useEffect } from 'react';
import './CartPage.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchCart,
  removeItemFromCart,
  clearCartThunk,
  updateQuantity
} from '../../redux/cartSlice.js';
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';

const CartPage = () => {
  const cartItems = useSelector(state => state.cart.items);   // { _id, quantity }
  const foodItems = useSelector(state => state.food.items);   // full food list
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // ✅ Merge cart with food details
  const mergedCartItems = cartItems.map(cartItem => {
    const food = foodItems.find(f => f._id === cartItem._id);
    return food ? { ...food, quantity: cartItem.quantity } : { _id: cartItem._id, quantity: cartItem.quantity };
  });

  const handleRemove = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCartThunk());
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleQuantityChange = (id, value) => {
    const quantity = Math.max(1, parseInt(value));
    dispatch(updateQuantity({ _id: id, quantity }));
  };

  const subtotal = mergedCartItems.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
  const shipping = subtotal >= 1000 ? 0 : 300;
  const total = subtotal + shipping;

  return (
    <div className="cart-page">
      <div className="cart-banner">
        <h1>Your Cart</h1>
      </div>

      {mergedCartItems.length === 0 ? (
        <div className="cart-page-empty">
          <FiShoppingBag className="cart-page-empty-icon" />
          <h2>Your cart is feeling lonely</h2>
          <p>Looks like you haven’t added anything yet. Let’s fix that with something sweet.</p>
          <button className="cart-page-shop-btn" onClick={() => navigate('/menu')}>
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="cart-page-content">
          <div className="cart-page-list">
            {mergedCartItems.map(item => (
              <div key={item._id} className="cart-page-item">
                {item.image && (
                  <img src={`http://localhost:4000/images/${item.image}`} alt={item.name} className="cart-page-item-img" />
                )}
                <div className="cart-page-item-details">
                  <h4>{item.name}</h4>
                  <p>₨ {item.price} × 
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                      className="cart-page-quantity-input"
                    />
                  </p>
                  <p>Total: ₨ {item.price * item.quantity}</p>
                  <button className="cart-page-remove-btn" onClick={() => handleRemove(item._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-page-summary">
            <h3>Subtotal: ₨ {subtotal}</h3>
            <p>Shipping: {shipping === 0 ? 'Free Delivery' : `₨ ${shipping}`}</p>
            <h3>Estimated Total: ₨ {total}</h3>
            <button className="cart-page-clear-btn" onClick={handleClearCart}>Clear Cart</button>
            <button className="cart-page-checkout-btn" onClick={handleCheckout}>Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
