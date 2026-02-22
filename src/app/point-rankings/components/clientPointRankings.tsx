"use client";

import { api } from "~/trpc/react";
import { useState } from "react";
import NavBarLogin  from "~/app/_components/NavBarLogin";
import CustomAreaChart from "~/app/_components/AreaChart";
import MemberTable from "~/app/_components/MemberTable";

export default function ClientPointRankings() {
    return (
        <main className="bg-white py-12 px-4">
            <NavBarLogin />
            <h1 className="text-center text-5xl font-bold m-4 text-[#001F5B]">Point Rankings</h1>
            <div className="grid grid-col-1 md:grid-cols-2 gap-4 h-full w-full bg-[#fafafa] rounded-lg p-4 shadow-md">
                <CustomAreaChart />
                <MemberTable />
            </div>

        </main>
    )
}