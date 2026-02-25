import Image from 'next/image'
import React from 'react'

function CartItem({ item }) {
    return (
        <tr className='border-b border-gray-200'>
            <td className='relative text-center align-middle flex items-center flex-col gap-4 py-8'>
                <Image src={item.image} alt={item.name} width={80} height={60} style={{ objectFit: "cover" }} />
                <div>
                    <p className='text-gray-600 font-semibold'>{item.name}</p>
                </div>
            </td>
            <td className='text-center align-middle py-8'>{item.price}</td>
            <td className='text-center align-middle py-8'>{item.quantity}</td>
            <td className='text-center align-middle py-8'>{item.price * item.quantity}</td>
        </tr>
    )
}

export default CartItem