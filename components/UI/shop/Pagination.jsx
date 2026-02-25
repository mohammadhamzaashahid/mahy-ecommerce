"use client"

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const Pagination = ({ currentPage, totalPages }) => {
    const router = useRouter();

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;

        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("page", newPage);

        router.push(
            `${window.location.pathname}?${searchParams.toString()}`,
            { scroll: true } // ensures scroll to top
        );
    };

    const getVisiblePages = () => {
        const pages = [];

        // Always show first 3 pages if we're near the start
        if (currentPage <= 3) {
            for (let i = 1; i <= Math.min(3, totalPages); i++) {
                pages.push(i);
            }
            if (totalPages > 3) {
                pages.push("ellipsis");
                pages.push(totalPages);
            }
        }
        // Always show last 3 pages if we're near the end
        else if (currentPage >= totalPages - 2) {
            pages.push(1);
            pages.push("ellipsis");
            for (let i = Math.max(totalPages - 2, 1); i <= totalPages; i++) {
                pages.push(i);
            }
        }
        // Show current page with neighbors
        else {
            pages.push(1);
            pages.push("ellipsis");
            pages.push(currentPage - 1);
            pages.push(currentPage);
            pages.push(currentPage + 1);
            pages.push("ellipsis");
            pages.push(totalPages);
        }

        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <nav className="flex justify-center mt-8">
            <div className="inline-flex items-center justify-center gap-1 border border-gray-200 bg-white rounded-2xl p-1.5">
                {/* Previous Button */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={cn(
                        "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors",
                        "hover:text-gray-800",
                        currentPage === 1
                            ? "cursor-not-allowed text-gray-700"
                            : "cursor-pointer text-gray-600"
                    )}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center">
                    {visiblePages.map((page, index) => {
                        if (page === "ellipsis") {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="flex h-10 w-10 items-center justify-center text-gray-500"
                                >
                                    ···
                                </span>
                            );
                        }

                        const isCurrentPage = page === currentPage;
                        const isEndPage = page === totalPages && totalPages > 3;

                        return (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={cn(
                                    "flex h-10 w-10 items-center justify-center text-sm font-medium transition-all",
                                    "border border-transparent cursor-pointer",
                                    isCurrentPage && "border-gray-400 rounded-full bg-background font-semibold",
                                    isEndPage && !isCurrentPage && "border-gray-300 rounded-full",
                                    !isCurrentPage && "text-gray-600 hover:text-gray-800"
                                )}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={cn(
                        "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors",
                        "hover:text-gray-800",
                        currentPage === totalPages
                            ? "cursor-not-allowed text-gray-500"
                            : "cursor-pointer text-gray-800"
                    )}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </nav>
    );
};

export default Pagination;
