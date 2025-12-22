import { getAuthenticated } from "@/types/custom-index";
import { getStoredToken } from "@/lib/auth";

// Wrapper function that adds authentication headers
export const fetchAuthenticatedData = async () => {
  // Get the stored token (in a real implementation, this would come from Auth0 SDK)
  const token = getStoredToken();
  
  console.log('Retrieved token:', token ? 'Token found' : 'No token found');
  if (token) {
    console.log('Token length:', token.length);
  }
  
  // If we have a token, use it for authentication
  if (token) {
    return getAuthenticated({ 
      auth: token 
    });
  }
  
  // If no token, still call the API (it will fail as expected)
  // This maintains the same interface whether authenticated or not
  console.log('Calling API without authentication');
  return getAuthenticated();
};