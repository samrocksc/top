import { getAuthenticated } from "@/types/sdk.gen";

export const fetchAuthenticatedData = () => {
  return getAuthenticated();
};