import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

const PRODUCTS_COLLECTION = "products";

// Initial seed products
const initialProducts = [
  {
    name: "Dior Sauvage",
    brand: "Dior",
    category: "Men",
    price: 12600,
    rating: 4.8,
    image: "/images/dior.jpg",
    description: "A bold and fresh fragrance with notes of bergamot, pepper, and amberwood.",
    notes: ["Bergamot", "Pepper", "Amberwood"],
    volume: "100ml",
    stock: 12,
    isNew: true
  },
  {
    name: "Chanel No.5",
    brand: "Chanel",
    category: "Women",
    price: 10500,
    rating: 4.9,
    image: "/images/chanel.jpg",
    description: "A timeless classic with notes of jasmine, rose, and sandalwood.",
    notes: ["Jasmine", "Rose", "Sandalwood"],
    volume: "100ml",
    stock: 15,
    isNew: false
  },
  {
    name: "Versace Eros",
    brand: "Versace",
    category: "Men",
    price: 11000,
    rating: 4.7,
    image: "/images/versace.jpg",
    description: "Versace Eros is a bold and seductive fragrance with fresh mint, green apple, and lemon, balanced by warm vanilla, tonka bean, and cedarwood. It's a long-lasting scent, perfect for evenings and special occasions.",
    notes: ["vanilla", "tonka bean", "cedarwood"],
    volume: "100ml",
    stock: 18,
    isNew: true
  },
  {
    name: "Gucci Bloom",
    brand: "Gucci",
    category: "Women",
    price: 13000,
    rating: 4.6,
    image: "/images/gucci.jpg",
    description: "A modern and elegant fragrance with notes of peony, jasmine, and sandalwood.",
    notes: ["Peony", "Jasmine", "Sandalwood"],
    volume: "100ml",
    stock: 24,
    isNew: false
  },
  {
    name: "YSL Black Opium",
    brand: "YSL",
    category: "Women",
    price: 13500,
    rating: 4.8,
    image: "/images/ysl.jpg",
    description: "An addictive gourmand floral fragrance with rich black coffee, white flowers, and sweet vanilla.",
    notes: ["Coffee", "Jasmine", "Vanilla"],
    volume: "90ml",
    stock: 14,
    isNew: false
  },
  {
    name: "Tom Ford Oud Wood",
    brand: "Tom Ford",
    category: "Unisex",
    price: 25000,
    rating: 4.7,
    image: "/images/tomford.jpg",
    description: "One of the most rare, precious, and expensive ingredients in a perfumer's arsenal, oud wood is often burned in incense-filled temples.",
    notes: ["Oud Wood", "Sandalwood", "Chinese Pepper"],
    volume: "100ml",
    stock: 11,
    isNew: true
  }
];

// Seed products to Firestore if collection is empty, or contains obsolete images
export async function seedProducts() {
  try {
    const collectionRef = collection(db, PRODUCTS_COLLECTION);
    const querySnapshot = await getDocs(collectionRef);
    
    let needsReset = false;
    
    if (querySnapshot.empty) {
      needsReset = true;
    } else {
      // Check for obsolete paths or image filename changes in the seeded initial products
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const localMatch = initialProducts.find((p) => p.name === data.name);
        if (localMatch) {
          if (
            !data.image ||
            data.image.includes("src") ||
            data.image.includes("assets") ||
            !data.image.startsWith("/") ||
            localMatch.image !== data.image
          ) {
            needsReset = true;
          }
        }
      });
    }

    if (needsReset) {
      console.log("Resetting Firestore products collection...");
      for (const docSnap of querySnapshot.docs) {
        await deleteDoc(doc(db, PRODUCTS_COLLECTION, docSnap.id));
      }
      for (let i = 0; i < initialProducts.length; i++) {
        const prodId = `product${i + 1}`;
        await setDoc(doc(db, PRODUCTS_COLLECTION, prodId), initialProducts[i]);
      }
      console.log("Firestore products re-seeded successfully!");
    }
  } catch (error) {
    console.warn("Could not seed products to Firestore, using local fallbacks:", error);
  }
}

