"use client";

import { useEffect, useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { useSearchParams, useRouter } from "next/navigation";

const RangeSlider = ({ title, paramKey, min, max, step = 1 }) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const formatValue = (v) => `AED ${v.toLocaleString()}`;

    const getParamMin = () =>
        Number(searchParams.get(`${paramKey}_min`)) || min;

    const getParamMax = () =>
        Number(searchParams.get(`${paramKey}_max`)) || max;

    const [values, setValues] = useState([getParamMin(), getParamMax()]);

    // Sync slider when URL changes (back/forward, external filters)
    useEffect(() => {
        setValues([getParamMin(), getParamMax()]);
    }, [searchParams]);

    const handleValueChange = (newValues) => {
        setValues(newValues);
    };

    const handleValueCommit = (newValues) => {
        const params = new URLSearchParams(searchParams.toString());

        if (newValues[0] === min) {
            params.delete(`${paramKey}_min`);
        } else {
            params.set(`${paramKey}_min`, String(newValues[0]));
        }

        if (newValues[1] === max) {
            params.delete(`${paramKey}_max`);
        } else {
            params.set(`${paramKey}_max`, String(newValues[1]));
        }
        params.delete("page"); // Reset to first page on filter change

        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="w-full max-w-xs">
            <h3 className="text-sm font-bold mb-3">{title}</h3>

            <p className="text-sm font-semibold mb-4">
                {formatValue(values[0])} – {formatValue(values[1])}
            </p>

            <SliderPrimitive.Root
                className="relative flex items-center w-full h-5"
                value={values}
                onValueChange={handleValueChange}
                onValueCommit={handleValueCommit}
                min={min}
                max={max}
                step={step}
                minStepsBetweenThumbs={1}
            >
                <SliderPrimitive.Track className="relative grow h-1 bg-[#9acee6] rounded-full">
                    <SliderPrimitive.Range className="absolute h-full bg-[#79c4e7] rounded-full" />
                </SliderPrimitive.Track>
                <SliderPrimitive.Thumb className="size-6 bg-white border-[3px] border-[#79c4e7] rounded-full shadow-md flex items-center cursor-grab active:cursor-grabbing justify-center outline-none">
                    <span className="size-2 bg-[#79c4e7] rounded-full pointer-events-none" />
                </SliderPrimitive.Thumb>
                <SliderPrimitive.Thumb className="size-6 bg-white border-[3px] border-[#79c4e7] rounded-full shadow-md flex items-center cursor-grab active:cursor-grabbing justify-center outline-none">
                    <span className="size-2 bg-[#79c4e7] rounded-full pointer-events-none" />
                </SliderPrimitive.Thumb>
            </SliderPrimitive.Root>
        </div>

    );
};

export default RangeSlider;