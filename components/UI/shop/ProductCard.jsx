"use client";
import { useCart } from "@/components/Providers/CartProvider";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

export default function ProductCard({
  id,
  title,
  image,
  specs,
  models,
  price,
  href,
  modelHeading,
  modelsHeading,
  currency,
  buy,
  addToCartText = "Add to Cart",
  toastText = "Item added to cart!",
}) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(
      {
        productId: id,
        name: title,
        price: Number(price) || 0,
        image,
        currency,
      },
      1
    );
    toast.success(toastText);
  };

  return (
    <div className="relative rounded-2xl border border-gray-200 duration-500 transition-all h-full bg-gray-50 overflow-hidden flex flex-col">
      <Link href={`${href}`}>
        <div className="bg-white py-6 px-4">
          <div className="relative h-50 w-full flex items-center justify-center">
            <Image
              src={image}
              alt={title}
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>
      </Link>
      <div className="bg-gray-50  pb-5 flex flex-col justify-between flex-1">
        <Link href={`${href}`} className="px-3 pt-3">
          <div>
            <h3 className="font-medium text-gray-700">{title}</h3>

            {/* Rating */}
            <div className="flex gap-2 mt-3">
              <span className="text-sm">4.1</span>
              <div className="flex gap-0.5 pt-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill={i < 4 ? "orange" : "white"} stroke="orange" />
                ))}
              </div>
              <span className="text-xs text-gray-600">(41)</span>
            </div>

            {/* Price */}
          <div className="flex gap-0.5 mt-3">
              <span className="text-gray-700 font-medium text-xs">{currency}</span>
              <p className="font-medium text-3xl">{price}</p>
            </div>

            {/* Specs */}
            <div className="flex flex-wrap gap-2 mt-3">
              {specs.slice(0, 3).map((spec, i) => (
                <div
                  key={i}
                  className="px-3 py-2 bg-white rounded-xl border border-gray-100"
                >
                  <h4 className="text-xs font-semibold text-gray-700 mb-1">
                    {spec.title}
                  </h4>
                  <p className="text-xs text-gray-500">{spec.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Link>

        <div className="px-3">
          {/* Stock */}
          <p className="text-red-500 mt-3 text-sm">8 left in stock</p>
          <button
            onClick={handleAddToCart}
            className="py-2 w-full b-base text-white text-center rounded-2xl mt-4 text-sm"
          >
            {addToCartText || buy || "Add to Cart"}
          </button>
        </div>
      </div>
    </div >
  );
}

{/* {models && (
      <>
        <p className="mt-4 text-sm text-gray-500 font-medium uppercase">{models.length > 1 ? modelsHeading : modelHeading}</p>
        <div className="flex gap-1 flex-wrap mt-2">
          {models.map((model, i) => (
            <button onClick={() => setSelectedModel(i)} key={i} className={`py-1 px-3 text-sm rounded-2xl border-base ${i === selectedModel ? "b-base text-white" : "t-base"}`}>{model}</button>
          ))}
        </div>
      </>
    )} */}
