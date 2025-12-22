// Custom types index that exports our environment-aware SDK
export { 
  getAuthenticated, 
  getUnauthenticated, 
  getHealth, 
  getUserByAuth0Id 
} from '@/lib/custom-sdk';

// Re-export all types from the generated types file
export type { 
  AuthenticatedResponse, 
  ClientOptions, 
  GetAuthenticatedData, 
  GetAuthenticatedError, 
  GetAuthenticatedErrors, 
  GetAuthenticatedResponse, 
  GetAuthenticatedResponses, 
  GetCheckJwtData, 
  GetCheckJwtError, 
  GetCheckJwtErrors, 
  GetCheckJwtResponse, 
  GetCheckJwtResponses, 
  GetData, 
  GetHealthData, 
  GetHealthError, 
  GetHealthErrors, 
  GetHealthResponse, 
  GetHealthResponses, 
  GetResponse, 
  GetResponses, 
  GetUnauthenticatedData, 
  GetUnauthenticatedResponse, 
  GetUnauthenticatedResponses, 
  GetUserByAuth0IdData, 
  GetUserByAuth0IdError, 
  GetUserByAuth0IdErrors, 
  GetUserByAuth0IdResponse, 
  GetUserByAuth0IdResponses, 
  HealthErrorResponse, 
  HealthResponse, 
  UnauthenticatedResponse, 
  User 
} from '@/types/types.gen';