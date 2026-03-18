import Cart from '@/components/UI/cart/Cart'
import { getProductsWithQuantity } from '@/constants/products';
// import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import React from 'react'

async function CartPage() {
    const cookieStore = await cookies();
    const cart = cookieStore.get("cart")
        ? JSON.parse(cookieStore.get("cart").value)
        : [];

    // const products = await getProductsByIds(cart.map(cart => cart.productId))
    // const combined = combineProductsWithCart(products, cart);
    const products = getProductsWithQuantity(cart);
    // const t = await getTranslations("CartPage");

    return (
        <main className='max-w-350 mx-auto pt-25 pb-15 px-4'>
            <Cart
                initialProducts={products}
                columns={["Product", "Price", "Quantity", "Total", ""]}
                currency="AED"
                totalText="Total"
                checkout="Checkout"
            />
        </main>
    )
}

export default CartPage