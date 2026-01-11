import React, { useEffect, useState } from 'react';
import '../Menu/MenuPage.css'; 
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { getFoodItems } from '../../api/api';
import Swal from "sweetalert2";

const BestSellersPage = ({ setShowCartSidebar, isLoggedIn, setShowLogin }) => {
  const dispatch = useDispatch();
  const [foodItems, setFoodItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [maxReached, setMaxReached] = useState({});

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const res = await getFoodItems();
        if (res.data.success) {
          const allItems = res.data.data;
          setFoodItems(allItems);

          // ✅ Filter only Best Sellers
          const bestSellerNames = [
            "Lotus Three Milk Cake",
            "Fudge Brownie",
            "Nutella Cookie",
            "Walnut Brownie"
          ];
          setFilteredItems(allItems.filter(item => bestSellerNames.includes(item.name)));
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed to load food items"
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Server error"
        });
        console.error(error);
      }
    };

    fetchFoodItems();
  }, []);

  const handleQuantityChange = (id, delta, stock) => {
    if (stock === 0) return;
    if (maxReached[id]) {
      Swal.fire({
        icon: "error",
        title: "Only 0 item(s) left in stock"
      });
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
      const message = typeof err === 'string' ? err : 'Failed to add to cart';
      if (message.includes('Only 0 item(s) left in stock')) {
        setMaxReached(prev => ({ ...prev, [item._id]: true }));
      }
      Swal.fire({
        icon: "error",
        title: message
      });
    }
  };

  return (
    <div className="menu-page">
      <div className="menu-banner">
        <h1>Best Sellers</h1>
      </div>

      <div className="menu-grid">
        {filteredItems.map(item => (
          <div key={item._id} className={`menu-card ${item.stock === 0 ? "out-of-stock-card" : ""}`}>
            <div className="menu-image-wrapper">
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/images/${item.image}`}
                alt={item.name}
                className="menu-image"
              />
            </div>

            <h3>{item.name}</h3>
            {item.weight && <p className="weight">{item.weight}</p>}
            <p className="desc">{item.description}</p>
            <p className="price">₨ {item.price}</p>

            {item.stock > 0 ? (
              <p className="in-stock">In Stock</p>
            ) : (
              <p className="out-of-stock">Out of Stock</p>
            )}

            <div className="quantity-control">
              <AiOutlineMinus
                className={`qty-icon ${item.stock === 0 || maxReached[item._id] ? "disabled" : ""}`}
                onClick={() => handleQuantityChange(item._id, -1, item.stock)}
              />
              <span>{quantities[item._id] || 1}</span>
              <AiOutlinePlus
                className={`qty-icon ${item.stock === 0 || maxReached[item._id] ? "disabled" : ""}`}
                onClick={() => handleQuantityChange(item._id, 1, item.stock)}
              />
            </div>

            <button
              className={`add-btn ${item.stock === 0 || maxReached[item._id] ? "disabled-btn" : ""}`}
              onClick={() =>
                maxReached[item._id]
                  ? Swal.fire({
                      icon: "error",
                      title: "Only 0 item(s) left in stock"
                    })
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

export default BestSellersPage;
