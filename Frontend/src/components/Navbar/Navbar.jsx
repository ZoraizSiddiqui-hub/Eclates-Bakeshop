import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { FaShoppingBasket, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, fetchCart } from '../../redux/cartSlice';
import { toast } from 'react-hot-toast';
import Swal from "sweetalert2";
import LoginSidebar from '../Login/LoginSidebar';

import mobu1 from '../../assets/mobu1.png';
import mobu2 from '../../assets/mobu2.png';
import bg12 from '../../assets/bg12.png';
import CartSidebar from '../CartSidebar/CartSidebar';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { getFoodItems } from '../../api/api';

const Navbar = ({
  showLogin,
  setShowLogin,
  isLoggedIn,
  setIsLoggedIn,
  showCartSidebar,
  setShowCartSidebar,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showAboutDropdown, setShowAboutDropdown] = useState(false);
  const [line, setline] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [foodItems, setFoodItems] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) =>
    Array.isArray(state.cart.items) ? state.cart.items : []
  );

  // Detect if device is mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      // Close mobile menu when resizing to desktop
      if (window.innerWidth > 768) {
        setShowMobileMenu(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
    }
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch food items for dropdown
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const res = await getFoodItems();
        if (res.data.success) {
          setFoodItems(res.data.data);
        } else {
          toast.error('Failed to load food items');
        }
      } catch (error) {
        toast.error('Server error');
        console.error(error);
      }
    };
    fetchFoodItems();
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
    toast.success('Logged out successfully');
    setShowMobileMenu(false);
    navigate('/');
  };

  const handleNavigation = (path, label) => {
    setline(label);
    navigate(path);
    setShowMobileMenu(false);
    setShowDropdown(false);
    setShowMenuDropdown(false);
    setShowAboutDropdown(false);
  };

  const MenuDropdown = ({ foodItems }) => {
    const categories = [
      'Cakes',
      'Brownies',
      'Desserts',
      'Cupcakes',
      'Sundae',
      'Cookies',
      'Mini Donuts',
    ];

    const getCount = (category) =>
      foodItems.filter((item) => item.category === category).length;

    const getRandomImageForCategory = (category) => {
      const items = foodItems.filter((item) => item.category === category);
      if (items.length === 0) return null;
      const randomIndex = Math.floor(Math.random() * items.length);
      return `http://localhost:4000/images/${items[randomIndex].image}`;
    };

    return (
      <div
        className="menu-dropdown"
        style={{
          backgroundImage: `url(${bg12})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: isMobile ? '20px' : '40px',
          borderRadius: '20px',
        }}
      >
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
                  handleNavigation(`/menu/${cat}`, 'Menu');
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="dropdown-image-wrapper">
                  <div
                    className="dropdown-category-image"
                    style={{
                      backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
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
        {/* Hamburger icon for mobile */}
        <div 
          className="hamburger" 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="Toggle menu"
        >
          {showMobileMenu ? <FaTimes className="icon" /> : <FaBars className="icon" />}
        </div>

        {/* Logo - visible on all screen sizes */}
        <div className="logo" onClick={() => handleNavigation('/', 'Home')}>
          Éclates
        </div>

        {/* Nav links */}
        <ul className={`nav-links ${showMobileMenu ? 'active' : ''}`}>
          <li
            className="nav-item-with-dropdown"
            onMouseEnter={() => !isMobile && setShowDropdown(true)}
            onMouseLeave={() => !isMobile && setShowDropdown(false)}
          >
            <span
              className={`nav-item ${line === 'Home' ? 'active' : ''}`}
              onClick={() => {
                if (isMobile) {
                  setShowDropdown(!showDropdown);
                } else {
                  handleNavigation('/', 'Home');
                }
              }}
            >
              Home<span className="underline"></span>
            </span>
            {showDropdown && (
              <Dropdown
                dispatch={dispatch}
                setShowCartSidebar={setShowCartSidebar}
                foodItems={foodItems}
                isLoggedIn={isLoggedIn}
                setShowLogin={setShowLogin}
                handleNavigation={handleNavigation}
                isMobile={isMobile}
              />
            )}
          </li>

          <li
            className="nav-item-with-dropdown"
            onMouseEnter={() => !isMobile && setShowMenuDropdown(true)}
            onMouseLeave={() => !isMobile && setShowMenuDropdown(false)}
          >
            <span
              className={`nav-item ${line === 'Menu' ? 'active' : ''}`}
              onClick={() => {
                if (isMobile) {
                  setShowMenuDropdown(!showMenuDropdown);
                } else {
                  handleNavigation('/menu', 'Menu');
                }
              }}
            >
              Menu<span className="underline"></span>
            </span>
            {showMenuDropdown && <MenuDropdown foodItems={foodItems} />}
          </li>

          <li
            className="nav-item-with-dropdown"
            onMouseEnter={() => !isMobile && setShowAboutDropdown(true)}
            onMouseLeave={() => !isMobile && setShowAboutDropdown(false)}
          >
            <span
              className={`nav-item ${line === 'About Us' ? 'active' : ''}`}
              onClick={() => {
                if (isMobile) {
                  setShowAboutDropdown(!showAboutDropdown);
                } else {
                  handleNavigation('/about', 'About Us');
                }
              }}
            >
              About Us<span className="underline"></span>
            </span>
            {showAboutDropdown && <AboutDropdown isMobile={isMobile} />}
          </li>

          <li className="nav-item-with-dropdown">
            <span
              className={`nav-item ${line === 'Contact Us' ? 'active' : ''}`}
              onClick={() => handleNavigation('/contact', 'Contact Us')}
            >
              Contact Us<span className="underline"></span>
            </span>
          </li>

          {/* Mobile-only user options */}
          {isMobile && isLoggedIn && (
            <>
              <li className="nav-item-with-dropdown">
                <span
                  className="nav-item"
                  onClick={() => {
                    navigate('/profile');
                    setShowMobileMenu(false);
                  }}
                >
                  Dashboard<span className="underline"></span>
                </span>
              </li>
              <li className="nav-item-with-dropdown">
                <span
                  className="nav-item"
                  onClick={() => {
                    navigate('/MyOrders');
                    setShowMobileMenu(false);
                  }}
                >
                  Orders<span className="underline"></span>
                </span>
              </li>
              <li className="nav-item-with-dropdown">
                <span
                  className="nav-item"
                  onClick={() => {
                    navigate('/profile');
                    setShowMobileMenu(false);
                  }}
                >
                  Account Details<span className="underline"></span>
                </span>
              </li>
              <li className="nav-item-with-dropdown">
                <span className="nav-item" onClick={handleLogout}>
                  Log Out<span className="underline"></span>
                </span>
              </li>
            </>
          )}

          {/* Mobile-only sign in button */}
          {isMobile && !isLoggedIn && (
            <li>
              <button
                className="nav-signin"
                onClick={() => {
                  setShowLogin(true);
                  setShowMobileMenu(false);
                }}
                style={{ width: '100%', marginTop: '10px' }}
              >
                Sign In
              </button>
            </li>
          )}
        </ul>

        {/* Right side icons - hidden in mobile menu */}
        <div className="nav-icons">
          <div
            className="cart-icon-wrapper"
            onClick={() => setShowCartSidebar(true)}
          >
            <FaShoppingBasket className="icon" />
            {cartItems.length > 0 && (
              <span className="cart-count">{cartItems.length}</span>
            )}
          </div>
          {isLoggedIn ? (
            <div
              className="user-icon-wrapper"
              onMouseEnter={() => !isMobile && setShowUserDropdown(true)}
              onMouseLeave={() => !isMobile && setShowUserDropdown(false)}
              onClick={() => isMobile && setShowUserDropdown(!showUserDropdown)}
            >
              <FaUserCircle className="user-icon" />
              {showUserDropdown && !isMobile && (
                <div className="user-dropdown">
                  <p onClick={() => navigate('/profile')}>Dashboard</p>
                  <p onClick={() => navigate('/MyOrders')}>Orders</p>
                  <p onClick={() => navigate('/profile')}>Account Details</p>
                  <p onClick={handleLogout}>Log Out</p>
                </div>
              )}
            </div>
          ) : (
            !isMobile && (
              <button
                className="nav-signin"
                onClick={() => setShowLogin(true)}
              >
                Sign In
              </button>
            )
          )}
        </div>
      </nav>
    </>
  );
};

/* ===== Dropdown Components ===== */

const Dropdown = ({ 
  dispatch, 
  setShowCartSidebar, 
  foodItems, 
  isLoggedIn, 
  setShowLogin,
  handleNavigation,
  isMobile 
}) => {
  const bestSellers = [
    'Ferrero Classic Cake',
    'Nutella Cake',
    'Walnut Brownie',
    'Galaxy Sundae',
  ];

  const items = foodItems.filter((item) =>
    bestSellers.includes(item.name.trim())
  );

  const [quantities, setQuantities] = useState({});
  const [maxReached, setMaxReached] = useState({});

  const handleQuantityChange = (id, delta, stock) => {
    if (stock === 0) return;
    if (maxReached[id]) {
      toast.error("Only 0 item(s) left in stock");
      return;
    }

    setQuantities((prev) => {
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

  return (
    <div
      className="dropdown"
      style={{
        backgroundImage: `url(${bg12})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: isMobile ? '20px' : '40px',
        borderRadius: '20px',
      }}
    >
      <h3>Bestselling Products</h3>
      <div className="dropdown-grid">
        {items.map((item) => (
          <div
            key={item._id}
            className={`dropdown-card ${item.stock === 0 ? "out-of-stock-card" : ""}`}
          >
            <div className="home-image-wrapper">
              <img
                src={`http://localhost:4000/images/${item.image}`}
                alt={item.name}
                className="home-image"
              />
            </div>

            <h4>{item.name}</h4>
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

const AboutDropdown = ({ isMobile }) => {
  return (
    <div
      className="about-dropdown"
      style={{
        backgroundImage: `url(${bg12})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: isMobile ? '20px' : '40px',
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
              width: isMobile ? '140px' : '180px',
              height: isMobile ? '280px' : '360px',
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
              width: isMobile ? '140px' : '180px',
              height: isMobile ? '280px' : '360px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
          ></div>
        </div>

        <p className="about-text">
          Like a fantasy that feels unreal, every delicacy holds a charm that
          enchants with every bite, allowing one to be swept into a moment of
          bliss, making all your dessert dreams come true!
        </p>
      </div>
    </div>
  );
};

export default Navbar;