import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB4vbem58bDtwlMi9-eOX9LW3cYTx782N4",
  authDomain: "juris-ai-ad85b.firebaseapp.com",
  projectId: "juris-ai-ad85b",
  storageBucket: "juris-ai-ad85b.firebasestorage.app",
  messagingSenderId: "1051099535340",
  appId: "1:1051099535340:web:24e8c930c43224f93ed2c9",
  measurementId: "G-097ZF79MVZ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
