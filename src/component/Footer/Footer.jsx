import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaPinterestP, FaTwitter } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container container">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <Link to="/" className="footer-logo">
            AURA <span>PARFUMS</span>
          </Link>
          <p className="brand-pitch">
            Crafting liquid emotions and signature sensory memories since 2026. Grasse-sourced, macerated to perfection.
          </p>
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest">
              <FaPinterestP />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Navigation Collections Column */}
        <div className="footer-col links-col">
          <h3>Collections</h3>
          <ul>
            <li><Link to="/shop?category=Men">Men's Fragrances</Link></li>
            <li><Link to="/shop?category=Women">Women's Fragrances</Link></li>
            <li><Link to="/shop?category=Unisex">Unisex Accords</Link></li>
            <li><Link to="/shop">All Collections</Link></li>
          </ul>
        </div>

        {/* The House Column */}
        <div className="footer-col links-col">
          <h3>The House</h3>
          <ul>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/about">Slow Perfumery</Link></li>
            <li><Link to="/about">Sustainable Pillars</Link></li>
            <li><Link to="/shop">New Arrivals</Link></li>
          </ul>
        </div>

        {/* Support/FAQ Column */}
        <div className="footer-col links-col">
          <h3>Customer Service</h3>
          <ul>
            <li><Link to="/profile">My Dashboard</Link></li>
            <li><Link to="/order-history">Order Tracking</Link></li>
            <li><Link to="/wishlist">My Favorites</Link></li>
            <li><Link to="/cart">Shopping Bag</Link></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom copyright */}
      <div className="footer-bottom">
        <div className="footer-bottom-container container">
          <p>&copy; {new Date().getFullYear()} Aura Parfums. Crafted for Excellence.</p>
          <div className="footer-legal-links">
            <Link to="/about">Privacy Policy</Link>
            <Link to="/about">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
