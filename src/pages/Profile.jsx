import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { db } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { FaUserCircle, FaMapMarkerAlt, FaHeart, FaShoppingBag, FaSignOutAlt } from "react-icons/fa";
import "./Profile.css";

function Profile() {
  const { user, userData, logout, updateAddress } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Saved Address Form State
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [savingAddress, setSavingAddress] = useState(false);

  // Sync address form when userData loads
  useEffect(() => {
    if (userData?.savedAddress) {
      setAddressForm(userData.savedAddress);
    }
  }, [userData]);

  // Fetch recent orders
  useEffect(() => {
    if (!user) return;
    const fetchRecentOrders = async () => {
      setLoadingOrders(true);
      try {
        const q = query(collection(db, "orders"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetched = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() });
        });

        // Sort by date and slice top 3
        fetched.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setOrders(fetched.slice(0, 3));
      } catch (err) {
        console.error("Error fetching user dashboard orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchRecentOrders();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleAddressChange = (e) => {
    setAddressForm({
      ...addressForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      await updateAddress(addressForm);
      alert("Address saved successfully!");
    } catch (err) {
      console.error("Failed to save address:", err);
      alert("Failed to save address. Please try again.");
    } finally {
      setSavingAddress(false);
    }
  };

  return (
    <div className="profile-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="user-welcome">
          <FaUserCircle className="user-avatar" />
          <div>
            <h1>Welcome, {userData?.fullName || user?.email?.split("@")[0]}</h1>
            <p className="user-email">{user?.email}</p>
            {userData?.role === "admin" && <span className="admin-tag">Administrator</span>}
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Recent Orders Section */}
        <section className="dashboard-card orders-card">
          <div className="card-header-row">
            <h2>
              <FaShoppingBag /> Recent Orders
            </h2>
            <Link to="/order-history" className="view-all-link">
              View All
            </Link>
          </div>
          {loadingOrders ? (
            <p className="loading-subtext">Loading recent orders...</p>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <p>No orders placed yet.</p>
              <Link to="/shop" className="dashboard-action-btn">
                Browse Shop
              </Link>
            </div>
          ) : (
            <div className="recent-orders-list">
              {orders.map((order) => (
                <div key={order.id} className="recent-order-item">
                  <div className="recent-order-meta">
                    <span className="recent-order-id">{order.id.slice(0, 8)}...</span>
                    <span className="recent-order-date">
                      {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <div className="recent-order-info">
                    <span className="recent-order-items">
                      {order.items?.map((item) => `${item.name} (x${item.quantity})`).join(", ")}
                    </span>
                    <span className="recent-order-total">₹{order.total}</span>
                  </div>
                  <span className={`status-badge status-${order.status?.toLowerCase() || "pending"}`}>
                    {order.status || "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Saved Address Section */}
        <section className="dashboard-card address-card">
          <h2>
            <FaMapMarkerAlt /> Saved Delivery Address
          </h2>
          <form onSubmit={handleAddressSubmit} className="dashboard-address-form">
            <div className="form-row-2">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={addressForm.fullName}
                onChange={handleAddressChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={addressForm.phone}
                onChange={handleAddressChange}
                required
              />
            </div>
            <input
              type="text"
              name="address"
              placeholder="Street Address"
              value={addressForm.address}
              onChange={handleAddressChange}
              required
            />
            <div className="form-row-3">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={addressForm.city}
                onChange={handleAddressChange}
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={addressForm.state}
                onChange={handleAddressChange}
                required
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={addressForm.pincode}
                onChange={handleAddressChange}
                required
              />
            </div>
            <button type="submit" className="save-address-btn" disabled={savingAddress}>
              {savingAddress ? "Saving..." : "Save Address"}
            </button>
          </form>
        </section>

        {/* Wishlist Section */}
        <section className="dashboard-card wishlist-card full-width-card">
          <h2>
            <FaHeart /> Your Wishlist
          </h2>
          {wishlist.length === 0 ? (
            <div className="empty-state">
              <p>Your wishlist is currently empty.</p>
              <Link to="/shop" className="dashboard-action-btn">
                Add Fragrances
              </Link>
            </div>
          ) : (
            <div className="profile-wishlist-grid">
              {wishlist.map((item) => (
                <div key={item.id} className="wishlist-item-card">
                  <img src={item.image} alt={item.name} />
                  <div className="wishlist-item-meta">
                    <h4>{item.name}</h4>
                    <p>{item.brand}</p>
                    <div className="wishlist-item-footer">
                      <span className="wishlist-item-price">₹{item.price}</span>
                      <Link to={`/product/${item.id}`} className="view-product-btn">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Profile;
