"use client"
import { Slide, ToastContainer } from 'react-toastify';
import ProductImageSection from './ProductImageSection';
import ProductDetailSection from './ProductDetailSection';

function Product({ product, model, locale, currency, addToCart, company, modelHeading, modelsHeading, productDetail, toastText }) {
    return (
        <div className='grid grid-cols-1 md:grid-cols-5 gap-2 mt-8'>
            <ProductImageSection images={product.images} alt={product.overview} locale={locale} />
            <ProductDetailSection product={product} model={model} locale={locale} currency={currency} addToCartText={addToCart} company={company}
                modelHeading={modelHeading} modelsHeading={modelsHeading} productDetail={productDetail} toastText={toastText} />
            <ToastContainer transition={Slide} autoClose={3000} position="top-right" hideProgressBar
                toastStyle={{ transition: "all 0.5s ease-in-out", }} />
        </div>
    )
}

export default Product