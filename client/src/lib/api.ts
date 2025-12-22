import { createClient, createConfig } from '@/types/client';
import type { ClientOptions } from '@/types/client/types.gen';

// Create a custom client that uses the environment variable for the base URL
export const customClient = createClient(
  createConfig<ClientOptions>({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    throwOnError: true,
  })
);