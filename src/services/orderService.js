import { db } from "../firebase/firebase";

import {
  addDoc,
  collection,
} from "firebase/firestore";

export async function saveOrder(order) {
  return await addDoc(
    collection(db, "orders"),
    order
  );
}