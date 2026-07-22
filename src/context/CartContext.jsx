import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  // Load cart from Firestore when user changes
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setIsLoaded(false);
      return;
    }

    const loadCart = async () => {
      try {
        const docRef = doc(db, "carts", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCartItems(docSnap.data().items || []);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error("Error loading cart:", err);
      } finally {
        setIsLoaded(true);
      }
    };
    loadCart();
  }, [user]);

  // Save cart to Firestore when cartItems changes
  useEffect(() => {
    if (!user || !isLoaded) return;

    const saveCart = async () => {
      try {
        const docRef = doc(db, "carts", user.uid);
        await setDoc(docRef, { items: cartItems });
      } catch (err) {
        console.error("Error saving cart:", err);
      }
    };
    const timer = setTimeout(saveCart, 500); // Debounce saves to avoid multiple rapid writes
    return () => clearTimeout(timer);
  }, [cartItems, user, isLoaded]);

  const addToCart = (product) => {
    const existing = cartItems.find((item) => item.id === product.id);

    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const increaseQty = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(item.quantity - 1, 1),
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);