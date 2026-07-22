import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchProducts } from "../services/productService";
import ProductCard from "../component/ProductCard/ProductCard";
import Skeleton from "../component/Skeleton/Skeleton";
import "./FeaturedProducts.css";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchProducts();
      // Slice top 4 products for signature homepage spotlight
      setProducts(data.slice(0, 4));
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <section className="featured-showcase container">
      <motion.div
        className="showcase-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <span className="showcase-subtitle">OUR SELECTION</span>
        <h2 className="showcase-title">The Signature Collection</h2>
        <div className="accent-divider"></div>
        <p className="showcase-description">
          A sensory journey defined by rare essences, meticulous craftsmanship, and timeless elegance.
        </p>
      </motion.div>

      <div className="grid">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} />
            ))
          : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>

      <motion.div
        className="showcase-footer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Link to="/shop" className="explore-all-link">
          <button className="btn-explore-all">
            View All Fragrances
          </button>
        </Link>
      </motion.div>
    </section>
  );
}

export default FeaturedProducts;