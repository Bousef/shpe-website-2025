/* Testing Purposes Only! Delete Later :P */

"use client";

import { api } from "~/trpc/react";

export default function SquareConnectionTester() {

    const { data, isLoading, error } = api.jotform.getSubmissions.useQuery({
        formId: "70387424224151",
    });

    


    if (isLoading) return <p>Loading submissions...</p>;
    if (error) return <p>Error: {error.message}</p>;
    
    return (
        <div>
        <h1 className="text-2xl font-bold mb-4">📨 Membership Submissions</h1>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            {JSON.stringify(data, null, 2)}
        </pre>
        </div>
    );
}