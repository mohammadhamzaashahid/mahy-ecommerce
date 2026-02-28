"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function HorizontalFilters({ items }) {
    const searchParams = useSearchParams();
    const active = searchParams.get("brand");
    const containerRef = useRef(null);

    const buildHref = (key) => {
        const params = new URLSearchParams(searchParams.toString());

        if (active === key) {
            params.delete("brand");
        } else {
            params.set("brand", key);
        }

        const query = params.toString();
        return query ? `/?${query}` : "/";
    };

    const scrollBy = (amount) => {
        containerRef.current?.scrollBy({
            left: amount,
            behavior: "smooth",
        });
    };

    return (
        <div className="relative mt-6 mb-8">
            {/* Left Arrow */}
            <button
                onClick={() => scrollBy(-250)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full border border-gray-200 p-2"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Scroll Container */}
            <div
                ref={containerRef}
                className="flex gap-3 overflow-x-auto hide-scrollbar px-10 md:px-12"
            >
                {items.map((item) => {
                    const isActive = active === item.key;

                    return (
                        <Link
                            key={item.key}
                            href={buildHref(item.key)}
                            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition
                ${isActive
                                    ? "bg-black text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            {/* Right Arrow */}
            <button
                onClick={() => scrollBy(250)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md border border-gray-200 rounded-full p-2"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
}

export default HorizontalFilters;