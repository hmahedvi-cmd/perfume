import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { toast } from "react-toastify";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  // Load wishlist from Firestore when user changes
  useEffect(() => {
    if (!user) {
      setWishlist([]);
      setIsLoaded(false);
      return;
    }

    const loadWishlist = async () => {
      try {
        const docRef = doc(db, "wishlists", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setWishlist(docSnap.data().items || []);
        } else {
          setWishlist([]);
        }
      } catch (err) {
        console.error("Error loading wishlist:", err);
      } finally {
        setIsLoaded(true);
      }
    };
    loadWishlist();
  }, [user]);

  // Save wishlist to Firestore when wishlist changes
  useEffect(() => {
    if (!user || !isLoaded) return;

    const saveWishlist = async () => {
      try {
        const docRef = doc(db, "wishlists", user.uid);
        await setDoc(docRef, { items: wishlist });
      } catch (err) {
        console.error("Error saving wishlist:", err);
      }
    };
    const timer = setTimeout(saveWishlist, 500); // Debounce saves
    return () => clearTimeout(timer);
  }, [wishlist, user, isLoaded]);

  const toggleWishlist = (product) => {
    if (!user) {
      toast.warning("Please login to manage your wishlist.");
      return;
    }

    const exists = wishlist.find((item) => item.id === product.id);

    if (exists) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
      toast.info(`Removed "${product.name}" from Wishlist`);
    } else {
      setWishlist([...wishlist, product]);
      toast.success(`Added "${product.name}" to Wishlist!`);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);