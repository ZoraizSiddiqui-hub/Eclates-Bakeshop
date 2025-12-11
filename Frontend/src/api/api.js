// api.js
import axios from 'axios';

const API_URL = "http://localhost:4000/api";

// ---------------- USER APIs ----------------
export const registerUser = async (name, email, password) => {
    return axios.post(`${API_URL}/user/register`, { name, email, password });
};

export const loginUser = async (email, password) => {
    return axios.post(`${API_URL}/user/login`, { email, password });
};

// ---------------- FOOD APIs ----------------
export const getFoodItems = async () => {
    return axios.get(`${API_URL}/food/list`);
};

export const addFoodItem = async (formData) => {
    return axios.post(`${API_URL}/food/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const removeFoodItem = async (id) => {
    return axios.post(`${API_URL}/food/remove`, { id });
};

// ---------------- CART APIs ----------------
export const addToCart = async (itemId) => {
    const token = localStorage.getItem("token");
    return axios.post(
        `${API_URL}/cart/add`,
        { itemId },
        { headers: { token } }
    );
};

export const getCart = async () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API_URL}/cart/get`, { headers: { token } });
};

export const removeFromCart = async (itemId) => {
    const token = localStorage.getItem("token");
    return axios.delete(`${API_URL}/cart/remove`, {
        headers: { token },
        data: { itemId }, // DELETE requests need body as `data`
    });
};
