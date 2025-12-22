import { createClient, createConfig } from '@/types/client';
import type {
  GetAuthenticatedData,
  GetAuthenticatedResponses,
  GetAuthenticatedErrors,
  GetUnauthenticatedData,
  GetUnauthenticatedResponses,
  GetHealthData,
  GetHealthErrors,
  GetHealthResponses,
  GetUserByAuth0IdData,
  GetUserByAuth0IdErrors,
  GetUserByAuth0IdResponses,
  ClientOptions,
} from '@/types/types.gen';

// Get base URL from environment variable, with fallback to localhost
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: Check if we have a global variable or use a default
    return (window as any).ENV?.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  } else {
    // Server-side: Use environment variable
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }
};

// Create a custom client that uses the environment-based base URL
const envAwareClient = createClient(
  createConfig<ClientOptions>({
    baseUrl: getBaseUrl(),
    throwOnError: true,
  })
);

// Wrapper functions that use our custom client with environment-based base URL
export const getAuthenticated = <ThrowOnError extends boolean = false>(
  options?: {
    auth?: string;
    client?: typeof envAwareClient;
    throwOnError?: ThrowOnError;
  }
) => {
  const authHeader = options?.auth
    ? { Authorization: `Bearer ${options.auth}` }
    : {};

  return envAwareClient.get<GetAuthenticatedResponses, GetAuthenticatedErrors, ThrowOnError>({
    url: '/authenticated',
    headers: authHeader,
    ...options,
  });
};

export const getUnauthenticated = <ThrowOnError extends boolean = false>(
  options?: {
    client?: typeof envAwareClient;
    throwOnError?: ThrowOnError;
  }
) => {
  return envAwareClient.get<GetUnauthenticatedResponses, unknown, ThrowOnError>({
    url: '/unauthenticated',
    ...options,
  });
};

export const getHealth = <ThrowOnError extends boolean = false>(
  options?: {
    auth?: string;
    client?: typeof envAwareClient;
    throwOnError?: ThrowOnError;
  }
) => {
  const authHeader = options?.auth
    ? { Authorization: `Bearer ${options.auth}` }
    : {};

  return envAwareClient.get<GetHealthResponses, GetHealthErrors, ThrowOnError>({
    url: '/health',
    headers: authHeader,
    ...options,
  });
};

export const getUserByAuth0Id = <ThrowOnError extends boolean = false>(
  options: {
    auth: string;
    params: GetUserByAuth0IdData['path'];
    client?: typeof envAwareClient;
    throwOnError?: ThrowOnError;
  }
) => {
  const authHeader = options?.auth
    ? { Authorization: `Bearer ${options.auth}` }
    : {};

  return envAwareClient.get<GetUserByAuth0IdResponses, GetUserByAuth0IdErrors, ThrowOnError>({
    url: `/user/${options.params.auth0Id}`,
    headers: authHeader,
    ...options,
  });
};