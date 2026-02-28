"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

function HorizontalFilters({ items }) {
    const searchParams = useSearchParams();
    const active = searchParams.get("brand");

    const buildHref = (key) => {
        const params = new URLSearchParams(searchParams.toString());

        if (active === key) {
            // remove filter if clicking active
            params.delete("brand");
        } else {
            params.set("brand", key);
        }

        const query = params.toString();
        return query ? `/?${query}` : "/";
    };

    return (
        <div className="mt-6 mb-8">
            <div className="flex flex-wrap gap-x-3 gap-y-2 overflow-x-auto no-scrollbar">
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
        </div>
    );
}

export default HorizontalFilters;