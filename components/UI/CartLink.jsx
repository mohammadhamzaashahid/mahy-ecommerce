"use client";

import { usePathname } from "next/navigation";
import { Home, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

function CartLink() {
    const pathname = usePathname();
    const isCartPage = pathname === "/cart";

    return (
        <div className='fixed right-3 bottom-3 b-base text-white p-2 rounded-full border border-[#56aed6]'>
            {isCartPage ?
                <Link href={"/"}>
                    <Home size={20} />
                </Link>
                :
                <Link href={"/cart"}>
                    <ShoppingCart size={20} />
                </Link>
            }
        </div>
    )
}

export default CartLink