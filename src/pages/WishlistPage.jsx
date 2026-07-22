import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../component/ProductCard/ProductCard";
import { FaHeart, FaShoppingBag } from "react-icons/fa";
import "./WishlistPage.css";

function WishlistPage() {
  const { wishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>
          <FaHeart color="red" style={{ marginRight: "10px" }} /> Your Wishlist
        </h1>
        <p>Keep track of the luxury fragrances you love.</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <FaHeart className="empty-heart-icon" />
          <h3>Your wishlist is currently empty.</h3>
          <p>Explore our collections and add your favorite scents here.</p>
          <Link to="/shop" className="shop-now-btn">
            Explore Fragrances
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid-container">
          <div className="grid">
            {wishlist.map((product) => (
              <div key={product.id} className="wishlist-product-card-wrapper">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
