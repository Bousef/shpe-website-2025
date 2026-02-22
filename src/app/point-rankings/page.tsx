"use server";

import ClientPointRankings from "./components/clientPointRankings";

export default async function PointRankingsPage() {
    return (
        <div>
            <ClientPointRankings />
        </div>
    );
}