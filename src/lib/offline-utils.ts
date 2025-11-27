/**
 * Checks if the browser is currently offline.
 * Throws an error if offline to prevent mutations.
 */
export function checkOnlineStatus(): void {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    throw new Error("Cannot perform this action while offline. Please reconnect to the internet.");
  }
}

/**
 * Returns true if the browser is online.
 */
export function isOnline(): boolean {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine;
}
