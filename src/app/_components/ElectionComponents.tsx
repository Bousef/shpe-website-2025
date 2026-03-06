"use client";

import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { api } from "~/trpc/react";
import { useState } from "react";

export default function ElectionChart() {
{/*
    // const {data: CandidateData, isError} = api.candidate.candidateGetAll.useQuery();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    if (isError || !Array.isArray(CandidateData)) return <div className="text-center text-sm text-red-500">Unable to load data</div>;
    const curatedData = (CandidateData).map(c => ({
        name: `${c.name}\n\n${c.r_position}`,
        votes: Number(c.votes ?? 0),
    }));

    // custom tick renderer: split on "\n" and render multiple lines
    const renderCustomizedAxisTick = (props: any) => {
        const { x, y, payload } = props;
        const lines = String(payload.value).split("\n");
        return (
            <g transform={`translate(${x},${y + 8})`}>
                {lines.map((line: string, idx: number) => (
                    <text
                        key={idx}
                        x={0}
                        y={idx * 7}
                        textAnchor="middle"
                        fill="#666"
                        fontSize={12}
                        className="whitespace-pre-line"
                    >
                        {line}
                    </text>
                ))}
            </g>
        );
    };


    return (
        <main className="flex flex-col justify-items-center items-center">
            <h1 className="font-bold text-center text-6xl text-[#001F5B] m-4">ELECTIONS</h1>
            <p className="mt-8 text-base sm:text-lg lg:text-xl text-[#001f5b]/70 mx-auto font-helvetica">
                We bring professionalism, culture, and a Hispanic touch! Learn more about SHPE UCF's core values and what drives our mission.
            </p>
            <BarChart 
                data={curatedData} title="Elections" 
                layout="horizontal" responsive
                style={{ width: '100%', maxWidth: '700px', maxHeight: '80vh', aspectRatio: 1.9 }}
                barCategoryGap={0}>
                <Bar dataKey="votes">
                    {curatedData.map((_, i) => (
                        <Cell
                            key={i}
                            fill={i === activeIndex ? "#F97316" : "#001F5B"}
                            onMouseEnter={() => setActiveIndex(i)}
                            onMouseLeave={() => setActiveIndex(null)}
                            onTouchStart={() => setActiveIndex(i)}
                            onTouchEnd={() => setActiveIndex(null)}
                        />
                    ))}
                </Bar>
                <XAxis type="category" width={80} dataKey="name" tick={renderCustomizedAxisTick} interval={0} />
                <CartesianGrid/>
            </BarChart>
        </main>
    )
        */}
}