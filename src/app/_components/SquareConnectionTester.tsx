"use client";

import { api } from "~/trpc/react"; // if you use 'api', make sure it's from src/utils/api.ts

const SquareConnectionTest = () => {
  const { data, isLoading, error } = api.squareTest.test.useQuery();

  if (isLoading) return <p>🔄 Checking Square connection...</p>;

  if (error || !data?.success) {
    return (
      <p className="text-red-600">
        Square error: {data?.error || error?.message || "Unknown error"}
      </p>
    );
  }

  return (
    <div className="bg-green-100 p-4 rounded-md shadow">
    Connected to Square!<br />
      Found {data.categories.length} categories.
    </div>
  );
};

export default SquareConnectionTest;