// Fetch all products from Firestore (falls back to local static array on failure)
export async function fetchProducts() {
  let products = [];
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    querySnapshot.forEach((docSnap) => {
      products.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });
    if (products.length === 0) {
      products = initialProducts.map((p, i) => ({ id: `product${i + 1}`, ...p }));
    }
  } catch (error) {
    console.warn("Error fetching products from Firestore, loading local dataset:", error);
    products = initialProducts.map((p, i) => ({ id: `product${i + 1}`, ...p }));
  }

  // Apply local edits and additions
  const localProducts = JSON.parse(localStorage.getItem("luxe_local_products") || "[]");
  const deletedIds = JSON.parse(localStorage.getItem("luxe_deleted_products") || "[]");

  // 1. Filter out deleted products
  products = products.filter(p => !deletedIds.includes(p.id));

  // 2. Apply local overrides for existing products, and append new local-only products
  localProducts.forEach((localProd) => {
    const index = products.findIndex(p => p.id === localProd.id);
    if (index !== -1) {
      products[index] = localProd;
    } else {
      if (!deletedIds.includes(localProd.id)) {
        products.push(localProd);
      }
    }
  });

  return products;
}

// Fetch single product by ID (falls back to local static item search on failure)
export async function getProductById(id) {
  // Check if deleted locally
  const deletedIds = JSON.parse(localStorage.getItem("luxe_deleted_products") || "[]");
  if (deletedIds.includes(id)) {
    return null;
  }

  // Check if edited/added locally
  const localProducts = JSON.parse(localStorage.getItem("luxe_local_products") || "[]");
  const foundLocal = localProducts.find(p => p.id === id);
  if (foundLocal) {
    return foundLocal;
  }

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
  } catch (error) {
    console.warn(`Error fetching product ${id} from Firestore, searching local fallback:`, error);
  }
  
  // Search locally
  const idx = parseInt(id.replace("product", "")) - 1;
  if (!isNaN(idx) && initialProducts[idx]) {
    return { id, ...initialProducts[idx] };
  }
  const found = initialProducts.find((p) => p.name.toLowerCase().replace(/\s+/g, "-") === id);
  if (found) {
    return { id, ...found };
  }
  return null;
}

// Add a new product (Admin)
export async function addProduct(product) {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), product);
    return { id: docRef.id, ...product };
  } catch (error) {
    console.error("Error adding product to Firestore, saving locally:", error);
    const newProduct = { id: `mock_${Date.now()}`, ...product };
    const localProducts = JSON.parse(localStorage.getItem("luxe_local_products") || "[]");
    localProducts.push(newProduct);
    localStorage.setItem("luxe_local_products", JSON.stringify(localProducts));
    return newProduct;
  }
}

// Update a product (Admin)
export async function updateProduct(id, product) {
  const updatedProduct = { id, ...product };
  
  // Always update local storage first so we have the override
  const localProducts = JSON.parse(localStorage.getItem("luxe_local_products") || "[]");
  const index = localProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    localProducts[index] = updatedProduct;
  } else {
    localProducts.push(updatedProduct);
  }
  localStorage.setItem("luxe_local_products", JSON.stringify(localProducts));

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, product);
    return updatedProduct;
  } catch (error) {
    console.error(`Error updating product ${id} in Firestore, saved locally:`, error);
    return updatedProduct;
  }
}

// Delete a product (Admin)
export async function deleteProduct(id) {
  // Remove from local products if present
  const localProducts = JSON.parse(localStorage.getItem("luxe_local_products") || "[]");
  const updatedLocal = localProducts.filter(p => p.id !== id);
  localStorage.setItem("luxe_local_products", JSON.stringify(updatedLocal));

  // Add to deleted products list to ensure it is filtered out of fetch results
  const deletedIds = JSON.parse(localStorage.getItem("luxe_deleted_products") || "[]");
  if (!deletedIds.includes(id)) {
    deletedIds.push(id);
    localStorage.setItem("luxe_deleted_products", JSON.stringify(deletedIds));
  }

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error(`Error deleting product ${id} in Firestore:`, error);
    return id;
  }
}
