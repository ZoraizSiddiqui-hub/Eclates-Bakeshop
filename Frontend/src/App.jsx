import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import CartPage from './pages/Cart/CartPage';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Hero from './components/Hero/Hero';
import UnderHero from './components/UnderHero/UnderHero';
import CategorySlider from './components/CategorySlider/CategorySlider';
import AboveFooter from './components/aboveFooter/aboveFooter';
import Footer from './components/Footer/Footer';
import MenuPage from './pages/Menu/MenuPage';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import LoginSidebar from './components/Login/LoginSidebar';
import CartSidebar from './components/CartSidebar/CartSidebar';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import MyAccountPage from './pages/MyAccountPage/MyAccountPage';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showCartSidebar, setShowCartSidebar] = useState(false);

  // Check both localStorage and sessionStorage for token
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return !!token;
  });

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
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
                <CategorySlider />
                <Home />
                <UnderHero />
                <AboveFooter />
              </>
            }
          />
          <Route
            path="/menu"
            element={<MenuPage setShowCartSidebar={setShowCartSidebar} />}
          />
          <Route
            path="/menu/:category"
            element={<MenuPage setShowCartSidebar={setShowCartSidebar} />}
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/placeorder" element={<PlaceOrder />} />
          <Route
            path="/my-account"
            element={
              <ProtectedRoute>
                <MyAccountPage />
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
