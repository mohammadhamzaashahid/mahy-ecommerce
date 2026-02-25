"use client"
import React from 'react'
import CartItem from './CartItem'
import Link from 'next/link';
import { LockIcon } from 'lucide-react';
import Cookies from 'js-cookie';

function Cart({ columns, products, currency, totalText, checkout }) {
    if (products.length === 0)
        return (<div><p>Your cart is empty</p></div>);

    const total = products.reduce((sum, product) => {
        return sum + product.price * product.quantity;
    }, 0);

    const handleCheckout = () => {
        Cookies.remove("cart");
    }

    return (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
            <div className='lg:col-span-2'>
                <table className='w-full'>
                    <thead>
                        <tr className='uppercase text-gray-600 text-sm'>
                            {columns.map((column, i) => (
                                <th key={i}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((item, i) => (
                            <CartItem key={i} item={item} />
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
                            <p className=''>{currency}</p>
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