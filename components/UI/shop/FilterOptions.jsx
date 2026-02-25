"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Star } from "lucide-react";

const FilterOptions = ({ title, paramKey, options, initialVisibleCount = 5 }) => {
    const searchParams = useSearchParams(); // ✅ no destructuring
    const router = useRouter();
    const [expanded, setExpanded] = useState(false);

    const currentValue = searchParams.get(paramKey) || "all";

    const allOptions = [{ label: "All", value: "all" }, ...options];

    const handleSelect = (value) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value === "all") {
            params.delete(paramKey);
        } else {
            params.set(paramKey, value);
        }
        params.delete("page"); // Reset to first page on filter change

        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="w-full max-w-xs">
            <h3 className="text-sm font-bold mb-3">{title}</h3>

            <div className="flex flex-col gap-1">
                {allOptions.slice(0, expanded ? allOptions.length : initialVisibleCount + 1)
                    .map(option => (
                        <button
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className="flex items-center gap-2.5 py-1 px-0 text-left bg-transparent border-none cursor-pointer group"
                        >
                            <span className={`size-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-150 ${currentValue === option.value ? "border-[#79c4e7]" : "border-gray-500"}`}>
                                {currentValue === option.value && <span className="size-2.5 rounded-full bg-[#79c4e7]" />}
                            </span>
                            {option.label && (
                                <span className={`text-sm leading-tight transition-colors duration-150 group-hover:text-[#2faae2] ${currentValue === option.value ? "font-medium text-foreground" : "text-foreground"}`}>
                                    {option.label}
                                </span>
                            )}
                            {option.rating && (
                                <span className={`flex gap-1.5 items-center text-sm leading-tight transition-colors duration-150 group-hover:text-[#2faae2] ${currentValue === option.value ? "font-medium text-foreground" : "text-foreground"}`}>
                                    <div className="flex">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                size={12}
                                                fill={i < option.rating ? "orange" : "white"} stroke="orange"
                                            />
                                        ))}
                                    </div>
                                    & up
                                </span>
                            )}
                        </button>
                    ))}
            </div>

            {allOptions.length > initialVisibleCount + 1 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-3 flex items-center gap-1 text-[#2faae2] text-sm"
                >
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {expanded ? "See less" : "See more"}
                </button>
            )}
        </div>
    );
};

export default FilterOptions;