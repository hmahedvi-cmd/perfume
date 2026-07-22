import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { FaGem, FaLeaf, FaHourglassHalf, FaAward } from "react-icons/fa";
import "./About.css";

// Smooth Framer-Motion based Counter
function AnimatedCounter({ value, duration = 2, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    
    const controls = animate(count, value, {
      duration: duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value, duration, inView]);

  return (
    <span ref={ref} className="counter-number">
      {displayValue}
      {suffix}
    </span>
  );
}

const timelineEvents = [
  {
    year: "2026",
    title: "The Olfactory Dream",
    description: "Founding the perfume house Aura By Hamza in Grasse and Paris with a vision to redefine slow-perfumery and artisanal blending.",
  },
  {
    year: "2027",
    title: "Signature Launch",
    description: "Introducing our first four signature blends, blending absolute jasmines and organic citruses, gaining international critical acclaim.",
  },
  {
    year: "2028",
    title: "Bespoke Perfumery",
    description: "Opening our private boutique lounge offering personal profiling consultations, creating custom formulas tailored to skin chemistry.",
  },
  {
    year: "2029",
    title: "Global Legacy",
    description: "Expanding direct sourcing networks to 42 sustainable organic bio-farms worldwide, safeguarding raw materials for future generations.",
  },
];

function About() {
  return (
    <div className="about-page-wrapper">
      {/* Luxury Editorial Hero */}
      <section className="about-hero-section">
        <div className="about-hero-overlay">
          <motion.span
            initial={{ opacity: 0, letterSpacing: "1px" }}
            animate={{ opacity: 1, letterSpacing: "6px" }}
            transition={{ duration: 1 }}
            className="about-hero-subtitle"
          >
            ESTABLISHED IN 2026
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="about-hero-title"
          >
            The Heritage of Aura
          </motion.h1>
          <div className="about-hero-divider"></div>
        </div>
      </section>

      {/* Brand Legacy Alternating Story */}
      <section className="brand-story-section container">
        <div className="story-row">
          <motion.div
            className="story-content-col"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="story-meta">OUR PHILOSOPHY</span>
            <h2 className="story-title">Crafting Liquid Memories</h2>
            <div className="story-divider"></div>
            <p>
              Perfumery is the silent language of memory. Founded with a desire to merge 
              classic french distillation methods with modern olfactory art, Aura By Hamza 
              creates signature scents that linger like unforgettable echoes.
            </p>
            <p>
              We bypass standard chemical shortcuts. Every single blend is macerated for 
              up to twelve weeks in steel barrels, allowing natural essences of absolute rose, 
              sandalwood, and bergamot to harmonize beautifully.
            </p>
          </motion.div>
          
          <motion.div
            className="story-image-col"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="story-img-wrapper">
              <img src="/images/dior.jpg" alt="Maceration and aging raw materials" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Numerical Counter Milestones */}
      <section className="milestones-section">
        <div className="container">
          <div className="milestones-grid">
            <div className="milestone-card">
              <AnimatedCounter value={42} duration={2.5} suffix="+" />
              <p className="milestone-label">ORGANIC ESSENCES</p>
            </div>
            <div className="milestone-card">
              <AnimatedCounter value={150} duration={2} suffix="K" />
              <p className="milestone-label">PATRONS GLOBALLY</p>
            </div>
            <div className="milestone-card">
              <AnimatedCounter value={12} duration={3} suffix="" />
              <p className="milestone-label">MACERATION WEEKS</p>
            </div>
            <div className="milestone-card">
              <AnimatedCounter value={100} duration={2} suffix="%" />
              <p className="milestone-label">SUSTAINABLE SOURCING</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars Grid */}
      <section className="pillars-section container">
        <h2 className="pillars-main-title">House Pillars</h2>
        <div className="pillars-grid">
          <motion.div
            className="pillar-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="pillar-icon"><FaGem /></div>
            <h3>Precious Raw Oils</h3>
            <p>Sourcing raw jasmine sambac from Mysore, and organic vetiver oils from Haiti.</p>
          </motion.div>

          <motion.div
            className="pillar-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="pillar-icon"><FaLeaf /></div>
            <h3>Ethical Pillars</h3>
            <p>100% cruelty-free formulation and completely biodegradable outer packaging.</p>
          </motion.div>

          <motion.div
            className="pillar-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="pillar-icon"><FaHourglassHalf /></div>
            <h3>Patient Formulation</h3>
            <p>Utilizing slow aging methods, preserving complex notes from quick evaporation.</p>
          </motion.div>

          <motion.div
            className="pillar-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="pillar-icon"><FaAward /></div>
            <h3>Bespoke Balancing</h3>
            <p>Expert nose adjustments matching local climates and skin profiles.</p>
          </motion.div>
        </div>
      </section>

      {/* Brand Vertical Timeline */}
      <section className="timeline-section">
        <div className="container">
          <h2 className="timeline-main-title">Our Timeline</h2>
          <div className="timeline-container">
            <div className="timeline-line"></div>
            {timelineEvents.map((evt, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.div
                  key={evt.year}
                  className={`timeline-item ${isLeft ? "left-item" : "right-item"}`}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7 }}
                >
                  <div className="timeline-dot"></div>
                  <div className="timeline-box">
                    <span className="timeline-year">{evt.year}</span>
                    <h3 className="timeline-title">{evt.title}</h3>
                    <p className="timeline-desc">{evt.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
