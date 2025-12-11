import React from 'react';
import './footer.css';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { FaInstagram, FaFacebookF, FaPinterestP, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">

        {/* Navigation */}
        <div className="footer-column">
          <h4 className="footer-heading">Navigate</h4>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/menu">Menu / Products</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-column">
          <h4 className="footer-heading">Contact</h4>
          <ul className="footer-contact">
            <li><FaPhoneAlt /> +92 300 1234567</li>
            <li><FaEnvelope /> hello@eclates.com</li>
            <li><FaMapMarkerAlt /> 12 Bakery Lane, Lahore</li>
            <li><FaClock /> Mon–Sat: 10am – 8pm</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-column">
          <h4 className="footer-heading">Stay Updated</h4>
          <p className="footer-subtext">Get sweet updates in your inbox</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email" />
            <button type="submit">Subscribe</button>
          </form>
          <p className="footer-incentive">🎁 10% off your first order</p>
        </div>

        {/* Social Icons */}
        <div className="footer-column">
          <h4 className="footer-heading">Follow Us</h4>
          <div className="social-icons">
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaPinterestP /></a>
            <a href="#"><FaTiktok /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Eclates Bakeshop</p>
      </div>
    </footer>
  );
};

export default Footer;
