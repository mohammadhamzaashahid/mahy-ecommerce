"use client";

import { ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCart } from "@/components/Providers/CartProvider";

function Badge({ value }) {
    if (!value) return null;
    return (
        <span className="absolute -top-1 -right-1 min-w-[1.25rem] rounded-full bg-red-500 px-1 text-center text-[10px] font-semibold leading-4 text-white">
            {value > 99 ? "99+" : value}
        </span>
    );
}

export default function CartLauncher() {
    const { itemCount, openCart } = useCart();
    const pathname = usePathname();
    const t = useTranslations("CartPage");

    if (!pathname?.startsWith("/shop")) return null;

    return (
        <button
            type="button"
            onClick={openCart}
            className="relative inline-flex items-center gap-2 rounded-full border border-white/40 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10"
            aria-label={t("OpenCart")}
        >
            <span className="relative">
                <ShoppingCart size={18} />
                <Badge value={itemCount} />
            </span>
            <span className="hidden sm:inline">{t("CartButtonLabel")}</span>
        </button>
    );
}
