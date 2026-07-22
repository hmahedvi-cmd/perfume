import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Collections.css";

const collectionsList = [
  {
    id: "men",
    title: "Men's Collection",
    category: "Men",
    subtitle: "BOLD & SOPHISTICATED",
    description: "Immerse yourself in deep woody base notes, warm amber accents, and crisp Mediterranean bergamot. Crafted for the modern gentleman of refined taste.",
    image: "/images/dior.jpg",
    link: "/shop?category=Men",
  },
  {
    id: "women",
    title: "Women's Collection",
    category: "Women",
    subtitle: "FLORAL & ENCHANTING",
    description: "A delicate symphony of handpicked May rose, sweet jasmine grandiflorum, and warm vanilla absolute. An essence of pure grace and timeless sophistication.",
    image: "/images/chanel.jpg",
    link: "/shop?category=Women",
  },
  {
    id: "unisex",
    title: "Unisex & Rare Blends",
    category: "Unisex",
    subtitle: "UNIVERSAL HARMONY",
    description: "Avant-garde scent profiles featuring smoky oud wood, Chinese pepper, and soft sandalwood notes. Designed to transcend traditional gender boundaries.",
    image: "/images/versace.jpg",
    link: "/shop?category=Unisex",
  },
];

function Collections() {
  return (
    <div className="collections-page-wrapper">
      {/* Luxury Page Title */}
      <div className="page-header-banner">
        <h1>Curated Collections</h1>
        <p>Discover olfactory profiles tailored for every occasion.</p>
      </div>

      <div className="lookbook-sections container">
        {collectionsList.map((col, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={col.id}
              className={`lookbook-row ${isEven ? "even-row" : "odd-row"}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Image Column */}
              <div className="lookbook-image-col">
                <div className="lookbook-img-wrapper">
                  <img src={col.image} alt={col.title} loading="lazy" />
                </div>
              </div>

              {/* Text Information Column */}
              <div className="lookbook-text-col">
                <div className="lookbook-text-content">
                  <span className="lookbook-subtitle">{col.subtitle}</span>
                  <h2 className="lookbook-title">{col.title}</h2>
                  <div className="lookbook-divider"></div>
                  <p className="lookbook-desc">{col.description}</p>
                  
                  <Link to={col.link} className="lookbook-btn-link">
                    <button className="lookbook-explore-btn btn-primary">
                      Explore Collection
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Collections;
