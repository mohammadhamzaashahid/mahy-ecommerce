import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const scrollToTop = (href, router) => {
    const onScrollEnd = () => {
        if (window.scrollY <= 0) {
            window.removeEventListener("scroll", onScrollEnd);
            router.push(href);
        }
    };

    window.addEventListener("scroll", onScrollEnd, { passive: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
}