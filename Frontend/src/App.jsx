// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar/Navbar';
import SearchBar from './components/SearchBar/SearchBar';
import Home from './pages/Home/Home';
import CartPage from './pages/Cart/CartPage';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Hero from './components/Hero/Hero';
import UnderHero from './components/UnderHero/UnderHero';
import CategorySlider from './components/CategorySlider/CategorySlider';
import AboveFooter from './components/AboveFooter/AboveFooter';
import Footer from './components/Footer/Footer';
import MenuPage from './pages/Menu/MenuPage';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import LoginSidebar from './components/Login/LoginSidebar';
import CartSidebar from './components/CartSidebar/CartSidebar';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import MyAccountPage from './pages/MyAccountPage/MyAccountPage';
import UserProfile from './pages/UserProfile/UserProfile';
import MyOrders from './pages/MyOrders/MyOrders';
import UpdateProfile from './pages/UpdateProfile/UpdateProfile';
import OrderDetails from './pages/OrderDetails/OrderDetails';
import BestSellersPage from './pages/BestSellersPage/BestSellersPage';
import ChocolateSpecialsPage from './pages/ChocolateSpecialsPage/ChocolateSpecialsPage';
import CustomOrdersPage from './pages/CustomOrdersPage/CustomOrdersPage';
import AboutUs from './pages/AboutUs/AboutUs';
import ContactUs from './pages/ContactUs/ContactUs';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showCartSidebar, setShowCartSidebar] = useState(false);

  // ✅ Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return !!token;
  });

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // ✅ Food items state for CategorySlider
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/food/list");
        const data = await res.json();
        if (data.success) {
          setFoodItems(data.data);
        } else {
          console.error("Failed to load food items:", data.message);
        }
      } catch (err) {
        console.error("Error fetching food items:", err);
      }
    };

    fetchFoodItems();
  }, []);

  return (
    <Provider store={store}>
      <Toaster position="top-right" />
      {showLogin && (
        <LoginSidebar
          setShowLogin={setShowLogin}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
      {showCartSidebar && <CartSidebar onClose={() => setShowCartSidebar(false)} />}
      <div className='app'>
        <ScrollToTop />
        <Navbar
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          showCartSidebar={showCartSidebar}
          setShowCartSidebar={setShowCartSidebar}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <SearchBar 
                setShowCartSidebar={setShowCartSidebar} 
                isLoggedIn={isLoggedIn} 
                setShowLogin={setShowLogin}/>
                <CategorySlider foodItems={foodItems} />
                <UnderHero />
                <Home />
                <AboveFooter />
              </>
            }
          />
          <Route
            path="/menu"
            element={<MenuPage 
            setShowCartSidebar={setShowCartSidebar}
            isLoggedIn={isLoggedIn} 
            setShowLogin={setShowLogin} />}
          />
          <Route
            path="/menu/:category"
            element={<MenuPage setShowCartSidebar={setShowCartSidebar}
            isLoggedIn={isLoggedIn} 
            setShowLogin={setShowLogin}  />}
          />
          <Route
            path="/best-sellers"
            element={<BestSellersPage setShowCartSidebar={setShowCartSidebar}
            isLoggedIn={isLoggedIn} 
            setShowLogin={setShowLogin}  />}
          />
          <Route
            path="/chocolate-specials"
            element={<ChocolateSpecialsPage setShowCartSidebar={setShowCartSidebar}
            isLoggedIn={isLoggedIn} 
            setShowLogin={setShowLogin}  />}
          />
          <Route
            path="/custom-orders"
            element={<CustomOrdersPage setShowCartSidebar={setShowCartSidebar}
            isLoggedIn={isLoggedIn} 
            setShowLogin={setShowLogin}  />}
          />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/placeorder/:orderId" element={<PlaceOrder />} />
          <Route
            path="/my-account"
            element={
              <ProtectedRoute>
                <MyAccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/MyOrders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-profile"
            element={
              <ProtectedRoute>
                <UpdateProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order/:orderId"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Provider>
  );
};

export default App;
