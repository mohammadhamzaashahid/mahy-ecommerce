import { Star, ShoppingCart, Van } from 'lucide-react';
import React, { useState } from 'react'
import { HiMinus, HiPlus } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { useCart } from '@/components/Providers/CartProvider';

function ProductDetailSection({ company, product, model, locale, currency, addToCartText, modelHeading, modelsHeading, productDetail, toastText }) {
    const [modelIndex, setModelIndex] = useState(Number(model || 0));
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCart();

    const decrement = () => {
        if (quantity === 1) return;
        setQuantity(quantity - 1);
    };

    return (
        <div className="md:col-span-3 mt-4 px-5 select-none flex flex-col lg:flex-row gap-6">
            <div className='lg:w-4/6'>
                <h1 className={`text-2xl md:text-3xl font-semibold leading-tight mt-2 ${locale !== "ar" && "tracking-tighter"}`}>{product.overview}</h1>
                {/* Rating */}
                <div className="flex gap-2 mt-4 md:mt-2.5 items-start">
                    <span className="text-xs">4.1</span>
                    <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={14} fill={i < 4 ? "orange" : "white"} stroke="orange" />
                        ))}
                    </div>
                    <span className="text-xs text-gray-600">(41)</span>
                </div>

                <p className='mt-4 md:mt-3 text-xs border-b border-gray-300 pb-4'><span className='font-semibold '>200+ bought</span> in past month</p>

                {/* Specs */}
                <div className='space-y-2 mt-4 text-sm'>
                    {product.specs.map((spec, i) => (
                        <div key={i} className="flex gap-2">
                            <span className="text-gray-900 font-medium w-[35%]">{spec.title}</span>
                            <p className="text-gray-800 w-[65%]">{spec.text}</p>
                        </div>
                    ))}
                    <div className='flex gap-2'>
                        <span className="text-gray-900 font-medium w-[35%]">Weight</span>
                        <p className="text-gray-800 w-[65%]">{product.weight} kgs</p>
                    </div>
                </div>

                <div className='mt-4 border-t border-gray-300 pt-4'>
                    <h2 className='font-semibold text-gray-700 '>About this item</h2>
                    <ul className='list-disc list-inside space-y-1 text-gray-900 font-light tracking-tight mt-2 md:mt-2 text-sm md:text-base'>
                        {product.about.map((item, i) => (
                            <li key={i} className='text-justify'>{item}</li>
                        ))}
                    </ul>
                </div>


                {/* <div className="grid grid-cols-2 gap-y-4 gap-x-6 rounded-xl border border-gray-100 p-6 bg-white text-sm">
                <p className=" text-gray-500">Standard Price</p>
                <p className="font-medium text-gray-900">
                    {product.standardPrice}
                </p>

                <p className=" text-gray-500">Amazon Price</p>
                <p className="font-medium text-gray-900">
                    {product.amazonPrice}
                </p>

                <p className=" text-gray-500">Weight</p>
                <p className="font-medium text-gray-900">
                    {product.weight} lbs
                </p>

                <p className=" text-gray-500">Freight Charges</p>
                <p className="font-medium text-gray-900">
                    {product.freightCharges}
                </p>

                <div className="col-span-2 border-t border-gray-200 pt-2 mt-2" />

                <div className='flex items-center'>
                    <p className="text-gray-500">Selling Price (with Freight)</p>
                </div>
                <p className="font-semibold text-base tracking-tight text-gray-900">
                    {product.sellingPriceWithFreight} {currency}
                </p>

                <p className=" text-gray-500">New Amazon Selling Price</p>
                <p className="font-medium text-gray-900 ">
                    {product.newAmazonSellingPrice}
                </p>
            </div> */}

                {product.models && (
                    <div className='mt-10'>
                        <p className='font-medium uppercase text-sm text-gray-600 mb-2'>{product.models.length > 1 ? modelsHeading : modelHeading}</p>
                        {product.models.map((model, i) => (
                            <button key={i} onClick={() => setModelIndex(i)}
                                className={`rounded-xl border border-[#79c4e7] ${i === modelIndex ? "text-white bg-[#79c4e7]" : "text-[#79c4e7]"}  py-1 px-4 mr-2 text-sm hover:text-white hover:bg-[#79c4e7] transition-colors duration-300`}>
                                {model}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className='lg:w-2/6'>
                <div className='border border-gray-300 rounded-lg p-5'>
                    <Van stroke='#79c4e7' size={35} />
                    <p className='text-sm mt-2.5 text-gray-700'>Reliable delivery and great deals on quality products delivered to your door.</p>
                </div>
                <div className='border border-gray-300 rounded-lg p-5 mt-4'>
                    <span className='font-medium text-sm'>Buy New:</span>
                    <div className='flex justify-between gap-2 mt-3 text-xs'>
                        <span className="text-gray-700">Standard Price</span>
                        <p className="text-gray-800">{product.standardPrice} {currency}</p>
                    </div>
                    <div className='flex justify-between gap-2 mt-1 text-xs'>
                        <span className="text-gray-700">Freight Charges</span>
                        <p className="text-gray-800">{product.freightCharges} {currency}</p>
                    </div>
                    <div className="flex gap-0.5 mt-4">
                        <span className="text-gray-700 font-medium text-xs">AED</span>
                        <p className="font-medium text-3xl">{product.standardPrice.toLocaleString()}</p>
                        <span className="text-gray-700 font-medium text-xs">00</span>
                    </div>
                    <div className="flex flex-col gap-3 mt-5 text-sm">
                        <div className="bg-white border border-gray-100 rounded-xl py-1.5 px-4 flex justify-between items-center gap-10">
                            <button onClick={decrement}>
                                <HiMinus />
                            </button>
                            <p className="font-medium text-base">{quantity}</p>
                            <button onClick={() => setQuantity(quantity + 1)} >
                                <HiPlus />
                            </button>
                        </div>
                        <button className="b-base b-base-hover rounded-xl py-1.5 px-4 flex items-center justify-center gap-4 w-full"
                            onClick={() => {
                                addItem({
                                    productId: product.partNumber,
                                    name: product.overview,
                                    price: Number(product.standardPrice) || 0,
                                    image: product.images?.[0],
                                    currency,
                                }, quantity);
                                setQuantity(1);
                                toast.success(toastText || "Item added to cart!");
                            }}
                        >
                            <ShoppingCart stroke='white' size={18} />
                            <span className="text-white font-medium py-1">{addToCartText}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailSection
