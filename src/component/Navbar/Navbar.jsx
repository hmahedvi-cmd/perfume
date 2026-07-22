import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingBag, FaHeart, FaBars, FaSearch, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { fetchProducts } from "../../services/productService";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Navbar.css";

function Navbar() {
  const { cartItems, removeFromCart, increaseQty, decreaseQty, totalPrice } = useCart();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // Handle scroll detection for sticky background transitions
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Pre-fetch products for instant search suggestion results
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setAllProducts(data);
      } catch (err) {
        console.error("Search pre-fetch failed:", err);
      }
    };
    getProducts();
  }, []);

  // Filter search queries instantly
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const filtered = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered.slice(0, 5)); // limit to top 5 results
  }, [searchQuery, allProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearch(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className={`site-header ${scrolled ? "header-scrolled" : "header-transparent"}`}>
        <div className="header-container">
          <Link to="/" className="luxury-logo">
            AURA <span>PARFUMS</span>
          </Link>

          <nav className="desktop-nav">
            <ul className="nav-menu">
              <li>
                <Link to="/" className="nav-item">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="nav-item">Shop</Link>
              </li>
              <li>
                <Link to="/collections" className="nav-item">Collections</Link>
              </li>
              <li>
                <Link to="/about" className="nav-item">About</Link>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <ThemeToggle />

            <button
              onClick={() => setShowSearch(true)}
              className="action-icon-btn"
              title="Search"
              aria-label="Search"
            >
              <FaSearch />
            </button>

            <Link to="/wishlist" className="action-icon-link" title="Wishlist">
              <FaHeart />
            </Link>

            <button
              onClick={() => setShowCartDrawer(true)}
              className="action-icon-btn cart-link"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <FaShoppingBag />
              {cartItems.length > 0 && (
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="cart-badge"
                >
                  {cartItems.length}
                </motion.span>
              )}
            </button>

            {isAdmin && (
              <Link to="/admin" className="admin-pill">
                Admin
              </Link>
            )}

            {user ? (
              <Link to="/profile" className="profile-pill">
                Profile
              </Link>
            ) : (
              <Link to="/login" className="login-pill">
                Login
              </Link>
            )}

            <button
              className="mobile-toggle-btn"
              onClick={() => setOpen(!open)}
              aria-label="Toggle Menu"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </header>

      {/* Luxury Fullscreen Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="search-overlay"
          >
            <div className="search-overlay-header">
              <button className="close-search-btn" onClick={() => setShowSearch(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="search-overlay-body">
              <form onSubmit={handleSearchSubmit} className="search-form">
                <input
                  type="text"
                  placeholder="SEARCH FOR A FRAGRANCE OR BRAND..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="search-input"
                />
                <button type="submit" className="search-submit-btn">
                  <FaSearch />
                </button>
              </form>

              {searchResults.length > 0 && (
                <div className="search-suggestions">
                  <h3>Suggestions</h3>
                  <div className="suggestions-list">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={() => setShowSearch(false)}
                        className="suggestion-item"
                      >
                        <img src={product.image} alt={product.name} />
                        <div className="suggestion-info">
                          <h4>{product.name}</h4>
                          <p>{product.brand} | ₹{product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive Slide-In Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="mobile-drawer-menu"
          >
            <div className="drawer-header">
              <span className="drawer-title">AURA PARFUMS</span>
              <button className="close-drawer-btn" onClick={() => setOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="drawer-links">
              <Link to="/" onClick={() => setOpen(false)}>Home</Link>
              <Link to="/shop" onClick={() => setOpen(false)}>Shop</Link>
              <Link to="/collections" onClick={() => setOpen(false)}>Collections</Link>
              <Link to="/about" onClick={() => setOpen(false)}>About</Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setOpen(false)} className="drawer-admin-link">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {showCartDrawer && (
          <motion.div
            className="cart-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCartDrawer(false)}
          >
            <motion.div
              className="cart-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="cart-drawer-header">
                <h2>Your Selection ({cartItems.length})</h2>
                <button className="close-drawer-btn" onClick={() => setShowCartDrawer(false)}>
                  &times;
                </button>
              </div>

              <div className="cart-drawer-items">
                {cartItems.length === 0 ? (
                  <div className="drawer-empty-state">
                    <FaShoppingBag className="empty-icon" />
                    <h3>Your bag is empty</h3>
                    <p>Discover our range of luxury fragrances.</p>
                    <button className="btn btn-primary" onClick={() => { setShowCartDrawer(false); navigate("/shop"); }}>
                      Shop Now
                    </button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="drawer-item">
                      <img src={item.image} alt={item.name} />
                      <div className="drawer-item-info">
                        <span className="drawer-item-brand">{item.brand}</span>
                        <h4>{item.name}</h4>
                        <div className="drawer-item-price">₹{item.price}</div>
                        <div className="drawer-item-actions">
                          <div className="drawer-qty-selector">
                            <button onClick={() => decreaseQty(item.id)} disabled={item.quantity <= 1}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => increaseQty(item.id)}>+</button>
                          </div>
                          <button className="drawer-remove-btn" onClick={() => removeFromCart(item.id)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="cart-drawer-footer">
                  <div className="drawer-summary-row">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="drawer-summary-row shipping-row">
                    <span>Shipping</span>
                    <span>Complimentary</span>
                  </div>
                  <div className="drawer-summary-row total-row">
                    <span>Total</span>
                    <span>₹{totalPrice}</span>
                  </div>

                  <Link to="/checkout" className="drawer-checkout-link" onClick={() => setShowCartDrawer(false)}>
                    <button className="drawer-checkout-btn primary">
                      Secure Checkout
                    </button>
                  </Link>
                  <Link to="/cart" className="view-bag-link" onClick={() => setShowCartDrawer(false)}>
                    View Detailed Bag
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;