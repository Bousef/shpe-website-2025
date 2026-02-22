"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import { api } from "~/trpc/react";
import { useState } from "react";

export default function CustomBarChart() {
    
    const { data: member, isLoading } = api.user.getAllMembers.useQuery();

    return (
        <ResponsiveContainer width="100%" height={300}>
                {isLoading ? (
                    <div className="flex items-center justify-items-center h-full">
                        <p>Loading...</p>
                    </div>
                ) : (
                    <BarChart data={member ? member.map(m => ({ name: m.name, points: m.point })) : []} layout="vertical" margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <Bar dataKey="points" fill="#001F5B" />
                        <XAxis type="number" domain={[0, 1000]}  />
                        <YAxis type="category" dataKey="name" width={80}/>
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <Tooltip />
                    </BarChart>
                )}
        </ResponsiveContainer>
    )
}