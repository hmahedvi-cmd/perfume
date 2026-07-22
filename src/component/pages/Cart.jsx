import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Cart.css";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQty,
    decreaseQty,
    totalPrice,
  } = useCart();

  return (
    <div className="cart-page-wrapper">
      {/* Page Header Banner */}
      <div className="page-header-banner">
        <h1>Your Shopping Bag</h1>
        <p>Review your selection before finalizing checkout.</p>
      </div>

      <div className="cart-container container">
        {/* Left Column: Items */}
        <div className="cart-items-column">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <h3>Your shopping bag is currently empty.</h3>
              <p>Explore our catalog to add your favorite fragrances.</p>
              <Link to="/shop" className="btn btn-primary">
                Explore Fragrances
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <motion.div
                key={item.id}
                className="cart-item-row"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <div className="cart-item-img-wrapper">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="cart-item-info">
                  <span className="cart-item-brand">{item.brand}</span>
                  <h2>{item.name}</h2>
                  <div className="cart-item-price">₹{item.price}</div>

                  <div className="cart-item-actions">
                    <div className="cart-qty-selector">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQty(item.id)}>+</button>
                    </div>

                    <button
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Right Column: Order Summary Card */}
        {cartItems.length > 0 && (
          <div className="cart-summary-column">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>FREE</span>
            </div>

            <div className="summary-row summary-grand-total">
              <span>Grand Total</span>
              <span>₹{totalPrice}</span>
            </div>

            <Link to="/checkout" className="checkout-link-wrapper">
              <button className="cart-checkout-btn primary">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;