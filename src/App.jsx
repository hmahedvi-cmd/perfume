import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { FaArrowUp } from "react-icons/fa";

import Navbar from "./component/Navbar/Navbar";
import Footer from "./component/Footer/Footer";
import ProtectedRoute from "./component/ProtectedRoute";
import AdminRoute from "./component/AdminRoute";
import { seedProducts } from "./services/productService";

// Lazy loading pages for optimized performance
const Home = React.lazy(() => import("./pages/Home"));
const ProductDetails = React.lazy(() => import("./pages/ProductDetails"));
const Cart = React.lazy(() => import("./component/pages/Cart"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const OrderSuccess = React.lazy(() => import("./pages/OrderSuccess"));
const OrderHistory = React.lazy(() => import("./pages/OrderHistory"));
const Shop = React.lazy(() => import("./pages/Shop"));
const Collections = React.lazy(() => import("./pages/Collections"));
const About = React.lazy(() => import("./pages/About"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const WishlistPage = React.lazy(() => import("./pages/WishlistPage"));

// Sleek loading fallback matching luxury branding
function PageLoader() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "70vh",
      gap: "20px",
    }}>
      <div className="luxury-spinner" style={{
        width: "50px",
        height: "50px",
        border: "3px solid rgba(170, 59, 255, 0.1)",
        borderTop: "3px solid var(--accent)",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}></div>
      <p style={{
        fontFamily: "var(--heading)",
        fontSize: "16px",
        letterSpacing: "2px",
        color: "var(--text)",
        textTransform: "uppercase"
      }}>LuxeScent is loading...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function App() {
  // Client-side auto-seeding of database products
  useEffect(() => {
    seedProducts();
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <BrowserRouter>
      <motion.div className="scroll-progress-bar" style={{ scaleX }} />
      <Navbar />

      <React.Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-history"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </React.Suspense>

      <Footer />

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            onClick={scrollToTop}
            className="back-to-top-btn"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            aria-label="Back to top"
          >
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>

      <ToastContainer position="top-right" />
    </BrowserRouter>
  );
}

export default App;