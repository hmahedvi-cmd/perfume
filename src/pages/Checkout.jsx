import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { saveOrder } from "../services/orderService";
import "./Checkout.css";

function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    payment: "COD",
  });
  const [loading, setLoading] = useState(false);

  // Pre-fill address fields if user has a saved address
  useEffect(() => {
    if (userData?.savedAddress) {
      setForm({
        ...userData.savedAddress,
        payment: "COD", // Keep COD as default payment choice
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = async () => {
    // Form Validation
    if (
      !form.fullName ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      alert("Please fill in all shipping details.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      if (form.payment === "Card") {
        // Simulate contact with secure Stripe payment gateway
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      const order = {
        userId: user.uid,
        email: user.email,
        items: cartItems,
        shipping: {
          fullName: form.fullName,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        total: totalPrice,
        paymentMethod: form.payment === "Card" ? "Stripe (Simulation)" : form.payment,
        status: "Pending", // Set directly to Pending (paid/COD placed and ready for shipment)
        paid: form.payment === "Card", // Mark paid if Card is used
        createdAt: new Date(),
      };

      const savedDoc = await saveOrder(order);
      clearCart();
      navigate(`/success?order_id=${savedDoc.id}&mock_checkout=true`);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Order placement failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-layout">
        {/* Shipping Form */}
        <div className="checkout-form-container">
          <h1>Delivery Details</h1>
          <form onSubmit={(e) => e.preventDefault()} className="checkout-form">
            <div className="input-group">
              <label>Full Name</label>
              <input
                name="fullName"
                placeholder="John Doe"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input
                name="phone"
                placeholder="+1 234 567 890"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Address</label>
              <input
                name="address"
                placeholder="123 Luxury Lane"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row-3">
              <div className="input-group">
                <label>City</label>
                <input
                  name="city"
                  placeholder="Paris"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>State</label>
                <input
                  name="state"
                  placeholder="Ile-de-France"
                  value={form.state}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Pincode</label>
                <input
                  name="pincode"
                  placeholder="75001"
                  value={form.pincode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Payment Method</label>
              <select name="payment" value={form.payment} onChange={handleChange}>
                <option value="COD">Cash on Delivery (COD)</option>
                <option value="Card">Stripe Secure Card Payment</option>
              </select>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="checkout-summary-container">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item.id} className="summary-item-row">
                <img src={item.image} alt={item.name} />
                <div className="summary-item-details">
                  <h4>{item.name}</h4>
                  <p>{item.brand} | {item.volume || "100ml"}</p>
                  <span>Qty: {item.quantity}</span>
                </div>
                <span className="summary-item-price">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="totals-row">
              <span>Shipping</span>
              <span className="free-text">FREE</span>
            </div>
            <div className="totals-row grand-total">
              <span>Grand Total</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>

          <button onClick={placeOrder} className="checkout-pay-btn" disabled={loading}>
            {loading ? "Processing..." : form.payment === "Card" ? "Pay Now with Stripe" : "Place COD Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;