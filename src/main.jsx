import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Global error catcher to debug blank page issues
window.addEventListener("error", (event) => {
  const rootEl = document.getElementById("root");
  if (rootEl) {
    rootEl.innerHTML = `
      <div style="padding: 20px; color: red; background: #fee; border: 1px solid red; border-radius: 8px; margin: 20px; text-align: left; font-family: monospace;">
        <h3>Runtime Error detected:</h3>
        <p>${event.message}</p>
        <p>in ${event.filename}:${event.lineno}:${event.colno}</p>
        <pre>${event.error ? event.error.stack : ""}</pre>
      </div>
    `;
  }
});

window.addEventListener("unhandledrejection", (event) => {
  const rootEl = document.getElementById("root");
  if (rootEl) {
    rootEl.innerHTML = `
      <div style="padding: 20px; color: red; background: #fee; border: 1px solid red; border-radius: 8px; margin: 20px; text-align: left; font-family: monospace;">
        <h3>Unhandled Promise Rejection:</h3>
        <p>${event.reason}</p>
      </div>
    `;
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);