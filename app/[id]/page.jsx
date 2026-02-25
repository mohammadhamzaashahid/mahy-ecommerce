// import Breadcrumb from '@/components/UI/Breadcrumb';
import MoreProducts from '@/components/UI/shop/MoreProducts';
import Product from '@/components/UI/shop/Product';
import ProductAbout from '@/components/UI/shop/ProductAbout';
import ProductInfo from '@/components/UI/shop/ProductInfo';
import Specs from '@/components/UI/shop/Specs';
import { getNewProduct, getNewProducts, getPaginatedRandomProducts, getProduct, getProducts, newProducts } from '@/constants/products';
// import { getLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

async function ProductPage({ params, searchParams }) {
    const { id } = await params;
    const { model } = await searchParams;

    // const t = await getTranslations('ShopPage');
    // const product = await getProduct(id);
    const product = getNewProduct(id);
    if (!product) notFound();

    // const moreProducts = await getProducts();
    const { items } = await getPaginatedRandomProducts(1);

    // const locale = await getLocale();

    // const productDetail = { text: t("Text"), text1: t("Text1"), text2: t("Text2"), text3: t("Text3") };
    // const tabs = ["Technical", "Specs"];

    return (
        <main className='max-w-350 mx-auto pt-15 pb-15'>
            {/* <div className='px-5'>
                <Breadcrumb segments={[{ label: t("Page"), href: "/shop" }, { label: product.category }]} locale={locale} maxWidth={false} />
            </div> */}
            <Product product={product} model={model} locale={"en"} currency="AED" addToCart="Add to Cart" company="MAHY Khoory"
                modelHeading="Model" modelsHeading="Models" toastText="Product added to cart." />
            <div className='px-5'>
                <ProductInfo technical={product.technical} description={product.description} />
                {/* <ProductAbout about={product.about} description={product.description} /> */}
                {/* <Specs tabs={tabs} technical={product.technical} specs={product.specs} /> */}
                <MoreProducts
                    products={items}
                    modelHeading="Model"
                    modelsHeading="Models"
                    currency="AED"
                    buy="Buy"
                    locale={"en"}
                    addToCartText="Add to Cart"
                    toastText="Product added to cart."
                />
            </div>
        </main>
    )
}

export default ProductPage
