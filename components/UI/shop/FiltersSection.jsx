"use client"

import { useEffect, useState } from "react";
import FilterOptions from "@/components/UI/shop/FilterOptions";
import RangeSlider from "@/components/UI/shop/RangeSlider";
import categories from "@/constants/categories";
import { HiSearch } from "react-icons/hi";
import { usePathname, useRouter } from "next/navigation";

function FiltersSection({ brands, search }) {
    const [showFilters, setShowFilters] = useState(false);
    const [searchValue, setSearchValue] = useState(search || "");

    useEffect(() => {
        setSearchValue(search || "");
    }, [search]);


    const router = useRouter();
    const pathname = usePathname();

    const handleShowFilters = () => {
        if (!showFilters) document.body.style.overflow = 'hidden lg:auto';
        else document.body.style.overflow = 'auto';
        setShowFilters(!showFilters);
    };

    const reviews = [
        { rating: "4", value: "4" }
    ];

    const onSubmit = (e) => {
        e.preventDefault();
        router.replace(`${pathname}?search=${searchValue}#list`);
        setSearchValue("");
        setShowFilters(false);
    }

    return (
        <div>
            <aside className={`${showFilters ? "opacity-100 px-5 translate-x-0" : "opacity-0 pointer-events-none -translate-x-60"}
            w-5/6 md:w-64 shrink-0 min-h-screen md:h-screen overflow-y-auto bg-white pb-45 md:pb-0 p-6 md:p-0 md:pr-4 space-y-8
            fixed z-40 transition-all duration-500 inset-0 md:sticky scrollbar-hide pt-20 md:pt-0 top-0 md:top-18 md:pointer-events-auto md:opacity-100 md:translate-x-0`}>
                <div className="relative mb-7 group">
                    <form onSubmit={onSubmit}>
                        <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} name='search' className="border border-gray-300 f-base rounded-xl py-2 px-4 w-full text-sm pr-8 relative z-10" placeholder="" />
                        <div className='absolute inset-0 flex justify-end items-center right-2'>
                            <HiSearch className='t-base' />
                        </div>
                    </form>
                </div>
                <FilterOptions
                    title="Category"
                    paramKey="category"
                    options={categories}
                    initialVisibleCount={6}
                />
                <FilterOptions
                    title="Brand"
                    paramKey="brand"
                    options={brands.map(brand => ({ label: brand.label, value: brand.key }))}
                    initialVisibleCount={6}
                />
                <FilterOptions
                    title="Customer Reviews"
                    paramKey="rating"
                    options={reviews}
                    initialVisibleCount={5}
                />
                <RangeSlider
                    title="Price"
                    paramKey="price"
                    min={0}
                    max={5000}
                    step={10}
                />
            </aside>
            <button
                onClick={handleShowFilters}
                className={`
                    fixed bg-white bottom-3 left-3 ${showFilters ? "z-50" : "z-20"} 
                    rounded-3xl border-base text-sm px-6 py-2 t-base lg:hidden`}>
                {showFilters ? "Close" : "Filters"}
            </button>
        </div>
    )
}

export default FiltersSection