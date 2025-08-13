"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Dropdown, DropdownButton, DropdownItem, DropdownItems } from "./dropdown";
import { DEFAULT_PAGE_SIZE } from "./constants";
import { positionEnumValues, type Position } from "~/server/db/schema";

export default function SearchBar({ initialQuery, initialPageSize }: { initialQuery: string; initialPageSize: number }) {
    const [query, setQuery] = useState(initialQuery);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [sortBy, setSortBy] = useState<"first_name" | "last_name" | "grad_year" | Position>("grad_year");
    const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");

    const router = useRouter();
    const currentPath = usePathname().split('/')[1]; // 'about', 'alumni', etc.

    const search = () => {
        const newQuery = new URLSearchParams();
        if (query.trim()) newQuery.set("query", query.trim());
        if (pageSize !== DEFAULT_PAGE_SIZE) newQuery.set("pageSize", pageSize.toString());
        if (sortBy) newQuery.set("sortBy", sortBy);
        if (sortDirection) newQuery.set("sortDirection", sortDirection);
        router.push(`/${currentPath}?${newQuery}`);
    }

    return (
        <div className="flex items-center justify-between gap-4 p-4 mx-6"> 
            <div className="flex-grow max-w-md relative">
                <div className="flex-gap-4">

            <input 
            className="w-full px-4 py-2 border-4 border-[var(--shpe-yellow)] rounded-full 
             focus:outline-none focus:ring-4 focus:ring-[var(--shpe-yellow)] 
             text-center text-black placeholder:text-center placeholder:text-black placeholder:font-semi-bold placeholder:font-helvetica" value={query} onChange={(e) => setQuery(e.currentTarget.value)} onKeyDown={(e) => {
                if (e.key === "Enter") {
                    search();
                }
            }} placeholder="NAME" />

            <button 
                        onClick={search}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 text-gray-500 hover:text-gray-700" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                            />
                        </svg>
                    </button>
            </div>
            </div>
            <div className = "flex space-x-4"> 
            <Dropdown>
                <DropdownButton> {sortBy === "first_name" ? "First Name" : sortBy === "last_name" ? "Last Name" : sortBy === "grad_year" ? "Graduation Year" : sortBy}</DropdownButton>
                <DropdownItems>
                    {["grad_year", "first_name", "last_name", ...positionEnumValues].map(field => (
                        <DropdownItem key={field} onClick={() => {
                            setSortBy(field as "first_name" | "last_name" | "grad_year" | Position);
                            search();
                        }}>
                            {field === "first_name" ? "First Name" : field === "last_name" ? "Last Name" : field === "grad_year" ? "Graduation Year" : field}
                        </DropdownItem>
                    ))}
                </DropdownItems>
            </Dropdown>
            <Dropdown>
                <DropdownButton>{sortDirection === "desc" ? "Descending" : "Ascending"}</DropdownButton>
                <DropdownItems>
                    {["desc", "asc"].map(direction => (
                        <DropdownItem key={direction} onClick={() => {
                            setSortDirection(direction as "desc" | "asc");
                            search();
                            }}>

                            {direction === "desc" ? "Descending" : "Ascending"}
                        </DropdownItem>
                    ))}
                </DropdownItems>
            </Dropdown>
             <Dropdown>
                <DropdownButton>{pageSize ?? DEFAULT_PAGE_SIZE} / page</DropdownButton>
                <DropdownItems>
                    {[10, 20, 50, 100].map(size => (
                        <DropdownItem key={size} onClick={() => {
                            setPageSize(size);
                            search();
                        }}>
                            {size} / page
                        </DropdownItem>
                    ))}
                </DropdownItems>
            </Dropdown>
           
        </div>
        </div>
    )
}