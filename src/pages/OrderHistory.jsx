import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./OrderHistory.css";

function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "orders"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetched = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() });
        });

        // Sort by date locally to avoid index requirements
        fetched.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });

        setOrders(fetched);
      } catch (err) {
        console.error("Error loading orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "status-delivered";
      case "shipped":
        return "status-shipped";
      case "pending":
      default:
        return "status-pending";
    }
  };

  return (
    <div className="order-history-page">
      <h1>Your Order History</h1>

      {loading ? (
        <div className="loading-spinner">Loading your order history...</div>
      ) : orders.length === 0 ? (
        <div className="no-orders">
          <h3>You have not placed any orders yet.</h3>
          <Link to="/shop" className="shop-now-btn">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              className="order-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="order-header">
                <div>
                  <span className="order-meta-label">ORDER ID</span>
                  <span className="order-meta-val">{order.id}</span>
                </div>
                <div>
                  <span className="order-meta-label">DATE</span>
                  <span className="order-meta-val">{formatDate(order.createdAt)}</span>
                </div>
                <div>
                  <span className="order-meta-label">TOTAL</span>
                  <span className="order-meta-val total-price">₹{order.total}</span>
                </div>
                <div>
                  <span className="order-meta-label">STATUS</span>
                  <span className={`status-badge ${getStatusClass(order.status || "Pending")}`}>
                    {order.status || "Pending"}
                  </span>
                </div>
              </div>

              <div className="order-body">
                <div className="order-items-list">
                  {order.items?.map((item, index) => (
                    <div key={index} className="order-item-row">
                      <img src={item.image} alt={item.name} className="order-item-img" />
                      <div className="order-item-details">
                        <h4>{item.name}</h4>
                        <p>{item.brand} | {item.volume || "100ml"}</p>
                        <span className="item-qty-price">
                          Qty: {item.quantity} @ ₹{item.price} each
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-shipping-summary">
                  <h4>Delivery Address</h4>
                  <p>{order.shipping?.fullName}</p>
                  <p>{order.shipping?.address}</p>
                  <p>
                    {order.shipping?.city}, {order.shipping?.state} - {order.shipping?.pincode}
                  </p>
                  <p>Phone: {order.shipping?.phone}</p>
                  <p className="payment-method">
                    Payment Method: <strong>{order.paymentMethod || "COD"}</strong>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
