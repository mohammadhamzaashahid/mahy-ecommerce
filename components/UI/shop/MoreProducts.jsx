"use client"
import { useRef } from 'react';
import ProductCard from './ProductCard'
import ScrollButtons from './ScrollButtons';

function MoreProducts({ products, modelHeading, modelsHeading, currency, buy, locale, addToCartText, toastText }) {
    const scrollRef = useRef(null);
    return (
        <section className='mt-15 pt-10 border-t border-gray-300'>
            <h3 className='text-lg md:text-2xl font-semibold'>You may also like</h3>
            <div className='flex flex-nowrap overflow-scroll hide-scrollbar gap-5 mt-4 md:mt-8 pl-5 lg:pl-0 items-stretch' ref={scrollRef}>
                {products.map((product, i) => (
                    <div className='flex-none w-11/12 lg:w-4/12' key={i}>
                        <ProductCard
                            id={product.partNumber}
                            title={product.overview}
                            image={product.images[0]}
                            models={product.models}
                            price={product.standardPrice}
                            specs={product.specs}
                            href={`/${product.partNumber}`}
                            modelHeading={modelHeading}
                            modelsHeading={modelsHeading}
                            currency={currency}
                            buy={buy}
                            addToCartText={addToCartText}
                            toastText={toastText}
                        />
                    </div>
                ))}
            </div>
            <ScrollButtons scrollRef={scrollRef} length={products.length} locale={locale} />
        </section>
    )
}

export default MoreProducts
