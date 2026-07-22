import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "../../assets/images/hero.jpg";
import "./Hero.css";

function Hero() {
  // Stagger wrapper configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(12, 12, 13, 0.7) 30%, rgba(12, 12, 13, 0.1) 100%), url(${heroImage})`,
      }}
    >
      <motion.div
        className="hero-overlay"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.span className="hero-subtitle" variants={itemVariants}>
          HAUTE PARFUMERIE
        </motion.span>
        
        <motion.h1 className="hero-title" variants={itemVariants}>
          Exquisite Scents <br />
          For The Connoisseur
        </motion.h1>

        <motion.p className="hero-desc" variants={itemVariants}>
          Discover handcrafted luxury perfumes created with rare ingredients, offering an unmatched olfactory journey.
        </motion.p>

        <motion.div variants={itemVariants}>
          <Link to="/shop" className="hero-cta-link">
            <button className="hero-cta-btn">
              Explore Collection
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Animated Floating Scroll Indicator */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 10 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1.5,
          ease: "easeInOut",
        }}
      >
        <div className="mouse-wheel">
          <div className="wheel-scroll"></div>
        </div>
        <span className="scroll-text">SCROLL TO DISCOVER</span>
      </motion.div>
    </section>
  );
}

export default Hero;