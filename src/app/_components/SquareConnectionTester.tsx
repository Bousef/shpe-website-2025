/* Testing Purposes Only! Delete Later :P */

"use client";

import { api } from "~/trpc/react";

const SquareConnectionTest = () => {
  const { data, isLoading, error } = api.squareTest.test.useQuery();

  if (isLoading) return <p> Checking Square connection...</p>;

  if (error || !data?.success) {
    return (
      <p className="text-red-600">
        Square error: {data?.error || error?.message || "Unknown error"}
      </p>
    );
  }

  return (
    <div className="bg-green-100 p-4 rounded-md shadow space-y-4">
      <p> Connected to Square! Found {data?.categories?.length ?? 0} categories.</p>
      <div className="space-y-2">
          {data?.categories?.map((cat) => (
            <div key={cat.id} className="bg-white p-3 rounded border shadow-sm">
              <p><strong>Name:</strong> {cat.categoryData?.name || "Unnamed"}</p>
              <p><strong>ID:</strong> {cat.id}</p>
            </div>
          ))}
      </div>
    </div>
  );
};


export default SquareConnectionTest;