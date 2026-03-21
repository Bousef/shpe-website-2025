"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "~/trpc/react";

interface NominatimResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

interface LocationAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    isVirtual: boolean;
}

export default function LocationAutocomplete({
    value,
    onChange,
    isVirtual,
} : LocationAutocompleteProps) {
    const [results, setResults] = useState<NominatimResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const utils = api.useUtils();

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setActiveIndex(-1);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Scroll active item into view
    useEffect(() => {
        if (activeIndex >= 0 && listRef.current) {
            const item = listRef.current.children[activeIndex] as HTMLElement;
            item?.scrollIntoView({ block: "nearest" });
        }
    }, [activeIndex]);

    const fetchSuggestions = useCallback(async (query: string) => {
        if (!query.trim()) {
            setResults([]);
            setIsOpen(false);
            setHasSearched(false);
            return;
        }

        setIsLoading(true);

        try {
            // Calls eventsRouter.searchLocations on the server — Nominatim never touched from the browser
            const data = await utils.events.searchLocations.fetch({ query });
            setResults(data);
            setIsOpen(true);
            setHasSearched(true);
            setActiveIndex(-1);
        } catch {
            setResults([]);
            setHasSearched(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newValue = e.target.value;
        onChange(newValue);
        if (!isVirtual) {
            // Clear any pending request before scheduling a new one
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                void fetchSuggestions(newValue);
            }, 350);
        }
    }

    function handleSelect(result: NominatimResult) {
        // Sets display_name as the location string — matches what AddressConvert
        // expects server-side inside createEvent.mutate() to resolve lat/lng.
        onChange(result.display_name);
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.focus();
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!isOpen || isVirtual) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
                break;
            case "ArrowUp":
                e.preventDefault();
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case "Enter":
                // Prevent form submission when navigating the dropdown
                if (activeIndex >= 0 && results[activeIndex]) {
                    e.preventDefault();
                    handleSelect(results[activeIndex]);
                }
                break;
            case "Escape":
                setIsOpen(false);
                setActiveIndex(-1);
                break;
        }
    }

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                {/* Spinner shown while fetching — only for physical locations */}
                {!isVirtual && isLoading && (
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg
                            className="h-4 w-4 animate-spin text-slate-400"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                        </svg>
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="text"
                    role={!isVirtual ? "combobox" : undefined}
                    aria-expanded={!isVirtual ? isOpen : undefined}
                    aria-haspopup={!isVirtual ? "listbox" : undefined}
                    aria-autocomplete={!isVirtual ? "list" : undefined}
                    aria-controls={!isVirtual ? "location-listbox" : undefined}
                    aria-activedescendant={
                        !isVirtual && activeIndex >= 0
                            ? `location-option-${activeIndex}`
                            : undefined
                    }
                    value={value}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (!isVirtual && results.length > 0) setIsOpen(true);
                    }}
                    placeholder={
                        isVirtual
                            ? "e.g. https://zoom.us/j/123456"
                            : "e.g. Engineering Building I, Room 120"
                    }
                    autoComplete="off"
                    className="mt-0.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-medium text-slate-800 outline-none transition-colors focus:border-[#001f5b] focus:ring-1 focus:ring-[#001f5b]"
                />
            </div>

            {/* Dropdown — only rendered for physical locations */}
            {!isVirtual && isOpen && (
                <ul
                    id="location-listbox"
                    ref={listRef}
                    role="listbox"
                    aria-label="Location suggestions"
                    className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
                >
                    {results.length > 0 ? (
                        results.map((result, index) => (
                            <li
                                key={result.place_id}
                                id={`location-option-${index}`}
                                role="option"
                                aria-selected={index === activeIndex}
                                // onMouseDown with preventDefault prevents the input
                                // from blurring before the click registers
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelect(result);
                                }}
                                onMouseEnter={() => setActiveIndex(index)}
                                className={`flex cursor-pointer flex-col gap-0.5 px-3 py-2.5 transition-colors ${
                                    index === activeIndex
                                        ? "bg-[#001f5b] text-white"
                                        : "text-slate-800 hover:bg-slate-50"
                                }`}
                            >
                                {/* display_name is what gets stored in `location` and
                                    passed to AddressConvert server-side */}
                                <span className="truncate text-sm font-medium leading-snug">
                                    {result.display_name}
                                </span>

                                {/* Coords shown purely as a visual confirmation aid.
                                    Geocoding is handled server-side by AddressConvert. */}
                                <span
                                    className={`text-xs tabular-nums ${
                                        index === activeIndex ? "text-blue-200" : "text-slate-400"
                                    }`}
                                >
                                    {parseFloat(result.lat).toFixed(5)},{" "}
                                    {parseFloat(result.lon).toFixed(5)}
                                </span>
                            </li>
                        ))
                    ) : hasSearched ? (
                        <li className="px-3 py-3 text-center text-sm text-slate-400">
                            No results found
                        </li>
                    ) : null}
                </ul>
            )}
        </div>
    );
}