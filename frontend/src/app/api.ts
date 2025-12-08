// Frontend API service to connect to the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
  // Health check
  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },
  
  // User related APIs
  getUser: async (auth0Id: string) => {
    const response = await fetch(`${API_BASE_URL}/user/${auth0Id}`);
    return response.json();
  },
};
