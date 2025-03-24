import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { User, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { auth } from "../utils/FirebaseConfig";
import { useRouter } from "expo-router"; 

// 🔹 Define TypeScript Interface for Auth Context
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: () => boolean;
}

// 🔹 Default values (for initial context state)
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isLoggedIn: () => false,
});

// 🔹 AuthProvider Component (Wraps App)
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); 

  useEffect(() => {
    // 🔹 Listen for Auth State Changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);

      // 🔹 Redirect to /index if not logged in
      if (!currentUser) {
        router.replace("/");  // Redirect to login
      }
    });

    return () => unsubscribe();
  }, []);

  const isLoggedIn = () => {
    return user !== null;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isLoggedIn}}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔹 Custom Hook for Using Auth
export const useAuth = () => useContext(AuthContext);
