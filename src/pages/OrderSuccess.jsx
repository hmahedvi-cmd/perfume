import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import "./OrderSuccess.css";

function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Clear cart immediately on landing
    clearCart();

    const finalizeOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const orderRef = doc(db, "orders", orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
          setError("Order record not found.");
        }
      } catch (err) {
        console.error("Error finalizing order:", err);
        setError("Failed to verify order details.");
      } finally {
        setLoading(false);
      }
    };

    finalizeOrder();
  }, [orderId]);

  return (
    <div className="success-page">
      <motion.div
        className="success-card"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <FaCheckCircle className="success-icon" />
        <h1>Order Placed Successfully!</h1>
        <p className="thank-you-msg">Thank you for shopping with Aura By Hamza.</p>

        {orderId && (
          <div className="order-details-box">
            <span className="order-id-title">YOUR ORDER ID</span>
            <span className="order-id-value">{orderId}</span>
          </div>
        )}

        {loading ? (
          <p className="verifying-text">Validating order details...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <p className="success-status-text">
            Your payment is verified. We are preparing your order for shipment.
          </p>
        )}

        <div className="success-actions">
          <Link to="/order-history" className="history-btn">
            View Order History
          </Link>
          <Link to="/shop" className="continue-btn">
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default OrderSuccess;