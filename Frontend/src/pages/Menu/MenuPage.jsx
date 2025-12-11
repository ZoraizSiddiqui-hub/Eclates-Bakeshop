import React, { useState, useEffect } from 'react';
import './MenuPage.css';
import { assets } from '../../assets/assets';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { toast } from 'react-hot-toast';

// ✅ Import API function
import { getFoodItems } from '../../api/api'; // adjust path if needed

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

const MenuPage = ({ setShowCartSidebar }) => {
  const { category } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [foodItems, setFoodItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [quantities, setQuantities] = useState({});

  // ✅ Fetch food items using api.js
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

  const handleQuantityChange = (id, delta) => {
    setQuantities(prev => {
      const newQty = Math.max((prev[id] || 1) + delta, 1);
      return { ...prev, [id]: newQty };
    });
  };

  const handleTabClick = (cat) => {
    if (cat === "All Products") {
      navigate("/menu");
    } else {
      navigate(`/menu/${cat}`);
    }
  };

  const handleAddToCart = (item, quantity) => {
    dispatch(addToCart({ ...item, quantity }));
    toast.success(`Added ${item.name} × ${quantity} to cart`);
    setShowCartSidebar(true);
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
          <div key={item._id} className="menu-card">
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
            <div className="quantity-control">
              <AiOutlineMinus
                className="qty-icon"
                onClick={() => handleQuantityChange(item._id, -1)}
              />
              <span>{quantities[item._id] || 1}</span>
              <AiOutlinePlus
                className="qty-icon"
                onClick={() => handleQuantityChange(item._id, 1)}
              />
            </div>
            <button
              className="add-btn"
              onClick={() => handleAddToCart(item, quantities[item._id] || 1)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
