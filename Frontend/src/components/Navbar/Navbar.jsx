import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { FaSearch, FaShoppingBasket, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { toast } from 'react-hot-toast';
import LoginSidebar from '../Login/LoginSidebar';

import mobu1 from '../../assets/mobu1.png';
import mobu2 from '../../assets/mobu2.png';
import bg12 from '../../assets/bg12.png';
import CartSidebar from '../CartSidebar/CartSidebar';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { getFoodItems } from "../../api/api"; 

const Navbar = ({ showLogin, setShowLogin, isLoggedIn, setIsLoggedIn, showCartSidebar, setShowCartSidebar }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const [line, setline] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const [foodItems, setFoodItems] = useState([]); // ✅ dynamic food data

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Fetch food items from backend
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


  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const MenuDropdown = ({ foodItems }) => {
  const categories = [
    'Cakes',
    'Brownies',
    'Desserts',
    'Cupcakes',
    'Sundae',
    'Cookies',
    'Mini Donuts'
  ];

  // ✅ Use live foodItems instead of food_list
  const getCount = (category) =>
    foodItems.filter(item => item.category === category).length;

  const getRandomImageForCategory = (category) => {
    const items = foodItems.filter(item => item.category === category);
    if (items.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * items.length);
    return `http://localhost:4000/images/${items[randomIndex].image}`;  // ✅ Correct path
  };

  return (
    <div className="menu-dropdown"
      style={{
        backgroundImage: `url(${bg12})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '40px',
        borderRadius: '20px',
      }}>
      <h3>Product Category</h3>
      <div className="cake-grid">
        {categories.map((cat, index) => {
          const imageUrl = getRandomImageForCategory(cat);
          return (
            <div
              key={index}
              className="cake-card"
              onClick={(e) => {
                e.stopPropagation();
                setline("Menu");
                navigate(`/menu/${cat}`);
                setShowMenuDropdown(false);
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="dropdown-image-wrapper">
                <div
                  className="dropdown-category-image"
                  style={{
                    backgroundImage: imageUrl ? `url(${imageUrl})` : 'none'
                  }}
                />
              </div>
              <div className="cake-info">
                <p className="cake-name">{cat}</p>
                <p className="cake-price">{getCount(cat)} products</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <ul className="nav-links">
          <li
            className="nav-item-with-dropdown"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <span
              className={`nav-item ${line === "Home" ? "active" : ""}`}
              onClick={() => {
                setline("Home");
                navigate("/");
              }}
            >
              Home<span className="underline"></span>
            </span>
            {showDropdown && <Dropdown dispatch={dispatch} setShowCartSidebar={setShowCartSidebar} foodItems={foodItems} />}
          </li>

          <li
            className="nav-item-with-dropdown"
            onMouseEnter={() => setShowMenuDropdown(true)}
            onMouseLeave={() => setShowMenuDropdown(false)}
          >
            <span
              className={`nav-item ${line === "Menu" ? "active" : ""}`}
              onClick={() => {
                setline("Menu");
                navigate("/menu");
              }}
            >
              Menu<span className="underline"></span>
            </span>
            {showMenuDropdown && <MenuDropdown foodItems={foodItems} />}
          </li>

          <li className="logo">Éclates</li>

          <li
            className="nav-item-with-dropdown"
            onMouseEnter={() => setShowAboutDropdown(true)}
            onMouseLeave={() => setShowAboutDropdown(false)}
          >
            <span
              className={`nav-item ${line === "About Us" ? "active" : ""}`}
              onClick={() => {
                setline("About Us");
                navigate("/about");
              }}
            >
              About Us<span className="underline"></span>
            </span>
            {showAboutDropdown && <AboutDropdown />}
          </li>

          <li className="nav-item-with-dropdown">
            <span
              className={`nav-item ${line === "Contact Us" ? "active" : ""}`}
              onClick={() => {
                setline("Contact Us");
                navigate("/contact");
              }}
            >
              Contact Us<span className="underline"></span>
            </span>
          </li>
        </ul>

        <div className="nav-icons">
          <FaSearch className="icon" />
          <div className="cart-icon-wrapper" onClick={() => setShowCartSidebar(true)}>
            <FaShoppingBasket className="icon" />
            {cartItems.length > 0 && (
              <span className="cart-count">{cartItems.length}</span>
            )}
          </div>
          {isLoggedIn ? (
            <div
              className="user-icon-wrapper"
              onMouseEnter={() => setShowUserDropdown(true)}
              onMouseLeave={() => setShowUserDropdown(false)}
            >
              <FaUserCircle className="user-icon" />
              {showUserDropdown && (
                <div className="user-dropdown">
                  <p onClick={() => navigate("/my-account")}>Dashboard</p>
                  <p onClick={() => navigate("/my-account")}>Orders</p>
                  <p onClick={() => navigate("/my-account")}>Account Details</p>
                  <p onClick={handleLogout}>Log Out</p>
                </div>
              )}
            </div>
          ) : (
            <button className="nav-signin" onClick={() => setShowLogin(true)}>Sign In</button>
          )}
        </div>
      </nav>

      {showCartSidebar && (
        <CartSidebar onClose={() => setShowCartSidebar(false)} />
      )}
      {showLogin && (
        <LoginSidebar
          setShowLogin={setShowLogin}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
    </>
  );
};

const Dropdown = ({ dispatch, setShowCartSidebar, foodItems }) => {
  const bestSellers = [
    "Ferrero Classic Cake",
    "Nutella Cake",
    "Walnut Brownie",
    "Galaxy Sundae"
  ];

  // ✅ Use live foodItems instead of food_list
  const items = foodItems.filter(item =>
    bestSellers.includes(item.name.trim())
  );

  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (id, delta) => {
    setQuantities(prev => {
      const newQty = Math.max((prev[id] || 1) + delta, 1);
      return { ...prev, [id]: newQty };
    });
  };

  const handleAddToCart = (item, quantity) => {
    dispatch(addToCart({ ...item, quantity }));
    toast.success(`Added ${item.name} × ${quantity} to cart`);
    setShowCartSidebar(true);
  };

  return (
    <div className="dropdown"
      style={{
        backgroundImage: `url(${bg12})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '40px',
        borderRadius: '20px',
      }}>
      <h3>Bestselling Products</h3>
      <div className="dropdown-grid">
        {items.map(item => (
          <div key={item._id} className="dropdown-card">
            <div className="home-image-wrapper">
              <img
                src={`http://localhost:4000/images/${item.image}`}  // ✅ Correct path
                alt={item.name}
                className="home-image"
              />
            </div>
            <h4>{item.name}</h4>
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

const AboutDropdown = () => {
  return (
    <div className="about-dropdown"
      style={{
        backgroundImage: `url(${bg12})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '40px',
        borderRadius: '20px',
      }}
    >
      <h3>Eclates Bakeshop</h3>
      <div className="about-content">
        <div className="phone-mockups">
          <div
            className="phone left"
            style={{
              backgroundImage: `url(${mobu1})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '30px',
              width: '180px',
              height: '360px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
          ></div>

          <div
            className="phone right"
            style={{
              backgroundImage: `url(${mobu2})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '30px',
              width: '180px',
              height: '360px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
          ></div>
        </div>

        <p className="about-text">
          Like a fantasy that feels unreal, every delicacy holds a charm that enchants with every bite,
          allowing one to be swept into a moment of bliss, making all your dessert dreams come true!
        </p>
      </div>
    </div>
  );
};

export default Navbar;