"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Dropdown, DropdownButton, DropdownItem, DropdownItems } from "./dropdown";

const DEFAULT_PAGE_SIZE = 20;

export default function SearchBar({ initialQuery, initialPageSize }: { initialQuery: string; initialPageSize: number }) {
    const [query, setQuery] = useState(initialQuery);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const router = useRouter();
    const currentPage = usePathname().split('/')[1]; // 'about', 'alumni', etc.

    const search = () => {
        const newQuery = new URLSearchParams();
        if (query.trim()) newQuery.set("query", query.trim());
        if (pageSize !== DEFAULT_PAGE_SIZE) newQuery.set("pageSize", pageSize.toString());
        router.push(`/${currentPage}?${newQuery}`);
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
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={search}>
                Search
            </button>
        </div>
    )
}