import React from 'react'

function ProductAbout({ about, description }) {
    return (
        <div className='md:pt-10 px-5'>
            <h2 className='font-semibold text-gray-700 mt-8 md:text-lg border-b pb-1.5 md:pb-2'>About</h2>
            <ul className='list-disc list-inside space-y-1 text-gray-700 font-light tracking-tight mt-3 md:mt-4 text-sm md:text-base'>
                {about.map((item, i) => (
                    <li key={i} className='text-justify'>{item}</li>
                ))}
            </ul>
            <h2 className='font-semibold text-gray-700 mt-8 md:text-lg border-b pb-1.5 md:pb-2'>Description</h2>
            <p className='text-gray-700 font-light tracking-tight text-justify mt-3 md:mt-4 text-sm md:text-base'>{description}</p>
        </div>
    )
}

export default ProductAbout