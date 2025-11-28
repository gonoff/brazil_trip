"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Loader2 } from "lucide-react";

export function LockScreen() {
  const { unlock, mounted } = useAuth();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mounted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim() || isLoading) return;

    setIsLoading(true);
    setError(false);

    const success = await unlock(pin);

    if (!success) {
      setError(true);
      setPin("");
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPin(value);
    setError(false);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 dark:from-zinc-900 dark:to-zinc-800">
      <div className="w-full max-w-sm mx-4">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 border border-zinc-200 dark:border-zinc-700">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
              <Lock className="h-8 w-8 text-amber-600 dark:text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-unbounded)]">
              Brazil Trip
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Enter PIN to continue
            </p>
          </div>

          {/* PIN Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                ref={inputRef}
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter PIN"
                value={pin}
                onChange={handlePinChange}
                className={`text-center text-2xl tracking-[0.5em] h-14 ${
                  error
                    ? "border-red-500 focus-visible:ring-red-500 animate-shake"
                    : ""
                }`}
                disabled={isLoading}
                autoComplete="off"
              />
              {error && (
                <p className="text-sm text-red-500 text-center mt-2">
                  Incorrect PIN
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={!pin.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Unlock"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
