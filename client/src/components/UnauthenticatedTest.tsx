"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUnauthenticatedData } from "@/api/getUnauthenticated";
import Link from "next/link";

export default function UnauthenticatedTest() {
  // Test the unauthenticated endpoint
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["unauthenticated"],
    queryFn: () => fetchUnauthenticatedData(),
  });

  console.log("data", data);

  return (
    <div className="mt-8 p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Unauthenticated Endpoint Test</h2>
      <Link
        href="#"
        onClick={(e) => {
          e.preventDefault();
          refetch();
        }}
        className="text-blue-500 hover:underline"
      >
        Test Unauthenticated Endpoint
      </Link>

      <div className="mt-4">
        {isLoading && <p>Loading...</p>}
        {isError && (
          <p className="text-red-500">
            Error: {error?.message || "Failed to fetch"}
          </p>
        )}
        {data && (
          <div>
            <p className="text-green-500">Success!</p>
            <p>Message: {data.data?.message}</p>
            <p>Timestamp: {data.data?.timestamp}</p>
          </div>
        )}
      </div>
    </div>
  );
}

