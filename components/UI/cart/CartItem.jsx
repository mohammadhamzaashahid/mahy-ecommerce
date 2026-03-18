import { Minus, Plus, Trash } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

function CartItem({ item, changeQuantity, removeFromCart }) {
    return (
        <tr className='border-b border-gray-200'>
            <td className='relative text-center align-middle flex items-center gap-6 py-8 min-w-30'>
                <div className='relative size-20'>
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        style={{ objectFit: "contain" }}
                    />
                </div>
                <div>
                    <p className='text-gray-600 max-w-80'>{item.name}</p>
                </div>
            </td>
            <td className='text-center align-middle py-8 min-w-30'>{item.price}</td>

            <td className='text-center align-middle py-8 min-w-30'>
                <div className='flex items-center justify-center'>
                    <button
                        onClick={() => changeQuantity(item.productId, -1)}
                        className='size-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200'
                    >
                        <Minus size={13} />
                    </button>
                    <span className='px-3 text-gray-700 font-medium'>{item.quantity}</span>
                    <button
                        onClick={() => changeQuantity(item.productId, 1)}
                        className='size-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200'
                    >
                        <Plus size={13} />
                    </button>
                </div>
            </td>


            <td className='text-center align-middle py-8 min-w-30'>
                {item.price * item.quantity}
            </td>
            <td className='text-center align-middle py-8'>
                <button
                    onClick={() => removeFromCart(item.productId)}
                    className='p-3 rounded-full bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center'
                    title="Remove from cart"
                >
                    <Trash className='text-red-600' size={17} />
                </button>
            </td>
        </tr>
    )
}

export default CartItem