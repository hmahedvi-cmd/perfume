import { useParams, Link } from "react-router-dom";
import { getProductById, fetchProducts } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useState, useEffect, useRef } from "react";
import { FaStar, FaHeart, FaChevronRight, FaShoppingCart, FaShieldAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ProductCard from "../component/ProductCard/ProductCard";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("profile");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Zoom magnifier states
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });
  const containerRef = useRef(null);

  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);

        if (data) {
          const all = await fetchProducts();
          const filteredRelated = all.filter(
            (item) => item.category === data.category && item.id !== data.id
          );
          setRelated(filteredRelated);
        }
      } catch (error) {
        console.error("Failed to load product details:", error);
      } finally {
        setLoading(false);
        setActiveImageIndex(0); // Reset gallery index
      }
    };
    loadProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="product-details-loading-container">
        <div className="luxury-spinner"></div>
        <p>REVEALING OLFACTORY ACCORDS...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-error-container">
        <h2>Olfactory Record Not Found</h2>
        <p>The fragrance you are searching for is out of collection.</p>
        <Link to="/shop" className="btn btn-primary">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const liked = wishlist.some((item) => item.id === product.id);

  // Simulate multiple viewpoints in gallery using the single main image
  const galleryImages = [
    product.image,
    product.image, // angles simulated via CSS zooms in stylesheets
    product.image,
  ];

  // Mouse move zoom magnifying logic
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundImage: `url(${product.image})`,
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  const handleCartAdd = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
    toast.success(`Added ${qty} x ${product.name} to Cart`);
  };

  return (
    <div className="details-page-wrapper">
      {/* Breadcrumbs */}
      <div className="breadcrumbs container">
        <Link to="/">Home</Link> <FaChevronRight />
        <Link to="/shop">Shop</Link> <FaChevronRight />
        <span>{product.name}</span>
      </div>

      <div className="details-container container">
        {/* Left Column: Image Gallery */}
        <div className="details-left">
          <div className="gallery-main-viewport">
            <div
              className="gallery-main-image-wrapper"
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={galleryImages[activeImageIndex]}
                alt={product.name}
                className={`main-display-img angle-${activeImageIndex}`}
              />
              {/* Zoom Panel */}
              <div className="zoom-panel-overlay" style={zoomStyle}></div>
            </div>
          </div>
          
          <div className="gallery-thumbnails">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                className={`thumb-btn ${activeImageIndex === idx ? "active" : ""}`}
                onClick={() => setActiveImageIndex(idx)}
              >
                <img
                  src={img}
                  alt={`Viewpoint ${idx + 1}`}
                  className={`angle-${idx}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Information Panel */}
        <div className="details-right">
          <div className="details-sticky-info">
            <span className="details-brand">{product.brand}</span>
            <h1 className="details-title">{product.name}</h1>
            
            <div className="details-rating-row">
              <div className="stars">
                <FaStar /> <span className="rating-value">{product.rating} / 5</span>
              </div>
              <span className="details-category-badge">{product.category}</span>
            </div>

            <div className="details-price">₹{product.price}</div>

            <p className="details-description">{product.description}</p>

            {/* Bubble capsule Fragrance Notes */}
            {product.notes && product.notes.length > 0 && (
              <div className="fragrance-notes-section">
                <h3>Olfactory Accords</h3>
                <div className="notes-capsules">
                  {product.notes.map((note) => (
                    <span key={note} className="note-capsule">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="details-buy-panel">
              <label className="buy-label">Quantity</label>
              <div className="buy-controls-row">
                <div className="qty-selector">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1}>
                    -
                  </button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(qty + 1)}>+</button>
                </div>

                <button className="details-cart-btn" onClick={handleCartAdd}>
                  <FaShoppingCart /> <span className="btn-text">Add To Cart</span>
                </button>

                <button
                  className={`details-wishlist-btn ${liked ? "liked" : ""}`}
                  onClick={() => toggleWishlist(product)}
                >
                  <FaHeart />
                </button>
              </div>

              <Link
                to="/checkout"
                onClick={() => addToCart(product)}
                className="details-buy-now-link"
              >
                <button className="details-buy-now-btn accent">
                  Buy It Now
                </button>
              </Link>
            </div>

            {/* Collapsible Info Tabs */}
            <div className="details-info-tabs">
              <div className="tabs-header">
                <button
                  className={`tab-link ${activeTab === "profile" ? "active" : ""}`}
                  onClick={() => setActiveTab("profile")}
                >
                  Scent Profile
                </button>
                <button
                  className={`tab-link ${activeTab === "sourcing" ? "active" : ""}`}
                  onClick={() => setActiveTab("sourcing")}
                >
                  Sourcing
                </button>
                <button
                  className={`tab-link ${activeTab === "shipping" ? "active" : ""}`}
                  onClick={() => setActiveTab("shipping")}
                >
                  Maceration
                </button>
              </div>
              <div className="tabs-content">
                {activeTab === "profile" && (
                  <p>
                    A premium orchestration featuring top notes of sweet bergamot, leading into
                    a heart of absolute floral jasmines, resting on a deep base of oakmoss and
                    precious sandalwood. Long-lasting (8-12 hours sillage).
                  </p>
                )}
                {activeTab === "sourcing" && (
                  <p>
                    We partner directly with sustainable bio-farms in Grasse, France, and Mysore,
                    India. 100% vegan, cruelty-free, and formulated without synthetic colorants
                    or harsh parabens.
                  </p>
                )}
                {activeTab === "shipping" && (
                  <p>
                    Each bottle is matured and macerated for exactly twelve weeks inside stainless 
                    steel tanks. This allows natural essential oils to blend perfectly with pure 
                    organic alcohol before bottling.
                  </p>
                )}
              </div>
            </div>

            <div className="security-badges">
              <span><FaShieldAlt /> 100% Authentic Guarantee</span>
              <span><FaShieldAlt /> Safe Secure SSL Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Grid */}
      <section className="details-related container">
        <h2 className="related-title">You May Also Exquisite</h2>
        <div className="accent-divider"></div>
        {related.length === 0 ? (
          <p className="no-related">No alternative selections found.</p>
        ) : (
          <div className="grid">
            {related.slice(0, 3).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProductDetails;