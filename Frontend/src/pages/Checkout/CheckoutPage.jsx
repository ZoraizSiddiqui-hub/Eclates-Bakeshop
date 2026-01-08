// src/pages/Checkout/CheckoutPage.jsx
import React, { useState } from 'react';
import './CheckoutPage.css';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCartThunk } from "../../redux/cartSlice";

const CheckoutPage = () => {
    const cartItems = useSelector(state => state.cart.items);
    const isCartEmpty = cartItems.length === 0;
    const dispatch = useDispatch();

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = isCartEmpty ? 0 : subtotal >= 1000 ? 0 : 300;
    const total = isCartEmpty ? 0 : subtotal + shipping;

    // Updated address structure to match backend schema
    const [address, setAddress] = useState({
        fullName: "",
        phone: "",
        street: "",
        city: "Lahore",
        postalCode: ""
    });

    const isFormComplete = Object.values(address).every(field => field.trim() !== "");
    const isCheckoutEnabled = !isCartEmpty && isFormComplete;

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();

    const handlePlaceOrder = async () => {
        if (!isCheckoutEnabled) return;

        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");

            const res = await fetch("http://localhost:4000/api/orders/place", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, 
                },
                body: JSON.stringify({ address }),
            });

            const data = await res.json();

            if (!data.success) {
                alert(data.message);
                return;
            }

            // ✅ Clear Redux cart after successful order
            dispatch(clearCartThunk());

            // ✅ Redirect to success page with orderId
            navigate(`/placeorder/${data.order._id}`);
        } catch (error) {
            console.log(error);
            alert("Error placing order");
        }
    };

    return (
        <div className="checkout-page">
            <div className="banner">
                <h1>Checkout</h1>
            </div>

            <div className="checkout-page-content">
                <div className={`checkout-page-form ${isCartEmpty ? 'disabled' : ''}`}>
                    <h2>Billing & Shipping</h2>

                    <label>Full Name *</label>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={address.fullName}
                        onChange={handleChange}
                        disabled={isCartEmpty}
                    />

                    <label>Phone *</label>
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone number"
                        value={address.phone}
                        onChange={handleChange}
                        disabled={isCartEmpty}
                    />

                    <label>Street Address *</label>
                    <input
                        type="text"
                        name="street"
                        placeholder="Street address"
                        value={address.street}
                        onChange={handleChange}
                        disabled={isCartEmpty}
                    />

                    <label>City *</label>
                    <select
                        name="city"
                        value={address.city}
                        onChange={handleChange}
                        disabled={isCartEmpty}
                    >
                        <option value="Lahore">Lahore</option>
                        <option value="Karachi">Karachi</option>
                        <option value="Islamabad">Islamabad</option>
                    </select>

                    <label>Postal Code *</label>
                    <input
                        type="text"
                        name="postalCode"
                        placeholder="Postal Code"
                        value={address.postalCode}
                        onChange={handleChange}
                        disabled={isCartEmpty}
                    />

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
                            <p className="checkout-page-location">Location: {address.city}</p>
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
