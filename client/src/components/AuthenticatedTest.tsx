"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAuthenticatedData } from "@/api/getAuthenticated";
import Link from "next/link";

export default function AuthenticatedTest() {
  // Test the authenticated endpoint (will fail without token)
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["authenticated"],
    queryFn: () => fetchAuthenticatedData(),
    enabled: false, // Don't fetch automatically since it will fail without auth
  });

  console.log("authenticated data", data);

  return (
    <div className="mt-8 p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Authenticated Endpoint Test</h2>
      <p className="text-sm text-gray-600 mb-2">
        Note: This endpoint requires authentication. Try this after logging in.
      </p>
      <Link
        href="#"
        onClick={(e) => {
          e.preventDefault();
          refetch();
        }}
        className="text-blue-500 hover:underline"
      >
        Test Authenticated Endpoint
      </Link>

      <div className="mt-4">
        {isLoading && <p>Loading...</p>}
        {isError && (
          <div className="text-red-500">
            <p>Error: {error?.message || "Failed to fetch"}</p>
            <p className="text-sm mt-2">
              This is expected without a valid authentication token.
            </p>
            <p className="text-sm mt-1">
              Status code: {error?.status || "Unknown"}. Try logging in first to
              test this endpoint with proper authentication.
            </p>
          </div>
        )}
        {data && !isError && (
          <div>
            <p className="text-green-500">Success!</p>
            <p>Message: {data.data?.message}</p>
            <p>User ID: {data.data?.userId}</p>
            <p>Timestamp: {data.data?.timestamp}</p>
          </div>
        )}
      </div>
    </div>
  );
}

