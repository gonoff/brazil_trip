"use client";

import { useAuth } from "@/contexts/auth-context";
import { LockScreen } from "@/components/lock-screen";

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { isUnlocked, mounted } = useAuth();

  // Show lock screen if not unlocked (LockScreen handles the loading state)
  if (!mounted || !isUnlocked) {
    return <LockScreen />;
  }

  return <>{children}</>;
}
