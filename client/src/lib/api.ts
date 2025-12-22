// client/src/lib/api.ts
// API client configuration with authentication support

import { createClient, createConfig } from "@/types/client";
import type { ClientOptions } from "@/types/client";
import { getStoredToken } from "./auth";

// Create an authenticated client instance
export const createAuthenticatedClient = () => {
  return createClient(
    createConfig<ClientOptions>({
      baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
      throwOnError: true,
      // This would be where we add auth logic
      // For now, we'll show how it would work:
      /*
      async beforeSend(request) {
        const token = await getStoredToken();
        if (token) {
          request.headers.Authorization = `Bearer ${token}`;
        }
        return request;
      }
      */
    })
  );
};

// For now, we'll export a placeholder function showing how auth would work
export const getAuthenticatedClient = () => {
  // TODO: Implement proper authenticated client
  return null;
};