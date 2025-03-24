// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbRkvd96DreJ7elsOWVle5ydXOOiqZgdI",
  authDomain: "chatgpt3000-a276b.firebaseapp.com",
  projectId: "chatgpt3000-a276b",
  storageBucket: "chatgpt3000-a276b.appspot.com", // Fixed storage bucket
  messagingSenderId: "317942295830",
  appId: "1:317942295830:web:cce1260528d14af8d23437",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication first
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore after Auth
export const db = getFirestore(app);

export default app;