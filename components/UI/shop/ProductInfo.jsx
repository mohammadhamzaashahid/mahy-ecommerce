function ProductInfo({ technical, description, bullets, features }) {
    return (
        <section className="border-t border-gray-300 pt-7 md:pt-8 mt-8 md:mt-10">
            <h2 className="text-xl md:text-2xl font-semibold text-center md:text-start">Product information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mt-5 md:mt-4">
                <div>
                    <h3 className="md:text-lg font-semibold">Technical Details</h3>
                    <div className="mt-2 md:mt-3 border-t border-gray-300 text-sm">
                        {technical.map((item, i) => (
                            <div key={i} className="flex justify-between py-2.5 border-b border-gray-200">
                                <span className="text-gray-700 font-medium w-1/2">{item.title}</span>
                                <span className="text-gray-700 w-1/2">{item.text}</span>
                            </div>
                        ))
                        }
                    </div>
                </div>
                <div>
                    <h3 className="md:text-lg font-semibold border-b pb-2.5 border-gray-300">Description</h3>
                    {description &&
                        <div className="mt-2 md:mt-3 text-sm text-gray-700 text-justify">
                            {description}
                        </div>
                    }
                    {bullets && (
                        <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-gray-700">
                            {bullets.map((bullet, i) => (
                                <li key={i}>{bullet}</li>
                            ))}
                        </ul>
                    )}
                    {features && (
                        <div className="mt-2  space-y-2">
                            {features.map((feature, i) => (
                                <div key={i} className="text-sm text-gray-700">
                                    <h3 className="font-semibold">{feature.title}</h3>
                                    <p className="mt-0.5">{feature.text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default ProductInfo