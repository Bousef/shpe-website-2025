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
        <div>
            <input className="border-2" value={query} onChange={(e) => setQuery(e.currentTarget.value)} onKeyDown={(e) => {
                if (e.key === "Enter") {
                    search();
                }
            }} placeholder="Search..." />

            <Dropdown>
                <DropdownButton>{pageSize ?? DEFAULT_PAGE_SIZE} / page</DropdownButton>
                <DropdownItems>
                    {[10, 20, 50, 100].map(size => (
                        <DropdownItem key={size} onClick={() => {
                            setPageSize(size);
                        }}>
                            {size} / page
                        </DropdownItem>
                    ))}
                </DropdownItems>
            </Dropdown>
            <Dropdown>
                <DropdownButton>Sort By: {sortBy === "first_name" ? "First Name" : sortBy === "last_name" ? "Last Name" : sortBy === "grad_year" ? "Graduation Year" : sortBy}</DropdownButton>
                <DropdownItems>
                    {["grad_year", "first_name", "last_name", ...positionEnumValues].map(field => (
                        <DropdownItem key={field} onClick={() => {
                            setSortBy(field as "first_name" | "last_name" | "grad_year" | Position);
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
                        }}>
                            {direction === "desc" ? "Descending" : "Ascending"}
                        </DropdownItem>
                    ))}
                </DropdownItems>
            </Dropdown>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer" onClick={search}>
                Search
            </button>
        </div>
    )
}