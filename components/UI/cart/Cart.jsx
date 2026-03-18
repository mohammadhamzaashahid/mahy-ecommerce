"use client"
import React, { useState } from 'react'
import CartItem from './CartItem'
import { LockIcon } from 'lucide-react';
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';

function Cart({ columns, initialProducts, currency, totalText, checkout }) {
    const router = useRouter();
    const [products, setProducts] = useState(initialProducts);

    const changeQuantity = (productId, delta) => {
        const updatedCart = products.map(item => {
            if (item.productId === productId) {
                const newQty = item.quantity + delta;
                return { ...item, quantity: newQty < 1 ? 1 : newQty };
            }
            return item;
        });
        setProducts(updatedCart);
        Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 });
    };

    const removeFromCart = (productId) => {
        const updatedCart = products.filter(item => item.productId !== productId);
        setProducts(updatedCart);
        Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 });
        toast.success("Item removed from Cart");
    };

    const total = products.reduce((sum, product) => sum + product.price * product.quantity, 0);

    const handleCheckout = () => {
        Cookies.remove("cart");
        setProducts([]);
        router.push("/");
    };

    if (products.length === 0)
        return <div><p className='text-center py-10'>Your cart is empty</p></div>;

    return (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
            <div className='lg:col-span-2 overflow-x-scroll hide-scrollbar'>
                <table className='w-full'>
                    <thead>
                        <tr className='uppercase text-gray-600 text-sm'>
                            {columns.map((column, i) => (
                                <th key={i}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((item) => (
                            <CartItem
                                key={item.productId}
                                item={item}
                                changeQuantity={changeQuantity}
                                removeFromCart={removeFromCart} />
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='bg-gray-50 rounded-xl py-10 px-10'>
                <div className='border-t-3 border-gray-400'>
                    <div className='flex justify-between items-center px-8 gap-3 mt-15'>
                        <p className='uppercase text-gray-700 text-sm'>{totalText}</p>
                        <div className='flex items-center gap-2'>
                            <span className='text-4xl'>{total}</span>
                            <p>{currency}</p>
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <button onClick={handleCheckout} className='flex items-center gap-3 b-base b-base-hover w-fit px-5 py-3 text-white rounded-2xl mt-10 text-sm'>
                            {checkout}
                            <LockIcon size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart