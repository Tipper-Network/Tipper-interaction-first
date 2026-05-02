import {
  QueryClient,
  Query,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query";

/**
 * Creates a new React Query `QueryClient` with app-tuned defaults.
 *
 * Intended usage:
 * - Server: create a fresh client per request
 * - Browser: create once and reuse to avoid re-instantiation across renders
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Increase stale time to reduce refetches
        staleTime: 10 * 60 * 1000, // 10 minutes (was 1 minute)
        gcTime: 30 * 60 * 1000, // 30 minutes (was 5 minutes)
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Disable aggressive refetching to reduce API calls
        refetchOnWindowFocus: false, // Was true - major cost saver
        refetchOnReconnect: true,
        refetchOnMount: false, // Was true - prevents unnecessary refetches

        networkMode: "online",
        throwOnError: true,

        // Add refetch interval for critical data only
        refetchInterval: false, // Disable automatic refetching
      },
      mutations: {
        retry: 1,
        retryDelay: 1000,
        networkMode: "online",
        throwOnError: true,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Returns a React Query client instance appropriate for the current runtime.
 *
 * - Server: always returns a new client (per-request isolation)
 * - Browser: returns a singleton client (prevents re-creation during suspense)
 */
export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

/**
 * Exported for cases where you explicitly need a fresh QueryClient instance.
 */
export { makeQueryClient };
