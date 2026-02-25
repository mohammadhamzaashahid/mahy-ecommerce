"use client"
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

function TopFilter({ items, locale, topFilter }) {
    const [scrollProgress, setScrollProgress] = useState(0);
    const containerRef = useRef(null);

    const getRTLScrollLeft = (el) => {
        if (el.scrollLeft < 0) return Math.abs(el.scrollLeft);
        return el.scrollWidth - el.clientWidth - el.scrollLeft;
    };

    const updateScroll = () => {
        const container = containerRef.current;
        if (!container) return;
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (maxScroll <= 0) return;
        const scroll = locale === "ar" ? getRTLScrollLeft(container) : container.scrollLeft;

        const percentage = (scroll / maxScroll) * 100;
        if (percentage === 100 && locale === "ar") setScrollProgress(0);
        else setScrollProgress(percentage);
    };

    const scrollBy = (amount) => {
        containerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        container.addEventListener('scroll', updateScroll);
        updateScroll();
        return () => container.removeEventListener('scroll', updateScroll);
    }, []);

    const Card = ({ item }) => {
        const href = topFilter === item.key ? "/" : `/?brand=${item.key}`;
        return (
            <Link href={href}
                className={`flex-none transition-all h-35 duration-500 w-50 bg-gray-50 rounded-xl px-5 py-4 
                            ${topFilter === item.key && "w-70 border flex items-center gap-4"}`}>
                <div>
                    <p className={`text-sm font-medium mb-2 ${topFilter !== item.key && "h-9"}`}>{item.label}</p>
                    {topFilter === item.key && <p className='text-gray-600 text-xs'>{item.text}</p>}
                </div>
                <div className="flex justify-center">
                    <div className='relative w-14 h-14'>
                        <Image src={item.image} alt={item.label} fill style={{ objectFit: "cover" }} />
                    </div>
                </div>
            </Link>
        )
    };

    return (
        <div className='mt-5'>
            {/* Horizontal scroll container */}
            <div className='flex gap-4 flex-nowrap overflow-x-scroll hide-scrollbar' ref={containerRef}>
                {items.map((item, i) => (
                    <Card key={i} item={item} />
                ))}
            </div>
            {/* Scroll progress and buttons */}
            <div className='flex mt-4 items-center gap-8 max-w-lg md:max-w-xl mx-auto px-4'>
                <div className='bg-gray-200 h-2 w-11/12 relative rounded-2xl overflow-hidden'>
                    <div className={`absolute bottom-0 top-0 ${locale === "ar" ? "right-0" : "left-0"} bottom-0 b-base rounded-2xl`} style={{ width: `${scrollProgress}%` }} />
                </div>
                <div className={`flex gap-1 ${locale === "ar" && "flex-row-reverse"} w-1/12 justify-center`}>
                    <button className='border border-gray-300 p-1 rounded-full' onClick={() => scrollBy(-200)}>
                        <ChevronLeft color='gray' />
                    </button>
                    <button className='border border-gray-300 p-1 rounded-full' onClick={() => scrollBy(200)}>
                        <ChevronRight color='gray' />
                    </button>
                </div>
            </div>
        </div>
    )
};

export default TopFilter;