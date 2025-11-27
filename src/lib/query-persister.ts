import { get, set, del } from "idb-keyval";
import type { PersistedClient, Persister } from "@tanstack/react-query-persist-client";

/**
 * Creates an IndexedDB-based persister for React Query cache.
 * This allows the app to restore cached data when reopened offline.
 */
export function createIDBPersister(idbValidKey: IDBValidKey = "reactQuery"): Persister {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(idbValidKey, client);
    },
    restoreClient: async () => {
      return await get<PersistedClient>(idbValidKey);
    },
    removeClient: async () => {
      await del(idbValidKey);
    },
  };
}
