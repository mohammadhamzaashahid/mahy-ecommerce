"use client";

import { usePathname } from "next/navigation";
import { Home, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

function CartLink() {
    const pathname = usePathname();
    const isCartPage = pathname === "/cart";
    const iconSize = 26;

    const [cartLength, setCartLength] = useState(0);
    const [mounted, setMounted] = useState(false); // track client mount

    const getCartLength = () => {
        const cart = Cookies.get("cart");
        if (!cart) return 0;
        try {
            const parsed = JSON.parse(cart);
            return Array.isArray(parsed) ? parsed.length : 0;
        } catch {
            return 0;
        }
    };

    useEffect(() => {
        setMounted(true); // only render client-dependent UI after mount

        const updateCart = () => setCartLength(getCartLength());
        window.addEventListener("cartUpdated", updateCart);

        // Optional: listen for changes in other tabs
        const interval = setInterval(() => setCartLength(getCartLength()), 1000);

        // Initial read
        setCartLength(getCartLength());

        return () => {
            window.removeEventListener("cartUpdated", updateCart);
            clearInterval(interval);
        };
    }, []);

    if (!mounted) return null; // prevent SSR mismatch

    return (
        <div className="fixed right-3 top-3 b-base text-white p-3 rounded-full border border-[#56aed6]">
            {isCartPage ? (
                <Link href={"/"}>
                    <Home size={iconSize} />
                </Link>
            ) : (
                <>
                    <Link href={"/cart"}>
                        <ShoppingCart size={iconSize} />
                    </Link>
                    {cartLength > 0 && (
                        <div className="absolute -top-1 -right-2 p-1 bg-white border border-[#56aed6] t-base size-6 flex justify-center items-center rounded-full text-sm">
                            {cartLength}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default CartLink;