"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isUnlocked: boolean;
  mounted: boolean;
  unlock: (pin: string) => Promise<boolean>;
  lock: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check localStorage on mount for existing session
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("brazil-trip-unlocked");
    if (stored === "true") {
      setIsUnlocked(true);
    }
  }, []);

  const unlock = async (pin: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();

      if (data.valid) {
        localStorage.setItem("brazil-trip-unlocked", "true");
        setIsUnlocked(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error unlocking:", error);
      return false;
    }
  };

  const lock = async (): Promise<void> => {
    try {
      await fetch("/api/auth/verify", { method: "DELETE" });
    } catch (error) {
      console.error("Error locking:", error);
    }
    localStorage.removeItem("brazil-trip-unlocked");
    setIsUnlocked(false);
  };

  return (
    <AuthContext.Provider value={{ isUnlocked, mounted, unlock, lock }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
