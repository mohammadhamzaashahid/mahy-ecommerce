import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react";

function ProductImageSection({ images, alt, locale }) {
    const [imageIndex, setImageIndex] = useState(0);

    const handlePrev = () => { setImageIndex(imageIndex === 0 ? images.length - 1 : imageIndex - 1); };
    const handleNext = () => { setImageIndex(imageIndex === images.length - 1 ? 0 : imageIndex + 1); };

    const isMultiple = images.length > 1;

    return (
        <div className="md:col-span-2 md:sticky top-16 self-start">
            <div className="flex flex-col md:flex-row-reverse gap-6 md:gap-2 justify-between">
                <div className="relative h-90 lg:h-120 md:w-7/8 overflow-hidden rounded-xl bg-white">
                    <Image
                        key={imageIndex}
                        src={images[imageIndex]}
                        alt={alt}
                        fill
                        className="object-contain transition-all duration-300 ease-out translate-x-4 animate-slideFade"
                    />
                    {isMultiple && (
                        <div className="absolute inset-0 flex items-center justify-between px-1 pt-2 opacity-60 transition-all duration-300 hover:opacity-100">
                            <button onClick={handlePrev} className="rounded-full bg-gray-50 p-2 shadow-lg">
                                {locale === "ar"
                                    ? (
                                        <ChevronRight size={18} />
                                    ) : (
                                        <ChevronLeft size={18} />)
                                }
                            </button>
                            <button onClick={handleNext} className="rounded-full bg-gray-50 p-2 shadow-lg">
                                {locale === "ar"
                                    ? (
                                        <ChevronLeft size={18} />
                                    ) : (
                                        <ChevronRight size={18} />)
                                }
                            </button>
                        </div>
                    )}
                </div>
                {isMultiple && (
                    <div className="mt-6 flex-wrap gap-3 flex md:flex-col px-5 lg:px-0">
                        {images.map((image, i) => (
                            <button className={`flex-none p- rounded-lg bg-white object-cover overflow-hidden ${imageIndex === i ? "outline-2 outline-gray-700" : "opacity-70 outline outline-gray-600"}`}
                                key={i} onClick={() => setImageIndex(i)}>
                                <div className="relative size-10">
                                    <Image src={image} alt={alt} fill style={{ objectFit: "contain" }} />
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductImageSection