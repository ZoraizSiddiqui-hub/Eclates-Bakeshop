import React, { useState, useEffect } from 'react';
import './MenuPage.css';
import { assets } from '../../assets/assets';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { toast } from 'react-hot-toast';
import { getFoodItems } from '../../api/api';
import Swal from "sweetalert2";

const categories = [
  "All Products",
  "Brownies",
  "Cakes",
  "Cookies",
  "Cupcakes",
  "Desserts",
  "Mini Donuts",
  "Sundae"
];

const MenuPage = ({ setShowCartSidebar, isLoggedIn, setShowLogin }) => {
  const { category } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [foodItems, setFoodItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [maxReached, setMaxReached] = useState({}); // itemId -> true when backend says 0 left

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const res = await getFoodItems();
        if (res.data.success) {
          setFoodItems(res.data.data);
        } else {
          toast.error("Failed to load food items");
        }
      } catch (error) {
        toast.error("Server error");
        console.error(error);
      }
    };

    fetchFoodItems();
  }, []);

  useEffect(() => {
    if (category && categories.includes(category)) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory("All Products");
    }
  }, [category]);

  useEffect(() => {
    if (selectedCategory === "All Products") {
      setFilteredItems(foodItems);
    } else {
      setFilteredItems(foodItems.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, foodItems]);

  const getCategoryCount = (category) => {
    if (category === "All Products") return foodItems.length;
    return foodItems.filter(item => item.category === category).length;
  };

  const handleQuantityChange = (id, delta, stock) => {
    if (stock === 0) return;
    if (maxReached[id]) {
      toast.error("Only 0 item(s) left in stock");
      return;
    }

    setQuantities(prev => {
      const newQty = Math.max((prev[id] || 1) + delta, 1);
      return { ...prev, [id]: newQty };
    });
  };

  const handleAddToCart = async (item, quantity) => {
    if (!isLoggedIn) {
      setShowLogin(true);
      Swal.fire({
        icon: "info",
        title: "To order, first log in into your account"
      });
      return;
    }

    if (item.stock === 0) {
      Swal.fire({
        icon: "error",
        title: "This item is out of stock"
      });
      return;
    }

    if (maxReached[item._id]) {
      Swal.fire({
        icon: "error",
        title: "Only 0 item(s) left in stock"
      });
      return;
    }

    try {
      await dispatch(addToCart({ _id: item._id, quantity })).unwrap();
      Swal.fire({
        icon: "success",
        title: `Added ${item.name} × ${quantity} to cart`
      });
      setShowCartSidebar(true);
    } catch (err) {
      const message = typeof err === "string" ? err : "Failed to add to cart";
      if (message.includes("Only 0 item(s) left in stock")) {
        setMaxReached((prev) => ({ ...prev, [item._id]: true }));
      }
      Swal.fire({
        icon: "error",
        title: message,
      });
    }
  };


  const handleTabClick = (cat) => {
    if (cat === "All Products") {
      navigate("/menu");
    } else {
      navigate(`/menu/${cat}`);
    }
  };

  return (
    <div className="menu-page">
      <div className="menu-banner">
        <h1>{selectedCategory}</h1>
        <div className="menu-category-cards">
          {categories.map(cat => (
            <div
              key={cat}
              className={`category-card ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => handleTabClick(cat)}
            >
              {cat !== "All Products" && (
                <img
                  src={assets.category_images[cat]}
                  alt={`${cat} Icon`}
                  className="category-icon"
                />
              )}
              <p className="category-name">{cat}</p>
              <p className="category-count">{getCategoryCount(cat)} Products</p>
            </div>
          ))}
        </div>
      </div>

      <div className="menu-grid">
        {filteredItems.map(item => (
          <div key={item._id} className={`menu-card ${item.stock === 0 ? "out-of-stock-card" : ""}`}>
            <div className="menu-image-wrapper">
              <img
                src={`http://localhost:4000/images/${item.image}`}
                alt={item.name}
                className="menu-image"
              />
            </div>

            <h3>{item.name}</h3>
            {item.weight && <p className="weight">{item.weight}</p>}
            <p className="desc">{item.description}</p>
            <p className="price">₨ {item.price}</p>

            {/* Stock text comes from REAL stock field */}
            {item.stock > 0 ? (
              <p className="in-stock">In Stock</p>
            ) : (
              <p className="out-of-stock">Out of Stock</p>
            )}

            {/* Quantity Controls */}
            <div className="quantity-control">
              <AiOutlineMinus
                className={`qty-icon ${item.stock === 0 || maxReached[item._id] ? "disabled" : ""
                  }`}
                onClick={() => handleQuantityChange(item._id, -1, item.stock)}
              />
              <span>{quantities[item._id] || 1}</span>
              <AiOutlinePlus
                className={`qty-icon ${item.stock === 0 || maxReached[item._id] ? "disabled" : ""
                  }`}
                onClick={() => handleQuantityChange(item._id, 1, item.stock)}
              />
            </div>

            {/* Add to Cart */}
            <button
              className={`add-btn ${item.stock === 0 || maxReached[item._id] ? "disabled-btn" : ""
                }`}
              onClick={() =>
                maxReached[item._id]
                  ? toast.error("Only 0 item(s) left in stock")
                  : handleAddToCart(item, quantities[item._id] || 1)
              }
            >
              {item.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
