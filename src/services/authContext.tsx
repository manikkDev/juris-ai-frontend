import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth } from "@/firebase/config";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

interface AuthUser {
  uid: string;
  email: string | null;
  name: string;
  role: "judge" | "clerk" | "admin";
  court: string;
}

interface AuthContextType {
  user: AuthUser | null;
  firebaseUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: string, court: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Store profile locally for demo (Firestore may have permission issues without setup)
function getProfile(uid: string): AuthUser | null {
  const raw = localStorage.getItem(`juris_profile_${uid}`);
  return raw ? JSON.parse(raw) : null;
}
function setProfile(user: AuthUser) {
  localStorage.setItem(`juris_profile_${user.uid}`, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const profile = getProfile(fbUser.uid);
        if (profile) {
          setUser(profile);
        } else {
          // Default profile for existing users
          const defaultProfile: AuthUser = {
            uid: fbUser.uid,
            email: fbUser.email,
            name: fbUser.email?.split("@")[0] || "User",
            role: "judge",
            court: "High Court Delhi",
          };
          setProfile(defaultProfile);
          setUser(defaultProfile);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, name: string, role: string, court: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const profile: AuthUser = {
      uid: cred.user.uid,
      email: cred.user.email,
      name,
      role: role as AuthUser["role"],
      court,
    };
    setProfile(profile);
    setUser(profile);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
