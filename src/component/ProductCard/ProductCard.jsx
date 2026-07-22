import React, { useState } from "react";
import { FaHeart, FaShoppingCart, FaStar, FaTimes, FaExpand } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = React.memo(function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const [showQuickView, setShowQuickView] = useState(false);
  const [qty, setQty] = useState(1);

  const liked = wishlist.some((item) => item.id === product.id);

  // Generate a premium badge based on rating or stock
  const renderBadge = () => {
    if (product.isNew) return <span className="premium-badge new-badge">New Arrival</span>;
    if (product.rating >= 4.9) return <span className="premium-badge bestseller-badge">Bestseller</span>;
    if (product.stock <= 8) return <span className="premium-badge limited-badge">Limited Edition</span>;
    return null;
  };

  const handleQuickViewCartAdd = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
    toast.success(`Added ${qty} x ${product.name} to Cart`);
    setShowQuickView(false);
    setQty(1);
  };

  return (
    <div className="product-card-wrapper">
      <motion.div
        className="luxury-card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="card-image-wrapper">
          {renderBadge()}
          <Link to={`/product/${product.id}`} className="product-image-link">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="card-product-img"
            />
          </Link>
          
          {/* Quick View Trigger Overlay */}
          <button
            className="quick-view-btn"
            onClick={() => setShowQuickView(true)}
            title="Quick View"
          >
            <FaExpand /> Quick View
          </button>
        </div>

        <div className="card-info">
          <span className="card-brand">{product.brand}</span>
          <Link to={`/product/${product.id}`} className="card-title-link">
            <h3 className="card-title">{product.name}</h3>
          </Link>
          
          <div className="card-meta">
            <div className="card-rating">
              <FaStar />
              <span>{product.rating}</span>
            </div>
            <span className="card-price">₹{product.price}</span>
          </div>

          <div className="card-actions">
            <button
              onClick={() => toggleWishlist(product)}
              className={`card-wishlist-btn ${liked ? "liked" : ""}`}
              aria-label="Wishlist"
            >
              <FaHeart />
            </button>

            <button
              className="card-cart-btn"
              onClick={() => {
                addToCart(product);
                toast.success(`Added ${product.name} to Cart`);
              }}
            >
              <FaShoppingCart /> <span className="btn-text">Add to Cart</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {showQuickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="quick-view-modal-backdrop"
            onClick={() => setShowQuickView(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="quick-view-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-modal-btn"
                onClick={() => setShowQuickView(false)}
              >
                <FaTimes />
              </button>

              <div className="quick-view-grid">
                <div className="quick-view-image-container">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="quick-view-info-container">
                  <span className="quick-view-brand">{product.brand}</span>
                  <h2>{product.name}</h2>
                  <div className="quick-view-meta">
                    <span className="quick-view-price">₹{product.price}</span>
                    <div className="quick-view-rating">
                      <FaStar /> {product.rating} / 5
                    </div>
                  </div>
                  
                  <p className="quick-view-desc">{product.description}</p>
                  
                  {product.notes && product.notes.length > 0 && (
                    <div className="quick-view-notes">
                      <strong>Notes:</strong> {product.notes.join(", ")}
                    </div>
                  )}

                  <div className="quick-view-buy-section">
                    <div className="qty-selector">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        disabled={qty <= 1}
                      >
                        -
                      </button>
                      <span>{qty}</span>
                      <button onClick={() => setQty(qty + 1)}>+</button>
                    </div>

                    <button
                      className="quick-view-add-btn"
                      onClick={handleQuickViewCartAdd}
                    >
                      <FaShoppingCart /> <span className="btn-text">Add To Cart</span>
                    </button>
                  </div>

                  <Link
                    to={`/product/${product.id}`}
                    onClick={() => setShowQuickView(false)}
                    className="full-details-link"
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default ProductCard;