import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;
const API_URL = `${backendURL}/api`;

// ---------------- Helper ----------------
const getAuthHeader = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// ---------------- AUTH ----------------
export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${API_URL}/users/login`, { email, password });
    return res;
  } catch (error) {
    console.error("Login API error:", error);
    if (error.response) {
      console.error("Backend error:", error.response.data);
    }
    throw error;
  }
};

// ---------------- FOOD APIs ----------------
export const getFoodItems = async () => {
  return axios.get(`${API_URL}/food/list`);
};

export const addFoodItem = async (formData) => {
  return axios.post(`${API_URL}/food/add`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...getAuthHeader(),
    },
  });
};

export const updateFoodItem = async (id, formData) => {
  return axios.put(`${API_URL}/food/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...getAuthHeader(),
    },
  });
};

export const removeFoodItem = async (id) => {
  return axios.post(
    `${API_URL}/food/remove`,
    { id },
    { headers: getAuthHeader() }
  );
};

// ---------------- ADMIN ORDER APIs ----------------
export const fetchAllOrdersAPI = async () => {
  return axios.get(`${API_URL}/orders/admin/all`, { headers: getAuthHeader() });
};

export const getOrderByIdAPI = async (orderId) => {
  return axios.get(`${API_URL}/orders/admin/${orderId}`, {
    headers: getAuthHeader(),
  });
};

export const updateOrderStatusAPI = async (orderId, status) => {
  return axios.put(
    `${API_URL}/orders/admin/update-status`,
    { orderId, status },
    { headers: getAuthHeader() }
  );
};

// ---------------- ADMIN USER APIs ----------------
export const fetchAllUsersAPI = async () => {
  return axios.get(`${API_URL}/users/all`, { headers: getAuthHeader() });
};

export const promoteUserToAdminAPI = async (email) => {
  return axios.put(
    `${API_URL}/users/make-admin`,
    { email },
    {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    }
  );
};
