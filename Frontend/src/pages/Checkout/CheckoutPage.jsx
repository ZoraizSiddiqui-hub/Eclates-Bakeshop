import React, { useState } from 'react';
import './CheckoutPage.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
    const cartItems = useSelector(state => state.cart.items);
    const isCartEmpty = cartItems.length === 0;
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = isCartEmpty ? 0 : subtotal >= 1000 ? 0 : 300;
    const total = isCartEmpty ? 0 : subtotal + shipping;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
    });

    const isFormComplete = Object.values(formData).every(field => field.trim() !== '');
    const isCheckoutEnabled = !isCartEmpty && isFormComplete;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const navigate = useNavigate();
    const handlePlaceOrder = () => {
        if (!isCheckoutEnabled) return;
        navigate('/placeorder');
    };

    return (
        <div className="checkout-page">
            <div className="banner">
                <h1>Checkout</h1>
            </div>

            <div className="checkout-page-content">
                <div className={`checkout-page-form ${isCartEmpty ? 'disabled' : ''}`}>
                    <h2>Billing & Shipping</h2>

                    <label>First Name *</label>
                    <input type="text" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} disabled={isCartEmpty} />

                    <label>Last Name *</label>
                    <input type="text" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} disabled={isCartEmpty} />

                    <label>Phone *</label>
                    <input type="text" name="phone" placeholder="Phone number" value={formData.phone} onChange={handleChange} disabled={isCartEmpty} />

                    <label>Email Address *</label>
                    <input type="email" name="email" placeholder="Email address" value={formData.email} onChange={handleChange} disabled={isCartEmpty} />

                    <label>Street Address *</label>
                    <input type="text" name="address" placeholder="Street address" value={formData.address} onChange={handleChange} disabled={isCartEmpty} />

                    <label>City *</label>
                    <select name="city" value={formData.city} onChange={handleChange} disabled={isCartEmpty}>
                        <option value="Lahore">Lahore</option>
                        <option value="Karachi">Karachi</option>
                        <option value="Islamabad">Islamabad</option>
                    </select>

                    {isCartEmpty && (
                        <p className="checkout-page-empty-warning">
                            Your cart is empty. Please add items before placing an order.
                        </p>
                    )}
                </div>

                <div className="checkout-page-summary">
                    <h2>Your Order</h2>

                    {cartItems.map(item => (
                        <div key={item._id} className="checkout-page-product">
                            <p>{item.name}</p>
                            <p className="checkout-page-location">Location: {formData.city}</p>
                        </div>
                    ))}

                    <p>Subtotal: ₨ {subtotal}</p>
                    <p>Shipping: {shipping === 0 ? 'Free Delivery' : `₨ ${shipping}`}</p>
                    <h3>Total: ₨ {total}</h3>

                    <div className="checkout-page-payment">
                        <h4>Cash on delivery</h4>
                        <p>Pay with cash upon delivery.</p>
                    </div>

                    <button
                        className="checkout-page-placeorder-btn"
                        disabled={!isCheckoutEnabled}
                        onClick={handlePlaceOrder}
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
