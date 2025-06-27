
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ initialQuery }: { initialQuery: string }) {
    const [query, setQuery] = useState(initialQuery);

    const router = useRouter();

    const search = () => {
        router.push(`/alumni?query=${query}`);
    }

    return (
        <div>
            <input value={query} onChange={(e) => setQuery(e.currentTarget.value)} onKeyDown={(e) => {
                if (e.key === "Enter") {
                    search();
                }
            }} placeholder="Search..." />
        </div>
    )
}