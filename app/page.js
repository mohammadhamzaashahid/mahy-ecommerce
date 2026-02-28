// import Breadcrumb from "@/components/UI/Breadcrumb";

import FiltersSection from "@/components/UI/shop/FiltersSection";
import HorizontalFilters from "@/components/UI/shop/HorizontalFilters";
import Pagination from "@/components/UI/shop/Pagination";
import ProductCard from "@/components/UI/shop/ProductCard";
import StoreProductsInCookies from "@/components/UI/shop/StoreProductsInCookies";
import TopFilter from "@/components/UI/shop/TopFilter";
import { getNewProducts } from "@/constants/products";
// import { getLocale, getTranslations } from "next-intl/server";
import React from "react";
import { Slide, ToastContainer } from "react-toastify";

async function Shop({ searchParams }) {
  const params = await searchParams;
  // const locale = await getLocale();
  const {
    search = "",
    brand,
    category,
    price_min,
    price_max,
    page = 1,
  } = params;

  // const t = await getTranslations("ShopPage");

  const topFilters = [
    { key: "ariston", label: "Ariston", text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam nesciunt ab", image: "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338670/Picture1_ld0xap.png" },
    { key: "crane", label: "Crane", text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam nesciunt ab", image: "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769418510/valve_converted_xgfz0v.png" },
    { key: "dewalt", label: "Dewalt Tools", text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam nesciunt ab", image: "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421634/61oaKFTEUJL._AC_SL1200__awsn9m.png" },
    { key: "franklin", label: "Franklin Motors", text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam nesciunt ab", image: "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422322/Picture1_uvoma3.png" },
    { key: "globalWater", label: "Global Water Solutions", text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam nesciunt ab", image: "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422636/Picture1_yiezev.png" },
    { key: "grundfos", label: "Grundfos Pumps", text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam nesciunt ab", image: "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423150/Picture1_eivc8u.png" },
  ];

  const { items, cookieKey, stored, total, totalPages } = await getNewProducts(brand, Number(page), category, Number(price_min), Number(price_max), search);

  return (
    <div className="pb-14 pt-16 max-w-350 mx-auto px-4">
      {/* <Breadcrumb segments={[{ label: t("Page"), href: "/shop" }]} locale={locale} maxWidth={false} /> */}
      <TopFilter items={topFilters} locale={"en"} topFilter={brand} />
      <HorizontalFilters items={topFilters} topFilter={brand} />
      <div id="list" className="flex flex-col md:flex-row min-h-screen relative mt-4">
        {/* <Filters filters={filters} search={search} /> */}
        <FiltersSection brands={topFilters} search={search} />
        <div className="flex-1 overflow-y-auto">
          <div className="text-sm font-medium text-gray-700">Showing {items.length.toLocaleString()} out of {total} Results </div>
          {/* No Products */}
          {items.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <p className="text-lg">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                {items.map((item, i) => (
                  <div key={i}>
                    <ProductCard
                      id={item.partNumber}
                      title={item.overview}
                      models={item.models}
                      price={item.standardPrice}
                      specs={item.specs}
                      image={item.images[0]}
                      href={`/${item.partNumber}`}
                      modelHeading="Model"
                      modelsHeading="Models"
                      currency="AED"
                      buy="Buy"
                      addToCartText="Add to cart"
                      toastText="Product added to cart."
                    />
                  </div>
                ))}
              </div>
              <Pagination currentPage={Number(page)} totalPages={totalPages} />
            </>
          )}
        </div>
      </div>
      <ToastContainer transition={Slide} autoClose={3000} position="top-right" hideProgressBar
        toastStyle={{ transition: "all 0.5s ease-in-out", }} />
      <StoreProductsInCookies cookieKey={cookieKey} stored={stored} />
    </div>
  );
}

export default Shop;
