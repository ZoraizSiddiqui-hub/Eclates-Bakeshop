// src/admin/pages/List/List.jsx
import React, { useState, useEffect, useCallback } from "react";
import "./List.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getFoodItems, removeFoodItem } from "../../api/api"; 

const List = () => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  // ✅ Stable fetch function
  const fetchList = useCallback(async () => {
    try {
      const response = await getFoodItems();
      if (response.data.success) {
        setList(response.data.data || []);
      } else {
        toast.error(response.data.message || "Error fetching items");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while fetching items");
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // ✅ Remove item and update local state
  const removeFood = async (foodId) => {
    try {
      const response = await removeFoodItem(foodId);
      if (response.data.success) {
        toast.success(response.data.message || "Item removed");
        setList((prev) => prev.filter((item) => item._id !== foodId));
      } else {
        toast.error(response.data.message || "Error removing food item");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error while removing food item");
    }
  };

  return (
    <div className="list add flex-col">
      <p>Complete list of food items</p>

      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Stock</b>
          <b>Actions</b>
        </div>

        {list.map((item) => (
          <div key={item._id} className="list-table-format">
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/images/${item.image}`}
              alt={item.name}
            />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>Rs.{item.price}</p>
            <p>{item.stock}</p>

            <button
              className="list-btn edit-btn"
              onClick={() => navigate(`/admin/edit/${item._id}`)}
            >
              Edit
            </button>

            <button
              className="list-btn delete-btn"
              onClick={() => removeFood(item._id)}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
