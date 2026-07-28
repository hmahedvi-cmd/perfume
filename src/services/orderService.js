import { db } from "../firebase/firebase";
import {
  addDoc,
  collection,
} from "firebase/firestore";

export async function saveOrder(order) {
  try {
    const docRef = await addDoc(
      collection(db, "orders"),
      order
    );
    return { id: docRef.id };
  } catch (error) {
    console.error("Failed to save order to Firestore, saving locally:", error);
    const mockId = `order_mock_${Date.now()}`;
    const localOrders = JSON.parse(localStorage.getItem("luxe_local_orders") || "[]");
    
    // Format createdAt structure for date sorting compatibility
    const localOrder = {
      id: mockId,
      ...order,
      createdAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: 0
      }
    };
    
    localOrders.push(localOrder);
    localStorage.setItem("luxe_local_orders", JSON.stringify(localOrders));
    return { id: mockId };
  }
}