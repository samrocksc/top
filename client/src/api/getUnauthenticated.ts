import { getUnauthenticated } from "@/types/sdk.gen";

export const fetchUnauthenticatedData = () => {
  return getUnauthenticated();
};