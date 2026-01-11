import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";
import Swal from "sweetalert2";
import { getFoodItems } from "../../api/api";
import "./SearchBar.css";

const categories = ["cakes...", "brownies...", "donuts...", "cookies...", "cupcakes...", "desserts..."];

const SearchBar = ({ setShowCartSidebar, setShowLogin, isLoggedIn }) => {
  const dispatch = useDispatch();
  // ✅ Debug log for env variable 
  useEffect(() => { console.log("VITE_BACKEND_URL:", import.meta.env.VITE_BACKEND_URL); }, []);

  const [foodItems, setFoodItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [maxReached, setMaxReached] = useState({});
  const [displayText, setDisplayText] = useState("Search for ");

  // ✅ Fetch food items once
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const res = await getFoodItems();
        if (res.data.success) {
          setFoodItems(res.data.data);
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed to load food items",
            confirmButtonColor: "#d7938f"
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Server error",
          confirmButtonColor: "#d7938f"
        });
        console.error(error);
      }
    };
    fetchFoodItems();
  }, []);

  // ✅ Typing + deleting animation for categories
  useEffect(() => {
    let categoryIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = "Search for ";

    const typeInterval = setInterval(() => {
      const category = categories[categoryIndex];

      if (!isDeleting && charIndex <= category.length) {
        setDisplayText(currentText + category.slice(0, charIndex));
        charIndex++;
        if (charIndex > category.length) {
          setTimeout(() => {
            isDeleting = true;
          }, 1000);
        }
      } else if (isDeleting && charIndex >= 0) {
        setDisplayText(currentText + category.slice(0, charIndex));
        charIndex--;
        if (charIndex < 0) {
          isDeleting = false;
          categoryIndex = (categoryIndex + 1) % categories.length;
          charIndex = 0;
        }
      }
    }, 120);

    return () => clearInterval(typeInterval);
  }, []);

  // ✅ Handle search input
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
    const filtered = foodItems.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  // ✅ Quantity logic
  const handleQuantityChange = (id, delta, stock) => {
    if (stock === 0) return;
    if (maxReached[id]) {
      Swal.fire({
        icon: "error",
        title: "Only 0 item(s) left in stock",
        confirmButtonColor: "#d7938f"
      });
      return;
    }

    setQuantities((prev) => {
      const newQty = Math.max((prev[id] || 1) + delta, 1);
      return { ...prev, [id]: newQty };
    });
  };

  // ✅ Add to cart logic
  const handleAddToCart = async (item, quantity) => {
    if (!isLoggedIn) {
      setShowLogin(true);
      Swal.fire({
        icon: "info",
        title: "To order, first log in into your account",
        confirmButtonColor: "#d7938f"
      });
      return;
    }

    if (item.stock === 0) {
      Swal.fire({
        icon: "error",
        title: "This item is out of stock",
        confirmButtonColor: "#d7938f"
      });
      return;
    }

    if (maxReached[item._id]) {
      Swal.fire({
        icon: "error",
        title: "Only 0 item(s) left in stock",
        confirmButtonColor: "#d7938f"
      });
      return;
    }

    try {
      await dispatch(addToCart({ _id: item._id, quantity })).unwrap();
      Swal.fire({
        icon: "success",
        title: `Added ${item.name} × ${quantity} to cart`,
        confirmButtonColor: "#d7938f"
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
        confirmButtonColor: "#d7938f"
      });
    }
  };

  return (
    <div className="searchbar-container">
      {/* ✅ Search Input */}
      <div className="searchbar">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={displayText}   // 👈 animated placeholder text
          className="search-input"
        />
        <FaSearch className="search-icon" />
      </div>

      {/* ✅ Results */}
      {searchQuery.trim() !== "" && (
        <div className="search-results">
          {searchResults.length > 0 ? (
            searchResults.map((item) => (
              <div
                key={item._id}
                className={`search-card ${item.stock === 0 ? "out-of-stock-card" : ""}`}
              >
                <div className="search-image-wrapper">
                  <img
                    src={`http://localhost:4000/images/${item.image}`}
                    alt={item.name}
                    className="search-image"
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
                          title: "Only 0 item(s) left in stock",
                          confirmButtonColor: "#d7938f"
                        })
                      : handleAddToCart(item, quantities[item._id] || 1)
                  }
                >
                  {item.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            ))
          ) : (
            <div className="search-results empty">
              <p>No results found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
