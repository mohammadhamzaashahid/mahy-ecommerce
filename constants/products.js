// import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";

const productsPerPage = 16;

export const getNewProducts = async (brand, page, category, price_min, price_max, search) => {
    if (brand === "ariston")
        return getPaginatedProducts(aristonProducts, page, category, price_min, price_max, search)
    else if (brand === "crane")
        return getPaginatedProducts(craneProducts, page, category, price_min, price_max, search)
    else if (brand === "dewalt")
        return getPaginatedProducts(dewaltProducts, page, category, price_min, price_max, search)
    else if (brand === "franklin")
        return getPaginatedProducts(franklinMotors, page, category, price_min, price_max, search)
    else if (brand === "globalWater")
        return getPaginatedProducts(globalWaterProducts, page, category, price_min, price_max, search)
    else if (brand === "grundfos")
        return getPaginatedProducts(grundfosProducts, page, category, price_min, price_max, search)
    else {
        return await getPaginatedRandomProducts(page, category, price_min, price_max, search);
    }
};

export const getNewProduct = (id) => {
    for (const products of productsSources) {
        const found = products.find(p => p.partNumber === id);
        if (found) return found;
    }
    return null;
};

export const getProductsWithQuantity = (items = []) => {
    if (!Array.isArray(items) || items.length === 0) return [];

    const allProducts = productsSources.flat();

    return items
        .map(({ productId, quantity }) => {
            const product = allProducts.find(p => p.partNumber === productId);
            if (!product) return null;

            return {
                productId,
                name: product.overview,
                price: parseFloat(product.standardPrice),
                image: product.images[0],
                quantity,
            };
        })
        .filter(Boolean);
};

const getPaginatedProducts = (products, page, category, price_min, price_max, search) => {
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;

    if (search && search.trim() !== "") {
        const searchLower = search.toLowerCase();
        products = products.filter(
            (item) => item.overview && item.overview.toLowerCase().includes(searchLower)
        );
    }

    if (category) {
        products = products.filter(
            (item) => item.categoryFilter === category
        );
    }

    if (price_min) {
        products = products.filter(
            (item) => parseFloat(item.standardPrice) >= price_min
        );
    }

    if (price_max) {
        products = products.filter(
            (item) => parseFloat(item.standardPrice) <= price_max
        );
    }

    return {
        items: products.slice(startIndex, endIndex),
        total: products.length,
        totalPages: Math.ceil(products.length / productsPerPage),
        cookieKey: null,
        stored: null
    };
};

export const getPaginatedRandomProducts = async (page, category, price_min, price_max, search) => {
    const cookieStore = await cookies();
    const cookieKey = "randomProductsByPage";

    const storedCookie = cookieStore.get(cookieKey)?.value;
    const stored = storedCookie ? JSON.parse(storedCookie) : {};

    const pageKey = `page_${page}`;
    let allProducts = productsSources.flat();
    const total = allProducts.length;
    const totalPages = Math.ceil(total / productsPerPage);

    if (search && search.trim() !== "") {
        const searchLower = search.toLowerCase();
        allProducts = allProducts.filter(
            (item) => item.overview && item.overview.toLowerCase().includes(searchLower)
        );
    }

    if (category) {
        allProducts = allProducts.filter(
            (item) => item.categoryFilter === category
        );
        return {
            items: allProducts.slice((page - 1) * productsPerPage, page * productsPerPage),
            total: allProducts.length,
            totalPages: Math.ceil(allProducts.length / productsPerPage),
            cookieKey: null,
            stored: null,
        };
    };

    // 1️⃣ If this page already has products, return them immediately
    if (Array.isArray(stored[pageKey]) && stored[pageKey].length > 0) {
        const cachedPartNumbers = stored[pageKey];
        return {
            items: allProducts.filter(p => cachedPartNumbers.includes(p.partNumber)),
            totalPages,
            total,
            cookieKey,
            stored,
        };
    }

    // 2️⃣ Collect used partNumbers from other pages only
    const usedPartNumbers = Object.entries(stored)
        .filter(([key]) => key !== pageKey)
        .flatMap(([_, partNumbers]) => partNumbers);

    // 3️⃣ Filter remaining products
    const available = allProducts.filter(
        p => !usedPartNumbers.includes(p.partNumber)
    );

    // 4️⃣ Pick random products
    const selectedObjects = available
        .sort(() => Math.random() - 0.5)
        .slice(0, productsPerPage);

    // 5️⃣ Store only partNumbers in cookie object
    stored[pageKey] = selectedObjects.map(p => p.partNumber);

    return {
        items: selectedObjects,
        totalPages,
        total,
        cookieKey,
        stored,
    };
};

const aristonProducts = [
    {
        categoryFilter: "water-heater",
        category: "Ariston Electric Water Heater",
        partNumber: "3100631",
        stockAllocated: 0,
        overview: "ARISTON  ANDRIS 10/3  ELECTRIC WATER HEATER",
        standardPrice: "270",
        amazonPrice: "290",
        weight: "7.7",
        freightCharges: "35.4",
        sellingPriceWithFreight: "325.4",
        newAmazonSellingPrice: "341.67",
        brand: "ARISTON",
        amazonLink: "https://amzn.eu/d/jdrXLWR",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338670/Picture1_ld0xap.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338671/Picture2_xhzujf.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338671/Picture3_lywzoa.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338672/Picture4_x0eq8m.png"
        ],
        about: [
            "Water heater designed and manufactured to be installed in UK",
            "Economy' setting on the dial to optimise comfort and energy saving",
            "Titanium enamelled tank for durability: This premium quality water heater the best tank protection with the properties of titanium, which constitutes a perfect shield against corrosion. Every single component is developed to ensure longlasting high performance with the guarantee of Ariston Brand",
            "Maximum Comfort: Andris series products are able to keep the water hot for a long time thanks to the thick high-density polyurethane insulation placed in the tank and the outside of the water heater. It provides an effective barrier against heat losses, optimizing both the performance of the product and the user's comfort. The models of the Andris series are equipped with an immersion thermostat, which allows a very precise adjustment of the water temperature, heating it to the desired point",
            "Installation kits to be purchased separately"
        ],
        description: "The Andris R is an unvented electric storage water heater and part of Ariston's market-leading Andris range. This easy to install entry model offers impressive hot water performance and fast reheat times. Safety, durability, and design are what the Andris Lux range stands for, making it perfect for comfort in a myriad of domestic and light commercial applications. Its compact, light-weight body and front panel are the finest composition of Italian design, studied to compliment any environment. The front panel takes centre-stage with the Ariston wave, equipped with a mechanical dial for simple usability, and an Ariston red heating lamp. The Andris R is available in 10 and 15 litre versions and unvented installation kits are available separately. While boasting an elegant design by Italian designer Umberto Palermo, this compact water heating unit, also promises extra durability through a copper heating element, ensures optimum water efficiency through the Flexomix technology, and total safety guaranteed by all ARISTON products all over the world. Please note that this product specifically complies with regulations on the UK market and is KIWA certified.",
        specs: [
            { title: "Brand", text: "Ariston" },
            { title: "Capacity", text: "10 Liters" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Product dimensions", text: "29.8W x 38.5H centimeters" },
            { title: "Special features", text: "Fast Heating" }
        ],
        technical: [
            { title: "Manufacturer", text: "Ariston" },
            { title: "Part number", text: "3100631" },
            { title: "Item Weight", text: "6.7 Kilograms" },
            { title: "Product Dimensions", text: "36 x 29.8 x 38.5 cm; 6.7 kg" },
            { title: "Item model number", text: "3100631" },
            { title: "Size", text: "10 Litre" },
            { title: "Color", text: "White" },
            { title: "Style", text: "2kW" },
            { title: "Material", text: "Polyurethane" },
            { title: "Pattern", text: "Single" },
            { title: "Power source type", text: "Corded Electric" },
            { title: "Wattage", text: "2 KW" },
            { title: "Item Package Quantity", text: "1" },
            { title: "Plug Profile", text: "Wall" },
            { title: "Special Features", text: "Fast Heating" },
            { title: "Included components", text: "Pressure relief valve, dielectric junctions, wall bracket, installation manual, warranty certificate" },
            { title: "Batteries Required", text: "No" }
        ]
    },
    {
        categoryFilter: "water-heater",
        category: "Ariston Electric Water Heater",
        partNumber: "3100633",
        stockAllocated: 10,
        overview: "ARISTON ANDRIS RS 15/3, 15LTR",
        standardPrice: "300",
        amazonPrice: "320",
        weight: "8.6",
        freightCharges: "37.2",
        sellingPriceWithFreight: "357.2",
        newAmazonSellingPrice: "375.06",
        brand: "ARISTON",
        amazonLink: "https://amzn.eu/d/cnQp7v5",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338685/Picture5_wrxps7.png"
        ],
        about: [
            "Temperature Regulation",
            "Copper Heating Element",
            "Indicator Lights"
        ],
        description: "Compact in terms of design, it scores high on the aspect of utility too. This is what makes it worth the buy.",
        specs: [
            { title: "Brand", text: "Ariston" },
            { title: "Capacity", text: "15 Liters" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Product dimensions", text: "15W x 8H centimetres" },
            { title: "Special features", text: "High Water Pressure Protection, LED Display, Low Water Flow Protection, Overheat Protection" }
        ],
        bullets: [
            "Date First Available: 28 January 2019",
            "ASIN: B07QCK22JW"
        ],
        technical: [
            { title: "Manufacturer", text: "Ariston" },
            { title: "Part number", text: "Andris RS 15 EG" },
            { title: "Item Weight", text: "7 Kilograms" },
            { title: "Product Dimensions", text: "44 x 44 x 16 cm; 7 kg" },
            { title: "Item model number", text: "Andris RS 15 EG" },
            { title: "Color", text: "Grey" },
            { title: "Style", text: "Indoor Installation" },
            { title: "Material", text: "Combination" },
            { title: "Power source type", text: "Corded Electric" },
            { title: "Voltage", text: "220 Volts" },
            { title: "Wattage", text: "1200 watts" },
            { title: "Item Package Quantity", text: "1" },
            { title: "Maximum Pressure", text: "8 Bars" },
            { title: "Plug Profile", text: "Wall" },
            { title: "Special Features", text: "High Water Pressure Protection, LED Display, Low Water Flow Protection, Overheat Protection" },
            { title: "Included components", text: "Heater" },
            { title: "Batteries Required", text: "No" }
        ]
    },
    {
        categoryFilter: "water-heater",
        category: "Ariston Electric Water Heater",
        partNumber: "3100635",
        stockAllocated: 7,
        overview: "ARISTON ANDRIS RS30/3, 30LTR",
        standardPrice: "335",
        amazonPrice: "360",
        weight: "12.6",
        freightCharges: "45.2",
        sellingPriceWithFreight: "405.2",
        newAmazonSellingPrice: "425.46",
        brand: "ARISTON",
        amazonLink: "https://amzn.eu/d/8WWNR4T",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338684/Picture7_aizaop.png"
        ],
        about: [
            "Brand: Ariston",
            "Quantity - 30 Liter",
            "Seamless functionality",
            "Hygienic packaging"
        ],
        description: "Temperature regulation. Glass lined inner tank tested at 16 bars. Oversized magnesium anode. Pressure safety valve tested at 8 bar. Copper heating element.",
        specs: [
            { title: "Brand", text: "Ariston" },
            { title: "Capacity", text: "30 Liters" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Product dimensions", text: "44.7W x 16H centimeters" },
            { title: "Colour", text: "multi" }
        ],
        technical: [
            { title: "Brand", text: "Ariston" },
            { title: "Model Number", text: "3100896" },
            { title: "Color", text: "multi" },
            { title: "Product Dimensions", text: "9 x 9 x 9 cm; 12 kg" },
            { title: "Capacity", text: "30 Liters" },
            { title: "Power / Wattage", text: "30 watts" },
            { title: "Material", text: "Copper" },
            { title: "Item Weight", text: "12 Kilograms" }
        ]
    },
    {
        categoryFilter: "water-heater",
        category: "Ariston Electric Water Heater",
        partNumber: "3100805",
        stockAllocated: 0,
        overview: "ARISTON ANDRIS 10/3 ELECTRIC WATER HEATER",
        standardPrice: "310",
        amazonPrice: "--",
        weight: "7.7",
        freightCharges: "30",
        sellingPriceWithFreight: "265.82",
        newAmazonSellingPrice: "400.00",
        brand: "ARISTON",
        amazonLink: "https://amzn.eu/d/cvOkqa5",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338682/Picture9_rqsycd.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338684/Picture10_g5y1ql.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338683/Picture11_sgjfnz.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338681/Picture12_rbac1p.png"
        ],
        about: [
            "Water heater designed and manufactured to be installed in UK",
            "Economy' setting on the dial to optimise comfort and energy saving",
            "Titanium enamelled tank for durability: This premium quality water heater the best tank protection with the properties of titanium, which constitutes a perfect shield against corrosion. Every single component is developed to ensure longlasting high performance with the guarantee of Ariston Brand",
            "Maximum Comfort: Andris series products are able to keep the water hot for a long time thanks to the thick high-density polyurethane insulation placed in the tank and the outside of the water heater. It provides an effective barrier against heat losses, optimizing both the performance of the product and the users' comfort. The models of the Andris series are equipped with an immersion thermostat, which allows a very precise adjustment of the water temperature, heating it to the desired point",
            "Installation kits to be purchased separately"
        ],
        description: "The Andris R is an unvented electric storage water heater and part of Ariston's market-leading Andris range. This easy to install entry model offers impressive hot water performance and fast reheat times. Safety, durability, and design are what the Andris Lux range stands for, making it perfect for comfort in a myriad of domestic and light commercial applications. Its compact, light-weight body and front panel are the finest composition of Italian design, studied to compliment any environment. The front panel takes centre-stage with the Ariston wave, equipped with a mechanical dial for simple usability, and an Ariston red heating lamp. The Andris R is available in 10 and 15 litre versions and unvented installation kits are available separately. While boasting an elegant design by Italian designer Umberto Palermo, this compact water heating unit also promises extra durability through a copper heating element, ensures optimum water efficiency through the Flexomix technology, and total safety guaranteed by all ARISTON products all over the world. Please note that this product specifically complies with regulations on the UK market and is KIWA certified.",
        specs: [
            { title: "Brand", text: "Ariston" },
            { title: "Capacity", text: "10 Liters" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Product dimensions", text: "29.8W x 38.5H centimeters" },
            { title: "Special features", text: "Fast Heating" }
        ],
        technical: [
            { title: "Manufacturer", text: "Ariston" },
            { title: "Part number", text: "3100863" },
            { title: "Item Weight", text: "6.7 Kilograms" },
            { title: "Product Dimensions", text: "36 x 29.8 x 38.5 cm; 6.7 kg" },
            { title: "Item model number", text: "3100863" },
            { title: "Size", text: "10 Litre" },
            { title: "Color", text: "White" },
            { title: "Style", text: "2kW" },
            { title: "Material", text: "Polyurethane" },
            { title: "Pattern", text: "Single" },
            { title: "Power source type", text: "Corded Electric" },
            { title: "Wattage", text: "2 KW" },
            { title: "Item Package Quantity", text: "1" },
            { title: "Plug Profile", text: "Wall" },
            { title: "Special Features", text: "Fast Heating" },
            { title: "Included components", text: "Pressure relief valve, dielectric junctions, wall bracket, installation manual, warranty certificate" },
            { title: "Batteries Required", text: "No" }
        ]
    },
    {
        categoryFilter: "water-heater",
        category: "Ariston Electric Water Heater",
        partNumber: "3100807",
        stockAllocated: 0,
        overview: "ARISTON ANDRIS RS 15/3, 15LTR",
        standardPrice: "310",
        amazonPrice: "nil",
        weight: "8.6",
        freightCharges: "35",
        sellingPriceWithFreight: "295.05",
        newAmazonSellingPrice: "430.00",
        brand: "ARISTON",
        amazonLink: "https://amzn.eu/d/5u51Md4",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338672/Picture13_ypqso7.png"
        ],
        about: [
            "Temperature Regulation",
            "Copper Heating Element",
            "Indicator Lights"
        ],
        description: "Compact in terms of design, it scores high on the aspect of utility too. This is what makes it worth the buy.",
        bullets: [
            "Date First Available: 28 January 2019",
            "ASIN: B07QCK22JW"
        ],
        specs: [
            { title: "Brand", text: "Ariston" },
            { title: "Capacity", text: "15 Liters" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Product dimensions", text: "15W x 8H centimetres" },
            { title: "Special features", text: "High Water Pressure Protection, LED Display, Low Water Flow Protection, Overheat Protection" }
        ],
        technical: [
            { title: "Manufacturer", text: "Ariston" },
            { title: "Part number", text: "Andris RS 15 EG" },
            { title: "Item Weight", text: "7 Kilograms" },
            { title: "Product Dimensions", text: "44 x 44 x 16 cm; 7 kg" },
            { title: "Item model number", text: "Andris RS 15 EG" },
            { title: "Color", text: "Grey" },
            { title: "Style", text: "Indoor Installation" },
            { title: "Material", text: "Combination" },
            { title: "Power source type", text: "Corded Electric" },
            { title: "Voltage", text: "220 Volts" },
            { title: "Wattage", text: "1200 watts" },
            { title: "Item Package Quantity", text: "1" },
            { title: "Maximum Pressure", text: "8 Bars" },
            { title: "Plug Profile", text: "Wall" },
            { title: "Special Features", text: "High Water Pressure Protection, LED Display, Low Water Flow Protection, Overheat Protection" },
            { title: "Included components", text: "Heater" },
            { title: "Batteries Required", text: "No" }
        ]
    },
    {
        categoryFilter: "water-heater",
        category: "Ariston Electric Water Heater",
        partNumber: "3100809",
        stockAllocated: 0,
        overview: "ARISTON ANDRIS RS30/3, 30LTR",
        standardPrice: "360",
        amazonPrice: "nil",
        weight: "12.6",
        freightCharges: "40",
        sellingPriceWithFreight: "314.76",
        newAmazonSellingPrice: "440.00",
        brand: "ARISTON",
        amazonLink: "https://amzn.eu/d/7k4kKWG",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338671/Picture13_1_lqvp3z.png"
        ],
        about: [
            "Brand: Ariston",
            "Quantity - 30 Liter",
            "Seamless functionality",
            "Hygienic packaging"
        ],
        description: "Temperature regulation. Glass lined inner tank tested at 16 bars. Oversized magnesium anode. Pressure safety valve tested at 8 bar. Copper heating element.",
        specs: [
            { title: "Brand", text: "Ariston" },
            { title: "Capacity", text: "30 Liters" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Product dimensions", text: "44.7W x 16H centimeters" },
            { title: "Colour", text: "multi" }
        ],
        technical: [
            { title: "Brand", text: "Ariston" },
            { title: "Model Number", text: "3100896" },
            { title: "Color", text: "multi" },
            { title: "Product Dimensions", text: "9 x 9 x 9 cm; 12 kg" },
            { title: "Capacity", text: "30 Liters" },
            { title: "Power / Wattage", text: "30 watts" },
            { title: "Material", text: "Copper" },
            { title: "Item Weight", text: "12 Kilograms" }
        ]
    },
    {
        categoryFilter: "water-heater",
        category: "Ariston Electric Water Heater",
        partNumber: "3201977",
        stockAllocated: 0,
        overview: "ARISTON PRO 1 R 50LTR V ELECTRIC WATER HEATER",
        standardPrice: "420",
        amazonPrice: "--",
        weight: "17.5",
        freightCharges: "50",
        sellingPriceWithFreight: "388.038",
        newAmazonSellingPrice: "540.00",
        brand: "ARISTON",
        amazonLink: "https://amzn.eu/d/3ELJFl9",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338680/Picture17_s6o61f.png"
        ],
        about: [
            "Electric Water Heater"
        ],
        bullets: [
            "Is Discontinued By Manufacturer: No",
            "Date First Available : 9 August 2025",
            "ASIN: B07MJ8BQD7"
        ],
        specs: [
            { title: "Brand", text: "Ariston" },
            { title: "Capacity", text: "50 Liters" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Product dimensions", text: "45W x 54.3H centimetres" },
            { title: "Colour", text: "White" }
        ],
        technical: [
            { title: "Manufacturer", text: "ARISTON SPA" },
            { title: "Part number", text: "3201917" },
            { title: "Item Weight", text: "18 Kilograms" },
            { title: "Product Dimensions", text: "45 x 45 x 54.3 cm; 18 kg" },
            { title: "Item model number", text: "3201917" },
            { title: "Color", text: "White" },
            { title: "Style", text: "Interior furnishings" },
            { title: "Material", text: "Metal" },
            { title: "Shape", text: "Cylindrical" },
            { title: "Power source type", text: "Corded Electric" },
            { title: "Voltage", text: "230 Volts" },
            { title: "Wattage", text: "1.2 KW" },
            { title: "Item Package Quantity", text: "1" },
            { title: "Maximum Pressure", text: "8 Bars" },
            { title: "Plug Profile", text: "Wall" },
            { title: "Included components", text: "Dielectric connectors not included" },
            { title: "Batteries Included?", text: "No" },
            { title: "Batteries Required?", text: "No" }
        ]
    },
    {
        categoryFilter: "water-heater",
        category: "Ariston Electric Water Heater",
        partNumber: "3201978",
        stockAllocated: 0,
        overview: "ARISTON PRO 1 R 80LTR V ELECTRIC WATER HEATER",
        standardPrice: "470",
        amazonPrice: "--",
        weight: "22.5",
        freightCharges: "60",
        sellingPriceWithFreight: "432.05",
        newAmazonSellingPrice: "550.00",
        brand: "ARISTON",
        amazonLink: "",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338679/Picture18_f51ndh.png"
        ],
        about: [
            "Item Category: Water Heater",
            "Item Trademark: Ariston",
            "Manufacturer: Ariston"
        ],
        bullets: [
            "WaterPlus Technology: up to 16% more hot water available.",
            "Compliant with top regulations",
            "External Temperature Setting",
            "Double Safety Thermostat",
            "Robust Insulation Material (Polyurethane)",
            "Magnesium anode to fight corrosion",
            "High Quality titanium enameled tank",
            "7 Years Tank Warranty",
            "Designed in Italy",
            "Modern shape with 'Ariston Wave'."
        ],
        specs: [
            { title: "Brand", text: "Ariston" },
            { title: "Capacity", text: "80 Liters" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Special features", text: "Improved Efficiency (16% more hot water)" },
            { title: "Colour", text: "White" }
        ],
        technical: [
            { title: "Manufacturer", text: "Ariston" },
            { title: "Color", text: "White" },
            { title: "Style", text: "Indoor Installation" },
            { title: "Material", text: "Titanium" },
            { title: "Power source type", text: "Corded Electric" },
            { title: "Wattage", text: "80 watts" },
            { title: "Maximum Pressure", text: "8 Bars" },
            { title: "Plug Profile", text: "Wall" },
            { title: "Special Features", text: "Improved Efficiency (16% more hot water)" }
        ]
    },
    {
        categoryFilter: "water-heater",
        category: "Ariston Electric Water Heater",
        partNumber: "3201980",
        stockAllocated: 9,
        overview: "ARISTON PRO 1 R 50LTR H ELECTRIC WATER HEATER",
        standardPrice: "350",
        amazonPrice: "375",
        weight: "17.5",
        freightCharges: "55",
        sellingPriceWithFreight: "430",
        newAmazonSellingPrice: "451.5",
        brand: "ARISTON",
        amazonLink: "https://amzn.eu/d/6L6f1Rd",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338692/Picture19_ngavto.png"
        ],
        about: [
            "Ariston Pro1 R is wall hung water heater",
            "Titan Shield technology ensures high durability of the heater",
            "Oversized magnesium anode creates additional active anti-corrosion protection and enhances reliability",
            "High-thickness polyurethane thermal insulation isolation minimizes the thermal loss and limits the electric energy use"
        ],
        description: "Ariston Vertical Water Heater PRO1 R,50L",
        bullets: [
            "Date First Available: 18 May 2019",
            "ASIN: B07S3R2B3X"
        ],
        specs: [
            { title: "Brand", text: "Ariston" },
            { title: "Capacity", text: "50 Liters" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Product dimensions", text: "55W x 80H centimetres" },
            { title: "Colour", text: "White" }
        ],
        technical: [
            { title: "Manufacturer", text: "Italy" },
            { title: "Part number", text: "A-PRO/R-50L" },
            { title: "Item Weight", text: "28.1 Kilograms" },
            { title: "Product Dimensions", text: "55 x 55 x 80 cm; 28.12 kg" },
            { title: "Item model number", text: "A-PRO/R-50L" },
            { title: "Color", text: "White" },
            { title: "Style", text: "Indoor Installation" },
            { title: "Material", text: "Titanium" },
            { title: "Power source type", text: "Corded Electric" },
            { title: "Voltage", text: "220 Volts" },
            { title: "Wattage", text: "1200 watts" },
            { title: "Item Package Quantity", text: "1" },
            { title: "Flow Rate", text: "50 Liters Per Minute" },
            { title: "Plug Profile", text: "Wall" },
            { title: "Included components", text: "SAFETY VALVE" },
            { title: "Batteries Required", text: "No" }
        ]
    },
    {
        categoryFilter: "water-heater",
        category: "Ariston Electric Water Heater",
        partNumber: "3201981",
        stockAllocated: 9,
        overview: "Ariston PRO1 Horizontal Water Heater (80L)",
        standardPrice: "400",
        amazonPrice: "430",
        weight: "22.5",
        freightCharges: "65",
        sellingPriceWithFreight: "495",
        newAmazonSellingPrice: "519.75",
        brand: "ARISTON",
        amazonLink: "https://amzn.eu/d/3VExoxZ",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338690/Picture20_k90h0p.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338689/Picture21_ao2hkb.png"
        ],
        about: [
            "Brand: Ariston",
            "Capacity: 80 liter",
            "This product will be an excellent pick for home",
            "Comes in a proper and secure packaging"
        ],
        description: "Ariston PRO1 Vertical Water Heater (80L)",
        bullets: [
            "Date First Available: 18 May 2019",
            "ASIN:B07S2QPC13"
        ],
        specs: [
            { title: "Brand", text: "Ariston" },
            { title: "Capacity", text: "80 Liters" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Colour", text: "White" },
            { title: "Material", text: "Titanium" }
        ],
        technical: [
            { title: "Manufacturer", text: "Italy" },
            { title: "Part number", text: "PRO/R-80L" },
            { title: "Item Weight", text: "37 Kilograms" },
            { title: "Product Dimensions", text: "150 x 150 x 150 cm; 37 kg" },
            { title: "Item model number", text: "PRO/R-80L" },
            { title: "Color", text: "white" },
            { title: "Style", text: "tank" },
            { title: "Material", text: "Titanium" },
            { title: "Power source type", text: "Corded Electric" },
            { title: "Item Package Quantity", text: "1" },
            { title: "Plug Profile", text: "Floor" },
            { title: "Included components", text: "Safety Valve" },
            { title: "Batteries Required", text: "No" }
        ]
    },
    {
        categoryFilter: "water-heater",
        category: "Ariston Electric Water Heater",
        partNumber: "3201982",
        stockAllocated: 0,
        overview: "Ariston Electric Water Heater 100 Litter Horizontal Pro-R Italy",
        standardPrice: "515",
        amazonPrice: "555",
        weight: "26.5",
        freightCharges: "73",
        sellingPriceWithFreight: "628",
        newAmazonSellingPrice: "659.4",
        brand: "ARISTON",
        amazonLink: "https://amzn.eu/d/0s0ES2C",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338678/Picture22_zucusk.png"
        ],
        about: [
            "Item Category: Water Heater",
            "Item Trademark: Ariston",
            "Manufacturer: Ariston"
        ],
        bullets: [
            "Weight: 25KG",
            "Depth: 480mm",
            "Height: 450mm",
            "Width: 913mm",
            "Model Number: PRO-R 100H",
            "Water Heater Type: Tank Water Heater",
            "Power Source Type: Electric",
            "Brand: Ariston",
            "Country of Origin: Italy"
        ],
        specs: [
            { title: "Brand", text: "Ariston" },
            { title: "Capacity", text: "100 Liters" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Product dimensions", text: "91.3W x 45H centimeters" },
            { title: "Special features", text: "High Water Pressure Protection, Integrated Error Code Indicator, Overheat Protection" }
        ],
        technical: [
            { title: "Brand", text: "Ariston" },
            { title: "Model Number", text: "PRO-R 100H" },
            { title: "Color", text: "white" },
            { title: "Product Dimensions", text: "91.3 x 91.3 x 45 cm; 150 g" },
            { title: "Capacity", text: "100 Liters" },
            { title: "Material", text: "Stainless Steel" },
            { title: "Special Features", text: "High Water Pressure Protection, Integrated Error Code Indicator, Overheat Protection" },
            { title: "Item Weight", text: "150 g" }
        ]
    },
    {
        categoryFilter: "water-heater",
        category: "Ariston Electric Water Heater",
        partNumber: "3626201",
        stockAllocated: 10,
        overview: "ARISTON BLU R 50LTR V ELECTRIC WATER HEATER",
        standardPrice: "280",
        amazonPrice: "300",
        weight: "21.5",
        freightCharges: "63",
        sellingPriceWithFreight: "363",
        newAmazonSellingPrice: "363",
        brand: "ARISTON",
        amazonLink: "https://amzn.eu/d/8r4soo4",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338686/Picture23_rrsbnp.png"
        ],
        about: [
            "Sleek design",
            "Seamless functionality",
            "Designed to perfection",
            "Compact construction"
        ],
        description: "The fact that it is easy to maintain makes it a great pick. Furthermore, it is also made of premium-quality material.",
        specs: [
            { title: "Brand", text: "Ariston" },
            { title: "Capacity", text: "50 Liters" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Product dimensions", text: "45W x 54H centimeters" },
            { title: "Colour", text: "White" }
        ],
        technical: [
            { title: "Brand", text: "Ariston" },
            { title: "Model Number", text: "BLU R 50 V" },
            { title: "Color", text: "White" },
            { title: "Product Dimensions", text: "48 x 45 x 54 cm; 150 g" },
            { title: "Capacity", text: "50 Liters" },
            { title: "Material", text: "Alloy Steel" },
            { title: "Item Weight", text: "150 g" }
        ]
    },
    {
        categoryFilter: "water-heater",
        category: "Ariston Electric Water Heater",
        partNumber: "3626202",
        stockAllocated: 10,
        overview: "ARISTON BLU R 80LTR V ELECTRIC WATER HEATER",
        standardPrice: "340",
        amazonPrice: "365",
        weight: "27",
        freightCharges: "74",
        sellingPriceWithFreight: "439",
        newAmazonSellingPrice: "460.95",
        brand: "ARISTON",
        amazonLink: "https://amzn.eu/d/iyaN1Gt",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338678/Picture24_hydq3s.png"
        ],
        about: [
            "Brand: Ariston",
            "Capacity: 80 liters",
            "Brand: Ariston"
        ],
        description: "BLU R 80 Liters Vertical Installation Electric Water Heater COMFORT External temperature regulation EFFICIENCY & ENERGY SAVING Extra thick polyurethane insulation. High thickness steel tank d at 16 bar Oversized magnesium anode Original Ariston thermostat with built-in safety device External thermometer Pressure safety valve rated at 8 bar DESIGN Wall-hung.",
        specs: [
            { title: "Brand", text: "Ariston" },
            { title: "Capacity", text: "80 Liters" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Product dimensions", text: "45W x 74H centimeters" },
            { title: "Special features", text: "High Capacity, Extra Thick Insulation, Enhanced Safety Features, Durable Materials, Energy Efficient" }
        ],
        technical: [
            { title: "Brand", text: "Ariston" },
            { title: "Model Number", text: "BLU R 80 V" },
            { title: "Color", text: "White" },
            { title: "Product Dimensions", text: "45 x 45 x 74 cm; 150 g" },
            { title: "Capacity", text: "80 Liters" },
            { title: "Material", text: "Alloy Steel" },
            { title: "Special Features", text: "High Capacity, Extra Thick Insulation, Enhanced Safety Features, Durable Materials, Energy Efficient" },
            { title: "Item Weight", text: "150 g" }
        ]
    },
    {
        categoryFilter: "water-heater",
        category: "Ariston Electric Water Heater",
        partNumber: "3626203",
        stockAllocated: 3,
        overview: "ARISTON BLU R 100LTR V ELECTRIC WATER HEATER",
        standardPrice: "395",
        amazonPrice: "425",
        weight: "27.4",
        freightCharges: "74.8",
        sellingPriceWithFreight: "499.8",
        newAmazonSellingPrice: "524.79",
        brand: "ARISTON",
        amazonLink: "https://amzn.eu/d/jhUn2kI",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338674/Picture25_f1z6wx.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338673/Picture26_w93jvw.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338673/Picture27_dovnvo.png"
        ],
        about: [
            "Brand: Ariston",
            "Capacity: 100 Liters",
            "Brand: Ariston"
        ],
        description: "BLU R 100 Liters Vertical Installation Electric Water Heater. COMFORT: External temperature regulation. EFFICIENCY & ENERGY SAVING: Extra thick polyurethane insulation. QUALITY: High thickness steel tank rated at 16 bar, Oversized magnesium anode, Original Ariston thermostat with built-in safety device, External thermometer, Pressure safety valve rated at 8 bar. DESIGN: Wall-hung.",
        specs: [
            { title: "Brand", text: "Ariston" },
            { title: "Capacity", text: "100 Liters" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Product dimensions", text: "45W x 90H centimetres" },
            { title: "Special features", text: "Overheat Protection" }
        ],
        technical: [
            { title: "Brand", text: "Ariston" },
            { title: "Model Number", text: "BLU R 100 V" },
            { title: "Colour", text: "White" },
            { title: "Product Dimensions", text: "48 x 45 x 90 cm; 150 g" },
            { title: "Capacity", text: "100 Liters" },
            { title: "Material", text: "Alloy Steel" },
            { title: "Special Features", text: "Overheat Protection" },
            { title: "Item Weight", text: "150 g" }
        ]
    },
    {
        categoryFilter: "water-heater",
        category: "Ariston Electric Water Heater",
        partNumber: "3626204",
        stockAllocated: 9,
        overview: "ARISTON BLU R 50LTR H ELECTRIC WATER HEATER",
        standardPrice: "295",
        amazonPrice: "315",
        weight: "19",
        freightCharges: "58",
        sellingPriceWithFreight: "373",
        newAmazonSellingPrice: "391.65",
        brand: "ARISTON",
        amazonLink: "https://amzn.eu/d/a3oIFUS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338675/Picture28_isr1dl.png"
        ],
        about: [
            "built-in safety device",
            "External thermometer",
            "Pressure safety valve rated at 8 bar",
            "High thickness steel tank tested at 16 ATM",
            "Extra thick polyurethane insulation",
            "External temperature regulation"
        ],
        bullets: [
            "Brand: Ariston",
            "Colour: White",
            "Weight: 17 Kg",
            "Depth: 480MM",
            "Height: 450MM",
            "Width: 603MM",
            "Power Source Type: Electric",
            "Water Heater Type: Tank Water Heater",
            "Model Number: BLU-R 50LH",
            "Capacity: 50 Liter"
        ],
        specs: [
            { title: "Brand", text: "Ariston" },
            { title: "Capacity", text: "50 Liters" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Product dimensions", text: "60.3W x 45H centimeters" },
            { title: "Colour", text: "white" }
        ],
        technical: [
            { title: "Brand", text: "Ariston" },
            { title: "Model Number", text: "BLU-R 50LH" },
            { title: "Colour", text: "white" },
            { title: "Product Dimensions", text: "48 x 60.3 x 45 cm; 150 g" },
            { title: "Capacity", text: "50 Liters" },
            { title: "Material", text: "Alloy Steel" },
            { title: "Item Weight", text: "150 g" },
        ]
    },
    {
        categoryFilter: "water-heater",
        category: "Ariston Electric Water Heater",
        partNumber: "3626205",
        stockAllocated: 7,
        overview: "ARISTON BLU R 80LTR H ELECTRIC WATER HEATER",
        standardPrice: "350",
        amazonPrice: "375",
        weight: "25",
        freightCharges: "70",
        sellingPriceWithFreight: "445",
        newAmazonSellingPrice: "467.25",
        brand: "ARISTON",
        amazonLink: "https://amzn.eu/d/7lQPVwq",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338675/Picture29_c2oodl.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338676/Picture30_dlev69.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338677/Picture31_gud6yt.png"
        ],
        about: [
            "Brand: Ariston",
            "Style: Indoor Installation",
            "Power source type: Corded Electric"
        ],
        description: "Blue R Electric Water Heater 80L for convenient horizontal installation, external temperature regulation, efficiency and energy saving, extra thick polyurethane insulation, high thickness steel tank quality tested at 16 bar, original Ariston thermostat with built-in safety device, external thermometer and pressure safety valve rated at 8 bar, wall hanging design.",
        specs: [
            { title: "Brand", text: "Ariston" },
            { title: "Capacity", text: "80 Liters" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Special features", text: "Extra Thick Insulation, Advanced Temperature Control" },
            { title: "Colour", text: "Black" }
        ],
        technical: [
            { title: "Manufacturer", text: "Ariston" },
            { title: "Item Weight", text: "18 Kilograms" },
            { title: "Package Dimensions", text: "77.47 x 48.26 x 48.26 cm; 18 kg" },
            { title: "Color", text: "Black" },
            { title: "Style", text: "Indoor Installation" },
            { title: "Material", text: "Alloy Steel" },
            { title: "Power source type", text: "Corded Electric" },
            { title: "Maximum Pressure", text: "8 Bars" },
            { title: "Plug Profile", text: "Wall" },
            { title: "Special Features", text: "Extra Thick Insulation, Advanced Temperature Control" }
        ]
    },
    {
        categoryFilter: "water-heater",
        category: "Ariston Electric Water Heater",
        partNumber: "3626206",
        stockAllocated: 3,
        overview: "ARISTON BLU R 100LTR H ELECTRIC WATER HEATER",
        standardPrice: "410",
        amazonPrice: "440",
        weight: "30",
        freightCharges: "80",
        sellingPriceWithFreight: "520",
        newAmazonSellingPrice: "546",
        brand: "ARISTON",
        amazonLink: "https://amzn.eu/d/9jDWAr9",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338687/Picture32_tbjyed.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338687/Picture33_b5strp.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338689/Picture34_t7hdaq.png"
        ],
        about: [
            "Brand: Ariston",
            "Colour: White",
            "Weight: 25 Kg"
        ],
        description: "Brand: Ariston. Colour: White. Depth: 480MM. Height: 450MM. Width: 961MM. Power Source Type: Electric. Water Heater Type: Tank Water Heater. Model Number: BLU-R 100LH. Capacity: 100 Liter.",
        specs: [
            { title: "Brand", text: "Ariston" },
            { title: "Capacity", text: "100 Liters" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Product dimensions", text: "96.1W x 45H centimeters" },
            { title: "Special features", text: "High Water Pressure Protection" }
        ],
        bullets: [
            "Date First Available: 9 January 2019",
            "ASIN: B07MQ9QD35"
        ],
        technical: [
            { title: "Manufacturer", text: "Ariston" },
            { title: "Part number", text: "BLU-R 100LH" },
            { title: "Item Weight", text: "150 g" },
            { title: "Product Dimensions", text: "96.1 x 96.1 x 45 cm; 150 g" },
            { title: "Item model number", text: "BLU-R 100LH" },
            { title: "Color", text: "white" },
            { title: "Style", text: "Tank Water Heater" },
            { title: "Material", text: "Alloy Steel" },
            { title: "Power source type", text: "Corded Electric" },
            { title: "Item Package Quantity", text: "1" },
            { title: "Maximum Pressure", text: "8 Bars" },
            { title: "Plug Profile", text: "Wall" },
            { title: "Special Features", text: "High Water Pressure Protection" },
            { title: "Batteries Required", text: "No" }
        ]
    },
    {
        categoryFilter: "water-heater",
        category: "Ariston Electric Water Heater",
        partNumber: "4015038",
        stockAllocated: 0,
        overview: "ARISTON PRO 1 R 50LTR H ELECTRIC WATER HEATER",
        standardPrice: "450",
        amazonPrice: "--",
        weight: "17.5",
        freightCharges: "50",
        sellingPriceWithFreight: "395.14",
        newAmazonSellingPrice: "525.00",
        brand: "ARISTON",
        amazonLink: "https://amzn.eu/d/6c34rEP",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338693/Picture35_lhrhns.png"
        ],
        about: [
            "Ariston Pro1 R is wall hung water heater",
            "Titan Shield technology ensures high durability of the heater",
            "Oversized magnesium anode creates additional active anti-corrosion protection and enhances reliability",
            "High-thickness polyurethane thermal insulation isolation minimizes the thermal loss and limits the electric energy use"
        ],
        description: "Ariston Vertical Water Heater PRO1 R, 50L",
        bullets: [
            "Date First Available: 18 May 2019",
            "ASIN: B07S3R2B3X"
        ],
        specs: [
            { title: "Brand", text: "Ariston" },
            { title: "Capacity", text: "50 Liters" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Product dimensions", text: "55W x 80H centimetres" },
            { title: "Colour", text: "White" }
        ],
        technical: [
            { title: "Manufacturer", text: "Italy" },
            { title: "Part number", text: "A-PRO/R-50L" },
            { title: "Item Weight", text: "28.1 Kilograms" },
            { title: "Product Dimensions", text: "55 x 55 x 80 cm; 28.12 kg" },
            { title: "Item model number", text: "A-PRO/R-50L" },
            { title: "Color", text: "WHITE" },
            { title: "Style", text: "Indoor Installation" },
            { title: "Material", text: "Titanium" },
            { title: "Power source type", text: "Corded Electric" },
            { title: "Voltage", text: "220 Volts" },
            { title: "Wattage", text: "1200 watts" },
            { title: "Item Package Quantity", text: "1" },
            { title: "Flow Rate", text: "50 Liters Per Minute" },
            { title: "Plug Profile", text: "Wall" },
            { title: "Included components", text: "SAFETY VALVE" },
            { title: "Batteries Required", text: "No" }
        ]
    },
    {
        categoryFilter: "water-heater",
        category: "Ariston Electric Water Heater",
        partNumber: "4015039",
        stockAllocated: 0,
        overview: "ARISTON PRO 1 R 80LTR H ELECTRIC WATER HEATER",
        standardPrice: "480",
        amazonPrice: "620",
        weight: "22.5",
        freightCharges: "60",
        sellingPriceWithFreight: "442.52",
        newAmazonSellingPrice: "550.00",
        brand: "ARISTON",
        amazonLink: "https://amzn.eu/d/92ZJ098",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338694/Picture36_p5idpd.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338694/Picture37_udsz3i.png"
        ],
        about: [
            "Brand: Ariston",
            "Capacity: 80 liter",
            "This product will be an excellent pick for home",
            "Comes in a proper and secure packaging"
        ],
        description: "Ariston PRO1 Vertical Water Heater (80L)",
        bullets: [
            "Date First Available: 18 May 2019",
            "ASIN: B07S2QPC13"
        ],
        specs: [
            { title: "Brand", text: "Ariston" },
            { title: "Capacity", text: "80 Liters" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Colour", text: "white" },
            { title: "Material", text: "Titanium" }
        ],
        technical: [
            { title: "Manufacturer", text: "Italy" },
            { title: "Part number", text: "PRO/R-80L" },
            { title: "Item Weight", text: "37 Kilograms" },
            { title: "Product Dimensions", text: "150 x 150 x 150 cm; 37 kg" },
            { title: "Item model number", text: "PRO/R-80L" },
            { title: "Color", text: "White" },
            { title: "Style", text: "Tank" },
            { title: "Material", text: "Titanium" },
            { title: "Power source type", text: "Corded Electric" },
            { title: "Item Package Quantity", text: "1" },
            { title: "Plug Profile", text: "Floor" },
            { title: "Included components", text: "Safety Valve" },
            { title: "Batteries Required", text: "No" }
        ]
    },
    {
        categoryFilter: "water-heater",
        category: "Ariston Electric Water Heater",
        partNumber: "4015040",
        stockAllocated: 0,
        overview: "ARISTON PRO1 R 100LTR H ELECTRIC WATER HEATER",
        standardPrice: "570",
        amazonPrice: "765",
        weight: "26.5",
        freightCharges: "70",
        sellingPriceWithFreight: "504.18",
        newAmazonSellingPrice: "725.00",
        brand: "ARISTON",
        amazonLink: "https://amzn.eu/d/f7K4hTm",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769338681/Picture38_qg02yu.png"
        ],
        about: [
            "Item Category: Water Heater",
            "Item Trademark: Ariston",
            "Manufacturer: Ariston"
        ],
        bullets: [
            "Weight: 25KG",
            "Depth: 480mm",
            "Height: 450mm",
            "Width: 913mm",
            "Model Number: PRO-R 100H",
            "Water Heater Type: Tank Water Heater",
            "Power Source Type: Electric",
            "Brand: Ariston",
            "Country of Origin: Italy"
        ],
        specs: [
            { title: "Brand", text: "Ariston" },
            { title: "Capacity", text: "100 Liters" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Product dimensions", text: "91.3W x 45H centimeters" },
            { title: "Special features", text: "High Water Pressure Protection, Integrated Error Code Indicator, Overheat Protection" }
        ],
        technical: [
            { title: "Brand", text: "Ariston" },
            { title: "Model Number", text: "PRO-R 100H" },
            { title: "Color", text: "White" },
            { title: "Product Dimensions", text: "91.3 x 91.3 x 45 cm; 150 g" },
            { title: "Capacity", text: "100 Liters" },
            { title: "Material", text: "Stainless Steel" },
            { title: "Special Features", text: "High Water Pressure Protection, Integrated Error Code Indicator, Overheat Protection" },
            { title: "Item Weight", text: "150 g" }
        ]
    }
];
const craneProducts = [
    {
        categoryFilter: "crane",
        category: "Crane Bronze Gate Valve",
        partNumber: "0EA04306P",
        stockAllocated: 0,
        overview: "CRANE D151 1/2\" GATE VALVE HANDWHEEL OPERATED BRONZE BODY & DISC WRAS BSPT PN20",
        standardPrice: "35.70",
        amazonPrice: "",
        freightCharges: "",
        sellingPriceWithFreight: "",
        newAmazonSellingPrice: "",
        brand: "CRANE",
        amazonLink: "",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769418510/valve_converted_xgfz0v.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1773846975/image6_axtngx.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1773846976/image5_chx06a.png"
        ],
        about: [
            "Crane gate valves offer the ultimate in dependable service wherever minimum pressure drop is important",
            "The D151 carries the British Standards Institution kitemark - your assurance of exacting quality standards",
            "WRAS approved for use on wholesome (potable) water"
        ],
        description: "Bronze Gate Valve, Non-Rising Stem, Solid Wedge, Screwed Bonnet, in accordance with BS EN 12288:2010, PN20 rated. Body, Bonnet and disc to Bronze to BS EN 1982 CC491K. Valves are manufactured in accordance with BS EN 12288: 2010 PN20 Series B and are BSI Kitemark approved.",
        features: [
            { title: "Operator", text: "Handwheel. Gate valves are best for services that require infrequent valve operation, and where the disc is kept either fully opened or fully closed. They are not practical for throttling." },
            { title: "Specification", text: "Solid wedge disc, non-rising stem, screwed in bonnet. Valves are manufactured in accordance with BS EN 12288: 2010 PN20 Series B and are BSI Kitemark approved. This valve is not suitable for use on group 1 gases or unstable fluids, as defined by the Pressure Equipment Directive 97/23/EC" }
        ],
        specs: [
            { title: "Brand", text: "Crane" },
            { title: "Size", text: "1/2\"" },
            { title: "Material", text: "Bronze" },
            { title: "Pressure Rating", text: "PN20" },
            { title: "Temperature Range", text: "-10 to 180°C" }
        ],
        technical: [
            { title: "Manufacturer", text: "Crane" },
            { title: "Part Number", text: "0EA04306P" },
            { title: "Item Number", text: "D151" },
            { title: "Body", text: "Bronze BS EN 1982 CC491K" },
            { title: "Bonnet", text: "Bronze BS EN 1982 CC491K" },
            { title: "Stem", text: "DZR Brass BS EN 12164 CW602N" },
            { title: "Stem", text: "Manganese Bronze" },
            { title: "Disc", text: "Bronze BS EN 1982 CC491K" },
            { title: "Stem Retainer", text: "DZR Brass BS EN 12164 CW602N" },
            { title: "Stuffing Box", text: "DZR Brass BS EN 12164 CW602N" },
            { title: "Stuffing Box", text: "Bronze BS EN 1982 CC491K" },
            { title: "Packing", text: "Asbestos Free" },
            { title: "Packing Gland", text: "Brass BS EN 12164 CW614N" },
            { title: "Packing Gland Nut", text: "Brass BS EN 12164 CW614N" },
            { title: "Packing Gland", text: "Bronze BS EN 1982 CC491K" },
            { title: "Packing Nut", text: "Brass BS EN 12164 CW614N" },
            { title: "Packing Nut", text: "Bronze BS EN 1982 CC491K" },
            { title: "Handwheel", text: "Aluminium" },
            { title: "Handwheel", text: "Malleable Iron BS EN 1562 GJMB-300-6" },
            { title: "ID Plate", text: "Aluminium" },
            { title: "Handwheel Nut", text: "Brass BS EN 12164 CW614N" },
            { title: "Gasket", text: "Asbestos Free" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Bronze Gate Valve",
        partNumber: "0EA04307Q",
        stockAllocated: 0,
        overview: "CRANE D151 3/4\" GATE VALVE HANDWHEEL OPERATED BRONZE BODY & DISC WRAS BSPT PN20",
        standardPrice: "51.40",
        amazonPrice: "",
        freightCharges: "",
        sellingPriceWithFreight: "",
        newAmazonSellingPrice: "",
        weight: "0.5",
        brand: "CRANE",
        amazonLink: "https://www.amazon.ae/dp/B0D9B9YVVC",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769418511/51_6DNn2eWL._AC__hdgbpm.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769418510/41BvgwWS1lL._AC_SL1500__fumnxd.png"
        ],
        about: [
            "Application: HVAC",
            "Main Material: Bronze",
            "Nominal Pressure: 20",
            "Disc Material: Bronze"
        ],
        description: "WRAS Approved Bronze Gate Valve, body, disc and wedge material in bronze, DZR brass stem, PTFE packing, PN20 rated, threaded ends to ISO 228/1",
        bullets: [
            "Date First Available: 12 July 2024",
            "Manufacturer: Generic",
            "ASIN: B0D9B9YVVC"
        ],
        specs: [
            { title: "Material", text: "Bronze" },
            { title: "Brand", text: "Generic" },
            { title: "Item dimensions", text: "9.2 x 4.9 x 9.2 centimetres" },
            { title: "Exterior finish", text: "Bronze" },
            { title: "Manufacturer", text: "Generic" },
        ],
        technical: [
            { title: "Manufacturer", text: "Generic" },
            { title: "Part Number", text: "0EA04307Q" },
            { title: "Item Weight", text: "500 g" },
            { title: "Product Dimensions", text: "9.2 x 4.9 x 9.2 cm" },
            { title: "Item Model Number", text: "3/4\"" },
            { title: "Size", text: "PN20 3/4''" },
            { title: "Colour", text: "Golden" },
            { title: "Included Components", text: "Valve" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Bronze Gate Valve",
        partNumber: "0EA04308R",
        stockAllocated: 0,
        overview: "CRANE D151 1\" GATE VALVE HANDWHEEL OPERATED BRONZE BODY & DISC WRAS BSPT PN20",
        standardPrice: "74.60",
        amazonPrice: "",
        freightCharges: "",
        sellingPriceWithFreight: "",
        newAmazonSellingPrice: "",
        brand: "CRANE",
        amazonLink: "",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769418513/valve_image_1_unlxgk.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769418511/valve_image_2_m2kupy.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1773848383/image5_vowunv.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1773848381/image6_aovvxf.png"
        ],
        about: [
            "Crane gate valves offer the ultimate in dependable service wherever minimum pressure drop is important",
            "The D151 carries the British Standards Institution kitemark - your assurance of exacting quality standards",
            "WRAS approved for use on wholesome (potable) water in sizes 1/2\" - 2\" only",
            "Non-rising stem design to minimise installation height",
            "Full bore design to ensure minimal pressure drop",
            "Adjustable gland packing for ease of maintenance",
            "Body, bonnet and disc are made from low lead content bronze, typically 4-6%",
            "Conforms with BS EN12288:2010 and generally conforms with MSS SP 80"
        ],
        description: "Bronze Gate Valve, Non-Rising Stem, Solid Wedge, Screwed Bonnet, in accordance with BS EN 12288:2010, PN20 rated. Body, Bonnet and disc to Bronze to BS EN 1982 CC491K. DZR Brass Stem to CW602N. PTFE packing ring complete with Brass packing gland and nut design. WRAS approved and BSI Kitemark approved. Gate valves are best for services that require infrequent valve operation, and where the disc is kept either fully opened or fully closed. They are not practical for throttling.",
        features: [
            { title: "UK End Connection", text: "Taper threaded to BS EN 10226-2 (ISO 7-1) formerly BS 21" },
            { title: "US End Connection", text: "ANSI B1.20.1" },
            { title: "Operator", text: "Handwheel" },
            { title: "Specification", text: "Bronze Gate Valve, Non-Rising Stem, Solid Wedge, Screwed Bonnet, in accordance with BS EN 12288:2010, PN20 rated. Body, Bonnet and disc to Bronze to BS EN 1982 CC491K. DZR Brass Stem to CW602N. PTFE packing ring complete with Brass packing gland and nut design. WRAS approved and BSI Kitemark approved." },
            { title: "MSS SP80 Conformance", text: "D151 meets the essential requirements of the Standard such as pressure temperature rating, functional attributes, material of construction, wall thickness and thread depth. D151.AT complies with end connections as well." },
        ],
        specs: [
            { title: "Brand", text: "Crane" },
            { title: "Size", text: "1\"" },
            { title: "Material", text: "Bronze" },
            { title: "Pressure Rating", text: "PN20" },
            { title: "Temperature Range", text: "-10 to 180°C" }
        ],
        technical: [
            { title: "Manufacturer", text: "Crane" },
            { title: "Part Number", text: "0EA04308R" },
            { title: "Item Number", text: "D151" },
            { title: "Body", text: "Bronze BS EN 1982 CC491K" },
            { title: "Bonnet", text: "Bronze BS EN 1982 CC491K" },
            { title: "Stem", text: "DZR Brass BS EN 12164 CW602N" },
            { title: "Stem", text: "Manganese Bronze" },
            { title: "Disc", text: "Bronze BS EN 1982 CC491K" },
            { title: "Stem Retainer", text: "DZR Brass BS EN 12164 CW602N" },
            { title: "Stuffing Box", text: "DZR Brass BS EN 12164 CW602N" },
            { title: "Stuffing Box", text: "Bronze BS EN 1982 CC491K" },
            { title: "Packing", text: "Asbestos Free" },
            { title: "Packing Gland", text: "Brass BS EN 12164 CW614N" },
            { title: "Packing Gland Nut", text: "Brass BS EN 12164 CW614N" },
            { title: "Packing Gland", text: "Bronze BS EN 1982 CC491K" },
            { title: "Packing Nut", text: "Brass BS EN 12164 CW614N" },
            { title: "Packing Nut", text: "Bronze BS EN 1982 CC491K" },
            { title: "Handwheel", text: "Aluminium" },
            { title: "Handwheel", text: "Malleable Iron BS EN 1562 GJMB-300-6" },
            { title: "ID Plate", text: "Aluminium" },
            { title: "Handwheel Nut", text: "Brass BS EN 12164 CW614N" },
            { title: "Gasket", text: "Asbestos Free" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Bronze Gate Valve",
        partNumber: "0EA04309S",
        stockAllocated: 0,
        overview: "CRANE D151 1.1/4\" GATE VALVE HANDWHEEL OPERATED BRONZE BODY & DISC WRAS BSPT PN20",
        standardPrice: "109.30",
        amazonPrice: "",
        weight: "0.844",
        freightCharges: "",
        sellingPriceWithFreight: "",
        newAmazonSellingPrice: "",
        brand: "CRANE",
        amazonLink: "",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769418509/valve_final_xhdqa7.png"
        ],
        about: [
            "Crane gate valves offer the ultimate in dependable service wherever minimum pressure drop is important",
            "The D151 carries the British Standards Institution kitemark - your assurance of exacting quality standards",
            "WRAS approved for use on wholesome (potable) water in sizes 1/2\"-2\" only"
        ],
        description: "PN20 Bronze Gate Valve with taper threaded connection to BS EN 10226-2 (ISO 7-1) formerly BS 21. Available in sizes 1/4\" to 4\".",
        specs: [
            { title: "Brand", text: "Crane" },
            { title: "Size", text: "1.1/4\"" },
            { title: "Pressure Class", text: "PN20" },
            { title: "Connection Type", text: "Taper threaded to BS EN 10226-2 (ISO 7-1) formerly BS 21" },
            { title: "Valve Body Material", text: "Bronze" }
        ],
        technical: [
            { title: "Manufacturer", text: "Crane" },
            { title: "Part Number", text: "0EA04309S" },
            { title: "Item Number", text: "D151" },
            { title: "Size Range", text: "1/4\" to 4\"" }
        ]
    },
    // DM931 Variable Orifice Double Regulating Valves
    {
        categoryFilter: "crane",
        category: "Crane Variable Orifice Double Regulating Valve",
        partNumber: "0JG90606A",
        overview: "CRANE F678L 2.1/2\" BUTTERFLY VALVE PN16 DI BODY FULLY LUGGED LEVER OPERATED EPDM LINER ALUMINIUM BRONZE DISC",
        standardPrice: "1880.6",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420943/Picture1_b8bwbg.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420945/Picture2_v8o8vd.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420960/Picture3_q2kecj.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420953/Picture4_e1cd1j.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1773829601/0JG90606A_wfaqb4.png"
        ],
        about: [
            "These are Y-Pattern globe valves supplied with two pressure test points P84 to provide flow measurement, regulation and isolation",
            "The Double Regulating feature allows the valve to be used for isolation and to be reopened to its pre-set position to maintain required flow rate",
            "Primarily used in injection or other circuits requiring a double regulating valve for system balancing",
            "Accuracy of flow measurement is ±10% at the full open position of the valve",
            "Some reduction in accuracy occurs at partial openings of the valve in accordance with BS 7350"
        ],
        description: "Variable Orifice Double Regulating Valve (DRV) - Ductile Iron. These are Y-Pattern globe valves supplied with two pressure test points P84 to provide flow measurement, regulation and isolation.",
        specs: [
            { title: "Size Range", text: "DN65 to DN300" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Flow rate", text: "Please see Flow Measurement Graphs" },
            { title: "Temperature Rating", text: "10 - 120°C" },
            { title: "End Connections", text: "Flanged" },
            { title: "Material", text: "Ductile Iron" }
        ],
        technical: [
            { title: "Body", text: "Ductile Iron - BS EN 1563 GJS-450-10" },
            { title: "Bonnet", text: "Ductile Iron - BS EN 1563 GJS-450-10" },
            { title: "Bonnet Gasket", text: "Non-asbestos" },
            { title: "Disc", text: "EPDM, Coated Cast Iron" },
            { title: "Disc Bush", text: "Bronze" },
            { title: "Stem", text: "410 SS" },
            { title: "Gland (65-150mm)", text: "Brass" },
            { title: "Gland (200-300mm)", text: "Cast Iron" },
            { title: "Packing", text: "Non-asbestos" },
            { title: "Seat Ring", text: "Bronze" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Variable Orifice Double Regulating Valve",
        partNumber: "0JG90607B",
        overview: "CRANE DM931 6\" VARIABLE ORIFICE DOUBLE REGULATING VALVE(VODRV) RF FLANGED Y-PATTERN WITH TEST POINT P84 PN16",
        standardPrice: "2,190.80",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420962/Picture1_da7q6l.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420964/Picture2_d05p1v.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420974/Picture3_fa3lpk.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420967/Picture4_c9azai.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1773856587/image2_ld16ry.png"
        ],
        about: [
            "These are Y-Pattern globe valves supplied with two pressure test points P84 to provide flow measurement, regulation and isolation",
            "The Double Regulating feature allows the valve to be used for isolation and to be reopened to its pre-set position to maintain required flow rate",
            "Primarily used in injection or other circuits requiring a double regulating valve for system balancing",
            "Accuracy of flow measurement is ±10% at the full open position of the valve",
            "Some reduction in accuracy occurs at partial openings of the valve in accordance with BS 7350"
        ],
        description: "DM931 Variable Orifice Double Regulating Valve (DRV) - Ductile Iron DN65 to DN300.",
        specs: [
            { title: "Size Range", text: "DN65 to DN300" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Flow rate", text: "Please see Flow Measurement Graphs" },
            { title: "Temperature Rating", text: "10 - 120°C" },
            { title: "End Connections", text: "Flanged" },
            { title: "Material", text: "Ductile Iron" }
        ],
        technical: [
            { title: "Body", text: "Ductile Iron - BS EN 1563 GJS-450-10" },
            { title: "Bonnet", text: "Ductile Iron - BS EN 1563 GJS-450-10" },
            { title: "Bonnet Gasket", text: "Non-asbestos" },
            { title: "Disc", text: "EPDM, Coated Cast Iron" },
            { title: "Disc Bush", text: "Bronze" },
            { title: "Stem", text: "410 SS" },
            { title: "Stem", text: "410 SS" },
            { title: "Gland (65 to 150mm)", text: "Brass" },
            { title: "Gland (200 to 300mm)", text: "Cast Iron " },
            { title: "Gland Nut", text: "Brass" },
            { title: "Packing", text: "Non-asbestos" },
            { title: "Seat Ring", text: "Bronze" }
        ]
    },
    // D298 Bronze Strainers
    {
        categoryFilter: "crane",
        category: "Crane Bronze Strainer",
        partNumber: "0JG91288L",
        overview: "CRANE D298 1/2\" STRAINER BRONZE BODY SS304 MESH WRAS BSPT PN16",
        standardPrice: "30.30",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420980/Screenshot_2026-01-23_162658_oofjyl.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1773856991/image2_t34uie.png"
        ],
        about: [
            "A generous use of pipeline strainers will make a significant contribution to the reliability of a piping system and to optimise performance of the equipment - pumps, valves, flow measuring devices, traps etc",
            "Strainers are a low cost investment for any piping system and result in reduced maintenance costs as well as minimising 'downtime' by protecting the circuit from damage by foreign matter"
        ],
        description: "D298 Bronze Strainer with SS304 mesh, WRAS approved, BSPT connection, PN16 rated.",
        specs: [
            { title: "Size", text: "1/2\"" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Temperature Rating", text: "-10 to 100°C" },
            { title: "WRAS Approval", text: "-10 to 85°C" },
            { title: "Connection", text: "BSPT" }
        ],
        technical: [
            { title: "Body", text: "Bronze to BS EN 1982 CC491K" },
            { title: "Mesh", text: "Stainless Steel to A.I.S.I. Type 304" },
            { title: "Cap Seal", text: "PTFE" },
            { title: "Cap", text: "Bronze to BS EN 1982 CC491K" },
            { title: "ID Plate", text: "Aluminium" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Bronze Strainer",
        partNumber: "0JG91289M",
        overview: "CRANE D298 3/4\" STRAINER BRONZE BODY SS304 MESH WRAS BSPT PN16",
        standardPrice: "41.60",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420989/Screenshot_2026-01-23_162658_e1kfny.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1773857315/image2_fgnnlj.png"
        ],
        about: [
            "A generous use of pipeline strainers will make a significant contribution to the reliability of a piping system and to optimise performance of the equipment - pumps, valves, flow measuring devices, traps etc",
            "Strainers are a low cost investment for any piping system and result in reduced maintenance costs as well as minimising 'downtime' by protecting the circuit from damage by foreign matter"
        ],
        description: "D298 Bronze Strainer with SS304 mesh, WRAS approved, BSPT connection, PN16 rated.",
        specs: [
            { title: "Size", text: "3/4\"" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Temperature Rating", text: "-10 to 100°C" },
            { title: "WRAS Approval", text: "-10 to 85°C" },
            { title: "Connection", text: "BSPT" }
        ],
        technical: [
            { title: "Body", text: "Bronze to BS EN 1982 CC491K" },
            { title: "Mesh", text: "Stainless Steel to A.I.S.I. Type 304" },
            { title: "Cap Seal", text: "PTFE" },
            { title: "Cap", text: "Bronze to BS EN 1982 CC491K" },
            { title: "ID Plate", text: "Aluminium" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Bronze Strainer",
        partNumber: "0JG91290E",
        overview: "CRANE D298 1\" STRAINER BRONZE BODY SS304 MESH WRAS BSPT PN16",
        standardPrice: "63.90",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420981/Screenshot_2026-01-23_162658_sykxzs.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1773858116/image2_bpav8z.png"
        ],
        about: [
            "A generous use of pipeline strainers will make a significant contribution to the reliability of a piping system and to optimise performance of the equipment - pumps, valves, flow measuring devices, traps etc",
            "Strainers are a low cost investment for any piping system and result in reduced maintenance costs as well as minimising 'downtime' by protecting the circuit from damage by foreign matter"
        ],
        description: "D298 Bronze Strainer with SS304 mesh, WRAS approved, BSPT connection, PN16 rated.",
        specs: [
            { title: "Size", text: "1\"" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Temperature Rating", text: "-10 to 100°C" },
            { title: "WRAS Approval", text: "-10 to 85°C" },
            { title: "Connection", text: "BSPT" }
        ],
        technical: [
            { title: "Body", text: "Bronze to BS EN 1982 CC491K" },
            { title: "Mesh", text: "Stainless Steel to A.I.S.I. Type 304" },
            { title: "Cap Seal", text: "PTFE" },
            { title: "Cap", text: "Bronze to BS EN 1982 CC491K" },
            { title: "ID Plate", text: "Aluminium" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Bronze Strainer",
        partNumber: "0JG91291F",
        overview: "CRANE D298 1.1/4\" STRAINER BRONZE BODY SS304 MESH WRAS BSPT PN16",
        standardPrice: "102.90",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420955/Screenshot_2026-01-23_162658_kgnzt8.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1773858116/image2_bpav8z.png"
        ],
        about: [
            "A generous use of pipeline strainers will make a significant contribution to the reliability of a piping system and to optimise performance of the equipment - pumps, valves, flow measuring devices, traps etc",
            "Strainers are a low cost investment for any piping system and result in reduced maintenance costs as well as minimising 'downtime' by protecting the circuit from damage by foreign matter"
        ],
        description: "D298 Bronze Strainer with SS304 mesh, WRAS approved, BSPT connection, PN16 rated.",
        specs: [
            { title: "Size", text: "1.1/4\"" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Temperature Rating", text: "-10 to 100°C" },
            { title: "WRAS Approval", text: "-10 to 85°C" },
            { title: "Connection", text: "BSPT" }
        ],
        technical: [
            { title: "Body", text: "Bronze to BS EN 1982 CC491K" },
            { title: "Mesh", text: "Stainless Steel to A.I.S.I. Type 304" },
            { title: "Cap Seal", text: "PTFE" },
            { title: "Cap", text: "Bronze to BS EN 1982 CC491K" },
            { title: "ID Plate", text: "Aluminium" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Bronze Strainer",
        partNumber: "0JG91292G",
        overview: "CRANE D298 1.1/2\" STRAINER BRONZE BODY SS304 MESH WRAS BSPT PN16",
        standardPrice: "145.00",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420958/Screenshot_2026-01-23_162658_sraqqv.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1773858116/image2_bpav8z.png"
        ],
        about: [
            "A generous use of pipeline strainers will make a significant contribution to the reliability of a piping system and to optimise performance of the equipment - pumps, valves, flow measuring devices, traps etc",
            "Strainers are a low cost investment for any piping system and result in reduced maintenance costs as well as minimising 'downtime' by protecting the circuit from damage by foreign matter"
        ],
        description: "D298 Bronze Strainer with SS304 mesh, WRAS approved, BSPT connection, PN16 rated.",
        specs: [
            { title: "Size", text: "1.1/2\"" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Temperature Rating", text: "-10 to 100°C" },
            { title: "WRAS Approval", text: "-10 to 85°C" },
            { title: "Connection", text: "BSPT" }
        ],
        technical: [
            { title: "Body", text: "Bronze to BS EN 1982 CC491K" },
            { title: "Mesh", text: "Stainless Steel to A.I.S.I. Type 304" },
            { title: "Cap Seal", text: "PTFE" },
            { title: "Cap", text: "Bronze to BS EN 1982 CC491K" },
            { title: "ID Plate", text: "Aluminium" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Bronze Strainer",
        partNumber: "0JG91293H",
        overview: "CRANE D298 2\" STRAINER BRONZE BODY SS304 MESH WRAS PN16",
        standardPrice: "231.20",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420988/Screenshot_2026-01-23_162658_g47noe.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1773858116/image2_bpav8z.png"
        ],
        about: [
            "A generous use of pipeline strainers will make a significant contribution to the reliability of a piping system and to optimise performance of the equipment - pumps, valves, flow measuring devices, traps etc",
            "Strainers are a low cost investment for any piping system and result in reduced maintenance costs as well as minimising 'downtime' by protecting the circuit from damage by foreign matter"
        ],
        description: "D298 Bronze Strainer with SS304 mesh, WRAS approved, PN16 rated.",
        specs: [
            { title: "Size", text: "2\"" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Temperature Rating", text: "-10 to 100°C" },
            { title: "WRAS Approval", text: "-10 to 85°C" }
        ],
        technical: [
            { title: "Body", text: "Bronze to BS EN 1982 CC491K" },
            { title: "Mesh", text: "Stainless Steel to A.I.S.I. Type 304" },
            { title: "Cap Seal", text: "PTFE" },
            { title: "Cap", text: "Bronze to BS EN 1982 CC491K" },
            { title: "ID Plate", text: "Aluminium" }
        ]
    },
    // F678L Butterfly Valves
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0JG92984J",
        overview: "CRANE F678L 2.1/2\" BUTTERFLY VALVE PN16 DI BODY FULLY LUGGED LEVER OPERATED EPDM LINER ALUMINIUM BRONZE DISC",
        standardPrice: "220.90",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420969/Picture1_nqrpok.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1773859034/image2_wva2hf.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1773859045/image3_vfb35e.png"
        ],
        about: [
            "Valves are suitable for use with flanges conforming to BS EN 1092-2 PN16",
            "Valve to BS EN593",
            "Ductile Iron, Stainless Steel, Aluminium Bronze Disc Options",
            "EPDM and Nitrile Seat Liner Options",
            "420 Stainless Steel Shafts for superior strength"
        ],
        description: "F678L Fully Lugged Lever Operated Butterfly Valve with Ductile Iron body, EPDM liner, and Aluminium Bronze disc.",
        specs: [
            { title: "Size Range", text: "50mm to 200mm" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Temperature Rating", text: "-10 to 120°C" },
            { title: "End Connections", text: "Fully Lugged, compatible with BS EN1092-2 PN16 flanges" },
            { title: "Material", text: "Ductile Iron" },
            { title: "Operator", text: "Trigger Lever" }
        ],
        technical: [
            { title: "Body", text: "Ductile Iron (EN-GJS-400-15)" },
            { title: "Disc (F648L & F644L)", text: "Ductile Iron (EN-GJS-400-15) Epoxy coated" },
            { title: "Disc (F658L & F654L)", text: "Stainless Steel 304 (ASTM A351 CF8)" },
            { title: "Disc (F678L & F674L)", text: "Aluminium Bronze (ASTM B148 C95400)" },
            { title: "Liner (F648L, F658L & F678L)", text: "EPDM" },
            { title: "Liner (F644L, F654L & F674L)", text: "Nitrile Rubber" },
            { title: "Shaft", text: "Stainless Steel 420 (ASTM A276 420)" },
            { title: "Taper Pin", text: "Stainless Steel 431 (ASTM A276 431)" },
            { title: "O-Ring", text: "Nitrile Rubber" },
            { title: "Bushing", text: "PTFE" },
            { title: "Lever & Screw", text: "Malleable Iron ASTM Gr.32510" },
            { title: "Stop Plate", text: "Mild Steel (GB700 Q235) Chromium Plated" },
            { title: "Shell Test Pressure", text: "24 bar" },
            { title: "Seat Test Pressure", text: "17.6 bar" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0JG92985K",
        overview: "CRANE F678L 3\" BUTTERFLY VALVE PN16 DI BODY FULLY LUGGED LEVER OPERATED EPDM LINER ALUMINIUM BRONZE DISC",
        standardPrice: "253.10",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420963/Picture1_dswqya.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1773859034/image2_wva2hf.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1773859045/image3_vfb35e.png"
        ],
        about: [
            "Valves are suitable for use with flanges conforming to BS EN 1092-2 PN16",
            "Valve to BS EN593",
            "Ductile Iron, Stainless Steel, Aluminium Bronze Disc Options",
            "EPDM and Nitrile Seat Liner Options",
            "420 Stainless Steel Shafts for superior strength"
        ],
        description: "F678L Fully Lugged Lever Operated Butterfly Valve with Ductile Iron body, EPDM liner, and Aluminium Bronze disc.",
        specs: [
            { title: "Size Range", text: "50mm to 200mm" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "End Connnections", text: "End connections compatible with BS EN1092-2 PN16 flanges." },
            { title: "Material", text: "Ductile Iron" },
            { title: "Temperature Rating", text: "-10 to 120°C" },
            { title: "End Connections", text: "Fully Lugged, compatible with BS EN1092-2 PN16 flanges" },
            { title: "Operator", text: "Trigger Lever" }
        ],
        technical: [
            { title: "Body", text: "Ductile Iron (EN-GJS-400-15)" },
            { title: "Disc", text: "Aluminium Bronze (ASTM B148 C95400)" },
            { title: "Liner", text: "EPDM" },
            { title: "Shaft", text: "Stainless Steel 420 (ASTM A276 420)" },
            { title: "Taper Pin", text: "Stainless Steel 431 (ASTM A276 431)" },
            { title: "O-Ring", text: "Nitrile Rubber" },
            { title: "Bushing", text: "PTFE" },
            { title: "Lever & Screw", text: "Malleable Iron ASTM Gr.32510" },
            { title: "Shell Test Pressure", text: "24 bar" },
            { title: "Seat Test Pressure", text: "17.6 bar" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0JG92986L",
        overview: "CRANE F678L 4\" BUTTERFLY VALVE PN16 DI BODY FULLY LUGGED LEVER OPERATED EPDM LINER ALUMINIUM BRONZE DISC",
        standardPrice: "424.10",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420972/Picture1_wkasqh.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1773859034/image2_wva2hf.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1773859045/image3_vfb35e.png"
        ],
        about: [
            "Valves are suitable for use with flanges conforming to BS EN 1092-2 PN16",
            "Valve to BS EN593",
            "Ductile Iron, Stainless Steel, Aluminium Bronze Disc Options",
            "EPDM and Nitrile Seat Liner Options",
            "420 Stainless Steel Shafts for superior strength"
        ],
        description: "F678L Fully Lugged Lever Operated Butterfly Valve with Ductile Iron body, EPDM liner, and Aluminium Bronze disc.",
        specs: [
            { title: "Size", text: "4\" (100mm)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "End Connnections", text: "End connections compatible with BS EN1092-2 PN16 flanges." },
            { title: "Material", text: "Ductile Iron" },
            { title: "Temperature Rating", text: "-10 to 120°C" },
            { title: "End Connections", text: "Fully Lugged, compatible with BS EN1092-2 PN16 flanges" },
            { title: "Operator", text: "Trigger Lever" }
        ],
        technical: [
            { title: "Body", text: "Ductile Iron (EN-GJS-400-15)" },
            { title: "Disc", text: "Aluminium Bronze (ASTM B148 C95400)" },
            { title: "Liner", text: "EPDM" },
            { title: "Shaft", text: "Stainless Steel 420 (ASTM A276 420)" },
            { title: "Taper Pin", text: "Stainless Steel 431 (ASTM A276 431)" },
            { title: "O-Ring", text: "Nitrile Rubber" },
            { title: "Bushing", text: "PTFE" },
            { title: "Weight", text: "7.3 kg" },
            { title: "Shell Test Pressure", text: "24 bar" },
            { title: "Seat Test Pressure", text: "17.6 bar" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0JG92987M",
        overview: "CRANE F678L 5\" BUTTERFLY VALVE PN16 DI BODY FULLY LUGGED LEVER OPERATED EPDM LINER ALUMINIUM BRONZE DISC",
        standardPrice: "591.40",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420984/Picture1_micw9q.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1773859034/image2_wva2hf.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1773859045/image3_vfb35e.png"
        ],
        about: [
            "Valves are suitable for use with flanges conforming to BS EN 1092-2 PN16",
            "Valve to BS EN593",
            "Ductile Iron, Stainless Steel, Aluminium Bronze Disc Options",
            "EPDM and Nitrile Seat Liner Options",
            "420 Stainless Steel Shafts for superior strength"
        ],
        description: "F678L Fully Lugged Lever Operated Butterfly Valve with Ductile Iron body, EPDM liner, and Aluminium Bronze disc.",
        specs: [
            { title: "Size", text: "5\" (125mm)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "End Connnections", text: "End connections compatible with BS EN1092-2 PN16 flanges." },
            { title: "Material", text: "Ductile Iron" },
            { title: "Temperature Rating", text: "-10 to 120°C" },
            { title: "End Connections", text: "Fully Lugged, compatible with BS EN1092-2 PN16 flanges" },
            { title: "Operator", text: "Trigger Lever" }
        ],
        technical: [
            { title: "Body", text: "Ductile Iron (EN-GJS-400-15)" },
            { title: "Disc", text: "Aluminium Bronze (ASTM B148 C95400)" },
            { title: "Liner", text: "EPDM" },
            { title: "Shaft", text: "Stainless Steel 420 (ASTM A276 420)" },
            { title: "Taper Pin", text: "Stainless Steel 431 (ASTM A276 431)" },
            { title: "O-Ring", text: "Nitrile Rubber" },
            { title: "Bushing", text: "PTFE" },
            { title: "Weight", text: "9.8 kg" },
            { title: "Shell Test Pressure", text: "24 bar" },
            { title: "Seat Test Pressure", text: "17.6 bar" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0JG92988N",
        overview: "CRANE F678L 6\" BUTTERFLY VALVE PN16 DI BODY FULLY LUGGED LEVER OPERATED EPDM LINER ALUMINIUM BRONZE DISC",
        standardPrice: "813.40",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420976/Picture1_drjylw.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1773859034/image2_wva2hf.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1773859045/image3_vfb35e.png"
        ],
        about: [
            "Valves are suitable for use with flanges conforming to BS EN 1092-2 PN16",
            "Valve to BS EN593",
            "Ductile Iron, Stainless Steel, Aluminium Bronze Disc Options",
            "EPDM and Nitrile Seat Liner Options",
            "420 Stainless Steel Shafts for superior strength"
        ],
        description: "F678L Fully Lugged Lever Operated Butterfly Valve with Ductile Iron body, EPDM liner, and Aluminium Bronze disc.",
        specs: [
            { title: "Size", text: "6\" (150mm)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "End Connnections", text: "End connections compatible with BS EN1092-2 PN16 flanges." },
            { title: "Material", text: "Ductile Iron" },
            { title: "Temperature Rating", text: "-10 to 120°C" },
            { title: "End Connections", text: "Fully Lugged, compatible with BS EN1092-2 PN16 flanges" },
            { title: "Operator", text: "Trigger Lever" }
        ],
        technical: [
            { title: "Body", text: "Ductile Iron (EN-GJS-400-15)" },
            { title: "Disc", text: "Aluminium Bronze (ASTM B148 C95400)" },
            { title: "Liner", text: "EPDM" },
            { title: "Shaft", text: "Stainless Steel 420 (ASTM A276 420)" },
            { title: "Taper Pin", text: "Stainless Steel 431 (ASTM A276 431)" },
            { title: "O-Ring", text: "Nitrile Rubber" },
            { title: "Bushing", text: "PTFE" },
            { title: "Weight", text: "10.7 kg" },
            { title: "Shell Test Pressure", text: "24 bar" },
            { title: "Seat Test Pressure", text: "17.6 bar" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0BA08728D",
        overview: "CRANE FM276 2.1/2\" STRAINER SS304AISI MESH WITH 1.5MM PERFORATIONS RF FLANGED DI BODY PN16",
        standardPrice: "337.70",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774377930/Screenshot_2026-01-24_082454_jtdeqa.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774377928/image1_qol3zr.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774377928/image2_xijyjp.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774377929/image3_g1je97.png"
        ],
        about: [
            "Scale and dirt in piping systems causes endless trouble and frequently serious damage to pipeline equipment.",
            "Installation of Crane strainers will help eliminate the problems caused by foreign matter within piping systems",
            "The FM276 and F277 offer the integrity of manufacture, quality and reliability which are the hallmarks of all Crane products",
            "Cap tapped and plugged for drain",
            "Stainless steel strainer element"
        ],
        description: "The Crane FM276 Strainer is a high-quality ductile iron pipeline component designed to protect equipment by filtering out dirt, scale, and other foreign particles from fluid systems. It features a durable stainless steel (SS304) mesh with 1.5 mm perforations, ensuring effective filtration and long-lasting performance. Built to PN16 pressure rating with RF flanged connections, it offers reliable operation in demanding applications.",
        features: [
            { title: "", text: "Engineered for strength and reliability, this strainer includes a tapped and plugged drain cap for easy maintenance. Suitable for a wide range of piping systems (DN50–DN300), it helps reduce damage, downtime, and maintenance costs by preventing debris from entering critical equipment." }
        ],
        bullets: [
            "Ductile iron body (PN16 rated)",
            "SS304 stainless steel mesh (1.5 mm perforation)",
            "RF flanged connections",
            "Built-in drain plug for easy cleaning",
            "Protects pipelines and equipment from debris",
            "Suitable for industrial and commercial applications"
        ],
        specs: [
            { title: "Size", text: "2.1/2\"" },
            { title: "Temperature Rating", text: "PN16" },
            { title: "Pressure Rating", text: "FM276: PN16 / F277: Class 125" },
            { title: "UK End Connection", text: "Flanged BS EN 1092-2: PN16 Raised face" },
            { title: "USA End Connection", text: "Flanged Class 125 BS1560" },
        ],
        technical: [
            { title: "Part Number", text: "0BA08728D" },
            { title: "Item Number", text: "FM276" },
            { title: "Product Name", text: "Crane FM276 2.1/2\" Strainer" },
            { title: "Type", text: "Ductile Iron Strainer" },
            { title: "Model Series", text: "FM276 / F277" },
            { title: "Size Range", text: "DN50 – DN300" },
            { title: "Connection Type", text: "RF Flanged" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Ductile Iron" },
            { title: "Strainer Element", text: "Stainless Steel (SS304)" },
            { title: "Mesh Perforation", text: "1.5 mm" },
            { title: "Drain Feature", text: "Tapped and plugged cap for drain" },
            { title: "Application", text: "Removes dirt and scale from piping systems to protect equipment" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0BA08729E",
        overview: "CRANE FM276 3\" STRAINER SS304AISI MESH WITH 1.5MM PERFORATIONS RF FLANGED DI BODY PN16",
        standardPrice: "448.60",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774377930/Screenshot_2026-01-24_082454_jtdeqa.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774377928/image1_qol3zr.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774377928/image2_xijyjp.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774377929/image3_g1je97.png"
        ],
        about: [
            "Scale and dirt in piping systems causes endless trouble and frequently serious damage to pipeline equipment.",
            "Installation of Crane strainers will help eliminate the problems caused by foreign matter within piping systems",
            "The FM276 and F277 offer the integrity of manufacture, quality and reliability which are the hallmarks of all Crane products",
            "Cap tapped and plugged for drain",
            "Stainless steel strainer element"
        ],
        description: "The Crane FM276 3” Strainer is a robust ductile iron filtration solution designed to safeguard piping systems from debris such as dirt and scale. Equipped with a high-quality SS304 stainless steel mesh featuring 1.5 mm perforations, it ensures efficient filtration and long service life. With a PN16 pressure rating and RF flanged connections, it is built for reliable performance in industrial and commercial applications.",
        features: [
            { title: "", text: "This strainer enhances system efficiency and reduces maintenance costs by preventing foreign particles from damaging critical equipment. It also includes a tapped and plugged drain cap for easy cleaning and maintenance." }
        ],
        bullets: [
            "Durable ductile iron body (PN16 rated)",
            "SS304 stainless steel mesh (1.5 mm perforation)",
            "RF flanged connections",
            "Drain plug for easy maintenance",
            "Protects pipelines and equipment from debris",
            "Suitable for DN50–DN300 systems"
        ],
        specs: [
            { title: "Type", text: "Ductile Iron Strainer" },
            { title: "Model Series", text: "FM276 / F277" },
            { title: "Body Material", text: "Ductile Iron" },
            { title: "Mesh Perforation", text: "1.5 mm" },
        ],
        technical: [
            { title: "Part Number", text: "0BA08729E" },
            { title: "Item Number", text: "FM276" },
            { title: "Product Name", text: "Crane FM276 3\" Strainer" },
            { title: "Type", text: "Ductile Iron Strainer" },
            { title: "Model Series", text: "FM276 / F277" },
            { title: "Size", text: "3 inch" },
            { title: "Size Range", text: "DN50 – DN300" },
            { title: "Connection Type", text: "RF Flanged" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Ductile Iron" },
            { title: "Strainer Element", text: "Stainless Steel (SS304)" },
            { title: "Mesh Perforation", text: "1.5 mm" },
            { title: "Drain Feature", text: "Tapped and plugged cap for drain" },
            { title: "Application", text: "Removes dirt and scale from piping systems to protect equipment" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0BA08730W",
        overview: "CRANE FM276 4\" STRAINER SS304AISI MESH WITH 1.5MM PERFORATIONS RF FLANGED DI BODY PN16",
        standardPrice: "587.40",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774377930/Screenshot_2026-01-24_082454_jtdeqa.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774377928/image1_qol3zr.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774377928/image2_xijyjp.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774377929/image3_g1je97.png"
        ],
        about: [
            "Scale and dirt in piping systems causes endless trouble and frequently serious damage to pipeline equipment.",
            "Installation of Crane strainers will help eliminate the problems caused by foreign matter within piping systems",
            "The FM276 and F277 offer the integrity of manufacture, quality and reliability which are the hallmarks of all Crane products",
            'Cap tapped and plugged for drain',
            "Stainless steel strainer element"
        ],
        description: "The Crane FM276 4” Strainer is a heavy-duty ductile iron filtration unit designed to protect piping systems and equipment from harmful debris such as dirt and scale. It features a high-performance SS304 stainless steel mesh with 1.5 mm perforations, ensuring efficient filtration and durability. With a PN16 pressure rating and RF flanged connections, it delivers reliable performance in demanding industrial and commercial environments.",
        features: [
            { title: "", text: "Built for long-term reliability, this strainer helps minimize maintenance costs and system downtime by preventing foreign particles from entering critical components. It also includes a tapped and plugged drain cap for easy cleaning and maintenance." }
        ],
        specs: [
            { title: "Type", text: "Ductile Iron Strainer" },
            { title: "Model Series", text: "FM276 / F277" },
            { title: "Size", text: "4 inch" },
            { title: "Size Range", text: "DN50 – DN300" },
            { title: "Body Material", text: "Ductile Iron" },
        ],
        technical: [
            { title: "Part Number", text: "0BA08730W" },
            { title: "Item Number", text: "FM276" },
            { title: "Product Name", text: "Crane FM276 4\" Strainer" },
            { title: "Type", text: "Ductile Iron Strainer" },
            { title: "Model Series", text: "FM276 / F277" },
            { title: "Size", text: "4 inch" },
            { title: "Size Range", text: "DN50 – DN300" },
            { title: "Connection Type", text: "RF Flanged" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Ductile Iron" },
            { title: "Strainer Element", text: "Stainless Steel (SS304)" },
            { title: "Mesh Perforation", text: "1.5 mm" },
            { title: "Drain Feature", text: "Tapped and plugged cap for drain" },
            { title: "Application", text: "Removes dirt and scale from piping systems to protect equipment" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0BA08731X",
        overview: "CRANE FM276 5\" STRAINER SS304AISI MESH WITH 1.5MM PERFORATIONS RF FLANGED DI BODY PN16",
        standardPrice: "891.40",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774377930/Screenshot_2026-01-24_082454_jtdeqa.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774377928/image1_qol3zr.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774377928/image2_xijyjp.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774377929/image3_g1je97.png"
        ],
        about: [
            "Scale and dirt in piping systems causes endless trouble and frequently serious damage to pipeline equipment.",
            "Installation of Crane strainers will help eliminate the problems caused by foreign matter within piping systems",
            "The FM276 and F277 offer the integrity of manufacture, quality and reliability which are the hallmarks of all Crane products",
            "Cap tapped and plugged for drain",
            "Stainless steel strainer element"
        ],
        description: "The Crane FM276 Ductile Iron Strainer is a high-performance solution designed to protect piping systems from the endless trouble and serious damage caused by scale and dirt. Part of the renowned Crane Fluid Systems line, the FM276 offers exceptional manufacturing integrity and reliability",
        bullets: [
            "This 5\" strainer features a robust Ductile Iron (BS EN 1563 EN-GJS-450-10) body and cap with a PN16 pressure rating.",
            "It is equipped with a Stainless Steel AISI Type 304 mesh screen featuring 1.5mm perforations to effectively filter foreign matter.",
            "For ease of maintenance, the unit includes a cap that is tapped and plugged for drainage.",
            "Designed for versatility, it features RF Flanged end connections and is suitable for use on Group 2 liquids."
        ],
        specs: [
            {
                title: "Type",
                text: "Ductile Iron Strainer"
            },
            {
                title: "Model Series",
                text: "FM276 / F277"
            },
            {
                title: "Size",
                text: "5 inch (DN125)"
            },
            {
                title: "Size Range",
                text: "DN50 – DN300"
            },
            {
                title: "Pressure Rating",
                text: "PN16"
            },
        ],
        technical: [
            {
                title: "Part Number",
                text: "0BA08731X"
            },
            {
                title: "Item Number",
                text: "FM276"
            },
            {
                title: "Product Name",
                text: "Crane FM276 5\" Strainer SS304AISI Mesh with 1.5mm Perforations RF Flanged DI Body PN16"
            },
            {
                title: "Type",
                text: "Ductile Iron Strainer"
            },
            {
                title: "Model Series",
                text: "FM276 / F277"
            },
            {
                title: "Size",
                text: "5 inch (DN125)"
            },
            {
                title: "Size Range",
                text: "DN50 – DN300"
            },
            {
                title: "Connection Type",
                text: "UK: Flanged BS EN 1092-2: PN16 Raised Face; US: Flanged Class 125 BS1560 - Section 3.2/ ANSI B16.1 Flat Face"
            },
            {
                title: "Pressure Rating",
                text: "PN16"
            },
            {
                title: "Body Material",
                text: "Ductile Iron BS EN 1563 EN-GJS-450-10"
            },
            {
                title: "Strainer Element",
                text: "Stainless Steel AISI Type 304"
            },
            {
                title: "Mesh Perforation",
                text: "1.5mm diameter"
            },
            {
                title: "Drain Feature",
                text: "Cap tapped and plugged for drain (2\" Rc for 5\" size)"
            },
            {
                title: "Application",
                text: "Removes dirt and scale from piping systems to protect equipment"
            },
            {
                title: "Temperature Range",
                text: "-10 to 200°C"
            },
            {
                title: "Weight",
                text: "37 kg"
            }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0BA08732Y",
        overview: "CRANE FM276 6\" STRAINER SS304AISI MESH WITH 1.5MM PERFORATIONS RF FLANGED DI BODY PN16",
        standardPrice: "1,244.60 ",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774377930/Screenshot_2026-01-24_082454_jtdeqa.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774377928/image1_qol3zr.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774377928/image2_xijyjp.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774377929/image3_g1je97.png"
        ],
        about: [
            "Scale and dirt in piping systems causes endless trouble and frequently serious damage to pipeline equipment.",
            "Installation of Crane strainers will help eliminate the problems caused by foreign matter within piping systems",
            "The FM276 and F277 offer the integrity of manufacture, quality and reliability which are the hallmarks of all Crane products",
            "Cap tapped and plugged for drain",
            "Stainless steel strainer element",
        ],
        description: "The Crane FM276 Ductile Iron Strainer is an essential component designed to protect pipeline equipment by eliminating problems caused by foreign matter, such as scale and dirt. This 6\" (DN150) model features a robust Ductile Iron body and cap, ensuring the high manufacture quality and reliability associated with Crane products.",
        bullets: [
            "It is equipped with a Stainless Steel AISI Type 304 strainer element with 1.5mm perforations for effective filtration.",
            "The design includes a cap that is tapped and plugged for easy drainage.",
            "Built for high-pressure environments, it carries a PN16 rating and is suitable for use with Group 2 liquids."
        ],
        specs: [
            { title: "Type", text: "Ductile Iron Strainer" },
            { title: "Model Series", text: "FM276 / F277" },
            { title: "Size", text: "6 inch (DN150)" },
            { title: "Size Range", text: "DN50 – DN300" },
            { title: "Mesh Perforation", text: "1.5 mm" },
            { title: "Temperature Range", text: "-10 to 200°C" },
        ],
        technical: [
            { title: "Part Number", text: "0BA08732Y" },
            { title: "Item Number", text: "FM276" },
            { title: "Product Name", text: "Crane FM276 6\" Strainer SS304AISI Mesh with 1.5mm Perforations RF Flanged DI Body PN16" },
            { title: "Type", text: "Ductile Iron Strainer" },
            { title: "Model Series", text: "FM276 / F277" },
            { title: "Size", text: "6 inch (DN150)" },
            { title: "Size Range", text: "DN50 – DN300" },
            { title: "Connection Type", text: "RF Flanged (BS EN 1092-2: PN16 Raised Face)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Ductile Iron (BS EN 1563 EN-GJS-450-10)" },
            { title: "Strainer Element", text: "Stainless Steel (AISI Type 304)" },
            { title: "Mesh Perforation", text: "1.5 mm" },
            { title: "Drain Feature", text: "Tapped and plugged cap for drain (2\" Rc)" },
            { title: "Application", text: "Removes dirt and scale from piping systems to protect equipment" },
            { title: "Temperature Range", text: "-10 to 200°C" },
            { title: "Weight", text: "50 kg" },
            { title: "Flow Coefficient (kv)", text: "356" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0EA02500F",
        overview: "CRANE D151 1.1/2\" GATE VALVE HANDWHEEL OPERATED BRONZE BODY & DISC WRAS BSPT PN20",
        standardPrice: "154.90",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774378673/526554a2-2614-41aa-96d4-851af7cfa51d_c3iym0.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774378675/image1_lof2o9.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774378676/image2_mewdml.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774378679/image3_tr2vpv.png"
        ],
        about: [
            "Crane gate valves offer the ultimate in dependable service wherever minimum pressure drop is important",
            "The D151 carries the British Standards Institution kitemark - your assurance of exacting quality standards",
            "WRAS approved for use on wholesome (potable) water in sizes 1/2\" - 2\" only. WRAS approval temperature 85°C max",
            "Non-rising stem design to minimise installation height",
            "Full bore design to ensure minimal pressure drop",
            "Adjustable gland packing for ease of maintenance",
            "Body, bonnet and disc are made from low lead content bronze, typically 4-6%",
            "Conforms with BS EN12288:2010 and generally conforms with MSS SP 80"
        ],
        description: "The Crane D151 Bronze Gate Valve is a high-quality, handwheel-operated valve designed for dependable service where minimum pressure drop is essential. This 1.1/2\" valve features a non-rising stem design to minimize installation height and a full bore to ensure optimal flow efficiency.",
        bullets: [
            "Constructed with a bronze body, bonnet, and disc (low lead content, typically 4-6%).",
            "It conforms to BS EN 12288:2010 standards and carries the British Standards Institution kitemark for quality assurance.",
            "This model is WRAS approved for use with potable water up to 85°C and is rated for pressures up to PN20.",
            "It is best suited for services requiring infrequent operation where the disc is either fully opened or fully closed."
        ],
        specs: [
            { title: "Type", text: "Bronze Gate Valve (Non-rising stem)" },
            { title: "Model Series", text: "D151" },
            { title: "Size", text: "1.1/2 inch" },
            { title: "Size Range", text: "1/4\" to 4\"" },
            { title: "Pressure Rating", text: "PN20" },
            { title: "Operator", text: "Handwheel (Aluminium)" },
        ],
        technical: [
            { title: "Part Number", text: "0EA02500F" },
            { title: "Item Number", text: "D151" },
            { title: "Product Name", text: "CRANE D151 1.1/2\" GATE VALVE HANDWHEEL OPERATED BRONZE BODY & DISC WRAS BSPT PN20" },
            { title: "Type", text: "Bronze Gate Valve (Non-rising stem)" },
            { title: "Model Series", text: "D151" },
            { title: "Size", text: "1.1/2 inch" },
            { title: "Size Range", text: "1/4\" to 4\"" },
            { title: "Connection Type", text: "Taper threaded to BS EN 10226-2 (ISO 7-1)" },
            { title: "Pressure Rating", text: "PN20" },
            { title: "Body Material", text: "Bronze BS EN 1982 CC491K" },
            { title: "Disc/Wedge", text: "Solid Wedge, Bronze BS EN 1982 CC491K" },
            { title: "Stem Material", text: "DZR Brass BS EN 12164 CW602N" },
            { title: "Operator", text: "Handwheel (Aluminium)" },
            { title: "Application", text: "Wholesome (potable) water, Group 2 Gas, Group 1 & 2 Liquids" },
            { title: "Temperature Range", text: "-10 to 180°C (WRAS max 85°C)" },
            { title: "Weight", text: "1.266 kg" },
            { title: "Standards Compliance", text: "BS EN 12288:2010, MSS SP 80, WRAS Approved, BSI Kitemark" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0EA02501G",
        overview: "CRANE D151 2\" GATE VALVE HANDWHEEL OPERATED BRONZE BODY & DISC WRAS BSPT PN20",
        standardPrice: "233.30",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774378673/526554a2-2614-41aa-96d4-851af7cfa51d_c3iym0.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774378675/image1_lof2o9.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774378676/image2_mewdml.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774378679/image3_tr2vpv.png"
        ],
        about: [
            "Crane gate valves offer the ultimate in dependable service wherever minimum pressure drop is important",
            "The D151 carries the British Standards Institution kitemark - your assurance of exacting quality standards",
            "WRAS approved for use on wholesome (potable) water in sizes 1/2\" – 2\" only. WRAS approval temperature 85°C max",
            "Non-rising stem design to minimise installation height",
            "Full bore design to ensure minimal pressure drop",
            "Adjustable gland packing for ease of maintenance",
            "Body, bonnet and disc are made from low lead content bronze, typically 4-6%",
            "Conforms with BS EN12288:2010 and generally conforms with MSS SP 80"
        ],
        description: "The Crane D151 Bronze Gate Valve provides ultimate dependable service in systems where minimal pressure drop is a priority. This 2\" (DN50) model features a non-rising stem to reduce installation height and a full bore design for maximum flow efficiency.",
        bullets: [
            "The valve is constructed with a high-quality bronze body, bonnet, and disc (low lead content, 4-6%).",
            "It is WRAS approved for potable water applications up to 85°C and carries a PN20 pressure rating.",
            "Designed for longevity, it includes adjustable gland packing and is best suited for infrequent operation where the valve remains either fully open or fully closed.",
            "It conforms to BS EN 12288:2010 and is suitable for Group 2 Gas and Group 1 & 2 Liquids."
        ],
        specs: [
            { title: "Type", text: "Bronze Gate Valve (Non-rising stem)" },
            { title: "Model Series", text: "D151" },
            { title: "Size", text: "2 inch" },
            { title: "Size Range", text: "1/4\" to 4\"" },
            { title: "Operator", text: "Handwheel (Aluminium)" },
        ],
        technical: [
            { title: "Part Number", text: "0EA02501G" },
            { title: "Item Number", text: "D151" },
            { title: "Product Name", text: "CRANE D151 2\" GATE VALVE HANDWHEEL OPERATED BRONZE BODY & DISC WRAS BSPT PN20" },
            { title: "Type", text: "Bronze Gate Valve (Non-rising stem)" },
            { title: "Model Series", text: "D151" },
            { title: "Size", text: "2 inch" },
            { title: "Size Range", text: "1/4\" to 4\"" },
            { title: "Connection Type", text: "Taper threaded to BS EN 10226-2 (ISO 7-1)" },
            { title: "Pressure Rating", text: "PN20" },
            { title: "Body Material", text: "Bronze BS EN 1982 CC491K" },
            { title: "Disc/Wedge", text: "Solid Wedge, Bronze BS EN 1982 CC491K" },
            { title: "Stem Material", text: "DZR Brass BS EN 12164 CW602N" },
            { title: "Operator", text: "Handwheel (Aluminium)" },
            { title: "Application", text: "Wholesome (potable) water, Group 2 Gas, Group 1 & 2 Liquids" },
            { title: "Temperature Range", text: "-10 to 180°C (WRAS max 85°C)" },
            { title: "Weight", text: "1.881 kg" },
            { title: "Standards Compliance", text: "BS EN 12288:2010, MSS SP 80, WRAS Approved, BSI Kitemark" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0JG25077F",
        overview: "CRANE D931 1/2\" FIXED ORIFICE DOUBLE REGULATING VALVE(FODRV) WITH TEST POINT P84 BRONZE BODY WRAS BSPP PN25",
        standardPrice: "179.50",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774378852/86e5acc1-54cc-424e-b9b3-73719f500ff3_hdhblm.png"
        ],
        about: [
            "Precise flow regulation and measurement with ± 5% accuracy.",
            "Double regulating feature saves pre-set flow positions after isolation.",
            "Characterized throttling disc for equal percentage flow performance.",
            "Robust bronze body construction with WRAS approval for potable water.",
            "Includes P84 insertion test points and micro-set handwheel for easy operation"
        ],
        description: "The Double Regulating feature allows the valve to be used for isolation and to be reopened to its pre-set position to maintain required flow rate. Y-Pattern globe valves having characterized throttling disc tending towards equal percentage performance.",
        bullets: [
            "D933 size 1/2″ low flow FODRV combines the functions of regulation and flow measurement in a unit of high authority making it particularly suitable for low flow applications in the range of 0.03 to 0.07 I/s",
            "D934 size 1/2″ ultra-low flow FODRV combines the functions of regulation and flow measurement in a unit of high authority making it particularly suitable for ultra-low flow applications in the range of 0.016 to 0.04 I/s",
            "The Double regulating valve, with its integral fixed orifice design offers an accuracy of ± 5% on all settings, for precise flow regulation and measurement",
            "The Double Regulating feature allows the valve to be used for isolation and to be reopened to its pre-set position to maintain required flow rate",
            "Y-Pattern globe valves having characterized throttling disc tending towards equal percentage performance",
            "Integral square edged entrance orifice plate and P84 insertion test points fitted Double regulating feature allows valve opening to be set with an Allen key",
            "Operation of the valve is by means of the Micro set handwheel."
        ],
        specs: [
            { title: "Type", text: "Fixed Orifice Double Regulating Valve (FODRV)" },
            { title: "Model Series", text: "D931" },
            { title: "Size", text: "1/2 inch" },
            { title: "Connection Type", text: "BSPP" },
            { title: "Pressure Rating", text: "PN25" },
            { title: "Body Material", text: "Bronze" },
        ],
        technical: [
            { title: "Part Number", text: "0JG25077F" },
            { title: "Item Number", text: "D931" },
            { title: "Product Name", text: "CRANE D931 1/2\" FIXED ORIFICE DOUBLE REGULATING VALVE(FODRV) WITH TEST POINT P84 BRONZE BODY WRAS BSPP PN25" },
            { title: "Type", text: "Fixed Orifice Double Regulating Valve (FODRV)" },
            { title: "Model Series", text: "D931" },
            { title: "Size", text: "1/2 inch" },
            { title: "Connection Type", text: "BSPP" },
            { title: "Pressure Rating", text: "PN25" },
            { title: "Body Material", text: "Bronze" },
            { title: "Flow Characterization", text: "Y-Pattern globe with equal percentage performance" },
            { title: "Measurement Accuracy", text: "± 5% on all settings" },
            { title: "Test Points", text: "P84 insertion test points fitted" },
            { title: "Operator", text: "Micro-set handwheel" },
            { title: "Application", text: "Regulation, flow measurement, and isolation in piping systems" },
            { title: "Standards Compliance", text: "WRAS Approved" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0JG25078G",
        overview: "CRANE D931 3/4\" FIXED ORIFICE DOUBLE REGULATING VALVE(FODRV) WITH TEST POINT P84 BRONZE BODY WRAS BSPP PN25",
        standardPrice: "205.4",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774378852/86e5acc1-54cc-424e-b9b3-73719f500ff3_hdhblm.png"
        ],
        about: [
            "Offers an accuracy of ±5% on all settings for precise flow regulation and measurement.",
            "Features a built-in fixed orifice to facilitate accurate flow measurement within heating, cooling, and water systems.",
            "Certified by WRAS, ensuring the valve is suitable for use in wholesome water applications.",
            "Built with a durable bronze body designed to withstand a maximum working pressure of 25 bar.",
            "Designed in accordance with BS 7350:1990 standards to meet exacting quality and performance requirements.",
            "Comes fully equipped with test points to allow for easy system monitoring and balancing."
        ],
        description: "3/4\" BSP Parallel Crane D931 Bronze Fixed Orifice Double Regulating Valve, Crane Huge Savings! Available for a limited time - while stock lasts",
        bullets: [
            "BSPP threads up to 3/4\" and BSPT threads for 1",
            "Integral fixed orifice design. WRAS approved",
            "Design in accordance to BS 7350:1990",
            "Offers an accuracy of ±5% on all settings",
            "Comes complete with test points",
            "For use in heating and cooling systems and other water systems."
        ],
        specs: [
            { title: "Brand", text: "Crane" },
            { title: "Size", text: "3/4\"" },
            { title: "Body Material", text: "Bronze" },
            { title: "End Connection", text: "BSPP" },
        ],
        technical: [
            { title: "Size", text: "3/4\"" },
            { title: "Maximum Working Pressure bar", text: "25" },
            { title: "Body Material", text: "Bronze" },
            { title: "End Connection", text: "BSPP" },
            { title: "Brand", text: "Crane" },
            { title: "Flow Kv", text: "3.14" },
            { title: "Design", text: "Fixed Orifice" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0JG25079H",
        overview: "CRANE D931 1\" FIXED ORIFICE DOUBLE REGULATING VALVE(FODRV) WITH TEST POINT P84 BRONZE BODY WRAS BSPT PN25",
        standardPrice: "241",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774378852/86e5acc1-54cc-424e-b9b3-73719f500ff3_hdhblm.png"
        ],
        about: [
            "Precision and Accuracy: Delivers a high level of accuracy with +/-5% on all settings for precise flow regulation and measurement.",
            "Features a built-in fixed orifice design that simplifies set-up and reduces installation costs by requiring fewer connections.",
            "Allows the valve to be used for isolation and then reopened to a specific pre-set position, maintaining the required flow rate.",
            "Certified for use in wholesome water applications, ensuring compliance with safety standards.",
            "Built with a robust bronze body rated for PN25 pressure and temperatures ranging from 10 to 120°C.",
            "Designed with 1\" taper threaded end connections conforming to BS EN 10226-2 (ISO 7-1)."
        ],
        description: "The bronze commissioning range offers accuracy of +/-5% on all settings. The integral fixed orifice design offers greater accuracy, makes set-up easier and involves fewer connections resulting in lower installation costs.",
        bullets: [
            "Fixed Orifice Double regulating valve complete with Press-Fit connectors",
            "Provides precise and accurate flow regulation & measurement",
            "Supplied as one integral unit means less joints to make on-site",
            "The performance, exact dimensions & tolerances are known in advance",
            "Incorporates both Crane Fluid Systems and proven Geberit Mapress technology",
            "Vibration tested to DVGW and bend tested to BS EN331",
            "Quickly and easily installed using a Press-Fit tool (supplied by others)",
        ],
        specs: [
            { title: "Brand", text: "Crane" },
            { title: "Pressure Rating", text: "PN25" },
            { title: "Material", text: "Bronze" },
        ],
        technical: [
            { title: "Size", text: "DN15 to DN50" },
            { title: "Pressure Rating", text: "PN25" },
            { title: "Temperature Rating", text: "10 - 120°C" },
            { title: "End Connections", text: "Sizes 1\" to 2\" taper threaded to BS EN 10226-2 (ISO 7-1) formerly BS 21 & Sizes 1/2\" & 3/4\" DN15 & DN20 BS 2779 (ISO 228) parallel." },
            { title: "Material", text: "Bronze" },
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0JG25080A",
        overview: "CRANE D931 1.1/4\" FIXED ORIFICE DOUBLE REGULATING VALVE(FODRV) WITH TEST POINT P84 BRONZE BODY WRAS BSPT PN25",
        standardPrice: "286.50",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774378852/86e5acc1-54cc-424e-b9b3-73719f500ff3_hdhblm.png"
        ],
        about: [
            "Delivers a precision of ±5% on all settings for reliable flow measurement and regulation.",
            "Features a built-in orifice design that ensures accuracy and simplifies system setup with fewer required connections.",
            "Includes a mechanism that allows the valve to be used for isolation and then returned to its exact pre-set balancing position.",
            "Certified for use in wholesome and potable water systems, meeting strict safety and quality standards.",
            "Manufactured with a durable bronze body rated for PN25 pressure and suitable for heating and cooling applications.",
            "Designed in accordance with BS 7350:1990 and equipped with P84 insertion test points for easy monitoring."
        ],
        description: "1.1/4\" BSP Taper Crane D931 Bronze Fixed Orifice Double Regulating Valve, Crane Huge Savings! Available for a limited time - while stock lasts",
        bullets: [
            "BSPP threads up to 3/4\" and BSPT threads for 1\"",
            "Integral fixed orifice design",
            "WRAS approved",
            "Design in accordance to BS 7350:1990",
            "Offers an accuracy of ±5% on all settings",
            "Comes complete with test points",
            "For use in heating and cooling systems and other water systems"
        ],
        specs: [
            { title: "Brand", text: "Crane" },
            { title: "Size", text: "1.1/4\"" },
            { title: "End Connection", text: "BSPT" },
            { title: "Design", text: "Fixed Orifice" }
        ],
        technical: [
            { title: "Maximum Working Pressure bar", text: "25" },
            { title: "Body Material", text: "Bronze" },
            { title: "Size", text: "1.1/4\"" },
            { title: "Flow Kv", text: "10.8" },
            { title: "End Connection", text: "BSPT" },
            { title: "Brand", text: "Crane" },
            { title: "Design", text: "Fixed Orifice" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0JG25081B",
        overview: "CRANE D931 1.1/2\" FIXED ORIFICE DOUBLE REGULATING VALVE(FODRV) WITH TEST POINT P84 BRONZE BODY WRAS BSPT PN25",
        standardPrice: "366.3",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774379528/37afbbb6-d1f4-442e-b2e9-93f97cdfa599_tjlztb.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774379530/image1_fe9rs8.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774379534/image2_qtu9kp.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774379538/image3_k6uvxr.png"
        ],
        about: [
            "Offers a precision of ±5% on all settings for highly accurate flow regulation and measurement.",
            "Allows the valve to be used for isolation and then reopened to its exact pre-set balancing position.",
            "Features a Y-pattern globe design with a characterized throttling disc for equal percentage performance.",
            "The integral fixed orifice design requires fewer connections, reducing potential leak points and installation costs.",
            "Equipped with P84 insertion test points and a micro-set handwheel for easy operation and system monitoring.",
            "Certified for use in wholesome water applications, ensuring compliance with safety standards."
        ],
        features: [
            { title: "End Connections", text: "Sizes 1\" to 2\" taper threaded to BS EN 10226-2 (ISO 7-1) formerly BS 21. Sizes 1/2\" & 3/4\" DN15 & DN20 BS 2779 (ISO 228) parallel. Adaptor kits for use with copper tube also available. Also available threaded to ANSI B1.20.1AT. Order code D931AT/D933AT/D934AT" }
        ],
        bullets: [
            "D933 size 1/2\" low flow FODRV combines the functions of regulation and flow measurement in a unit of high authority making it particularly suitable for low flow applications in the range of 0.03 to 0.07 I / s",
            "D934 size 1/2\" ultra- low flow FODRV combines the functions of regulation and flow measurement in a unit of high authority making it particularly suitable for ultra - low flow applications in the range of 0.016 to 0.04 I / s.",
            "The Double regulating valve, with its integral fixed orifice design offers an accuracy of ± 5% on all settings, for precise flow regulation and measurement",
            "The Double Regulating feature allows the valve to be used for isolation and to be reopened to its pre-set position to maintain required flow rate",
            "Y-Pattern globe valves having characterised throttling disc tending towards equal percentage performance",
            "Integral square edged entrance orifice plate and P84 insertion test points fitted Double regulating feature allows valve opening to be set with an Allen key",
            "Operation of the valve is by means of the Micro set handwheel"
        ],
        specs: [
            { title: "Type", text: "Fixed Orifice Double Regulating Valve (FODRV)" },
            { title: "Model Series", text: "D931 / D933 / D934" },
            { title: "Size", text: "1.1/2 inch" },
            { title: "Pressure Rating", text: "PN25" },
            { title: "Body Material", text: "Bronze" },
        ],
        technical: [
            { title: "Part Number", text: "0JG25081B" },
            { title: "Item Number", text: "D931" },
            { title: "Product Name", text: "CRANE D931 1.1/2\" FIXED ORIFICE DOUBLE REGULATING VALVE(FODRV) WITH TEST POINT P84 BRONZE BODY WRAS BSPT PN25" },
            { title: "Type", text: "Fixed Orifice Double Regulating Valve (FODRV)" },
            { title: "Model Series", text: "D931 / D933 / D934" },
            { title: "Size", text: "1.1/2 inch" },
            { title: "Connection Type", text: "Taper threaded to BS EN 10226-2 (ISO 7-1)" },
            { title: "Pressure Rating", text: "PN25" },
            { title: "Body Material", text: "Bronze" },
            { title: "Accuracy", text: "± 5% on all settings" },
            { title: "Operator", text: "Micro-set handwheel" },
            { title: "Application", text: "Flow regulation, measurement, and isolation" },
            { title: "Standards Compliance", text: "Conforms to BS 7350:1990; WRAS Approved" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0JG25082C",
        overview: "CRANE D931 2\" FIXED ORIFICE DOUBLE REGULATING VALVE(FODRV) WITH TEST POINT P84 BRONZE BODY WRAS BSPT PN25",
        standardPrice: "454.3",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774379630/56015dc0-d937-44ee-ac7d-9dfc4a840c21_wbaipq.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774379625/7da5a491-61f1-4270-a9c0-a17f5448ee2a_r7v34h.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774379622/d7dea4fe-f6d5-4875-bb97-92970e6dc93f_ax8v47.png"
        ],
        about: [
            "Delivers a precision of ±5% on all settings for reliable flow measurement and regulation.",
            "Allows the valve to be used for isolation and then returned to its exact pre-set balancing position to maintain the required flow rate.",
            "Features a built-in orifice design that ensures accuracy, simplifies system setup, and reduces installation costs by requiring fewer connections.",
            "Certified for use in wholesome and potable water systems, meeting strict safety and quality standards.",
            "Utilizes a Y-pattern globe design with a characterized throttling disc for equal percentage performance.",
            "Manufactured with a durable bronze body rated for PN25 pressure and temperatures ranging from -10 to 120°C.",
            "Comes complete with P84 insertion test points and a micro-set handwheel for easy operation and system balancing."
        ],
        description: "The bronze commissioning range offers accuracy of +/-5% on all settings. The integral fixed orifice design offers greater accuracy, makes set-up easier and involves fewer connections resulting in lower installation costs.",
        bullets: [
            "Fixed Orifice Double regulating valve complete with Press-Fit connectors",
            "Provides precise and accurate flow regulation & measurement",
            "Supplied as one integral unit means less joints to make on-site",
            "The performance, exact dimensions & tolerances are known in advance",
            "Incorporates both Crane Fluid Systems and proven Geberit Maprers technology",
            "Vibration tested to DVGW and bend tested to BS EN331",
            "Quickly and easily installed using a Press-Fit tool (supplied by others)"
        ],
        specs: [
            { title: "Brand", text: "Crane" },
            { title: "Material", text: "Bronze" },
            { title: "Size", text: "DN15 to DN50" },
            { title: "Pressure rating", text: "PN25" },
            { title: "Temperature Rating", text: "-10 - 120°C" },
        ],
        technical: [
            { title: "Size", text: "DN15 to DN50" },
            { title: "Pressure rating", text: "PN25" },
            { title: "Temperature Rating", text: "-10 - 120°C" },
            { title: "End Connections", text: "Sizes 1\" to 2\" taper threaded to BS EN 10226-2 (ISO 7-1) formerly BS 21.Sizes 1/2\" & 3/4\" DN15 & DN20 BS 2779 (ISO 228) parallel" },
            { title: "Material", text: "Bronze" },
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0JG90603W",
        overview: "CRANE DM931 2.1/2\" VARIABLE ORIFICE DOUBLE REGULATING VALVE(VODRV) RF FLANGED Y-PATTERN WITH TEST POINT P84 PN16",
        standardPrice: "767.40",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774379767/ChatGPT_Image_Jan_24_2026_11_03_57_AM_tolkax.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774379778/image_rpnm2u.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774379772/image2_g0zzwc.png"
        ],
        about: [
            "Y-Pattern globe valves designed to provide precise flow measurement, regulation, and isolation in a single unit.",
            "Enables the valve to be used for isolation and then reopened to its exact pre-set balancing position to maintain the required flow rate.",
            "Features a flow measurement accuracy of ±10% at the fully open position, conforming to BS 7350: 1990 standards.",
            "Supplied with two P84 pressure test points, making it ideal for injection circuits and other systems requiring balancing.",
            "Features RF flanged ends to BS EN 1092-2, providing a secure and reliable connection for high-pressure industrial applications.",
            "Primarily used in systems requiring a double regulating valve to ensure consistent system balancing and performance."
        ],
        features: [
            { title: "End Connections", text: "DM931 Ends are flanged to BS EN 1092-2 (formerly BS 4504) and DA931 Ends are flanged to ANSI B16.1 Class 125" }
        ],
        bullets: [
            "These are Y-Pattern globe valves supplied with two pressure test points P84 to provide flow measurement, regulation and isolation",
            "The Double Regulating feature allows the valve to be used for isolation and to be reopened to its pre-set position to maintain required flow rate",
            "Primarily used in injection or other circuits requiring a double regulating valve for system balancing",
            "Accuracy of flow measurement is ±10% at the full open position of the valve",
            "Some reduction in accuracy occurs at partial openings of the valve in accordance with BS 7350"
        ],
        specs: [
            { title: "Type", text: "Variable Orifice Double Regulating Valve (VODRV)" },
            { title: "Model Series", text: "DM931 / DA931" },
            { title: "Size", text: "2.1/2 inch" },
            { title: "Pressure Rating", text: "PN16" },
        ],
        technical: [
            { title: "Part Number", text: "0JG90603W" },
            { title: "Item Number", text: "DM931" },
            { title: "Product Name", text: "CRANE DM931 2.1/2\" VARIABLE ORIFICE DOUBLE REGULATING VALVE(VODRV) RF FLANGED Y-PATTERN WITH TEST POINT P84 PN16" },
            { title: "Type", text: "Variable Orifice Double Regulating Valve (VODRV)" },
            { title: "Model Series", text: "DM931 / DA931" },
            { title: "Size", text: "2.1/2 inch" },
            { title: "Connection Type", text: "Flanged to BS EN 1092-2 (formerly BS 4504)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Ductile Iron / Bronze (Y-Pattern Globe)" },
            { title: "Accuracy", text: "±10% at full open position" },
            { title: "Test Points", text: "Two P84 pressure test points fitted" },
            { title: "Application", text: "Flow measurement, regulation, and isolation; specifically for system balancing" },
            { title: "Standards Compliance", text: "Conforms to BS 7350: 1990" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0JG90604X",
        overview: "CRANE DM931 3\" VARIABLE ORIFICE DOUBLE REGULATING VALVE(VODRV) RF FLANGED Y-PATTERN WITH TEST POINT P84 PN16",
        standardPrice: "1026.6",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774379834/76622dc5-9720-4174-9b86-47793945ca87_damytn.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774379823/8689bce9-1c27-4609-a706-4e18f1c37d79_bfp17m.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774379840/bd101c3e-d913-489c-a848-d103a7f2c87d_jtr0xv.png"
        ],
        about: [
            "Integrated Y-Pattern globe valve design providing precise flow measurement, regulation, and isolation in a single unit.",
            "Allows the valve to be closed for isolation and then reopened to its exact pre-set balancing position to maintain consistent system flow.",
            "Specifically designed for use in injection or other circuits requiring a double regulating valve for accurate system balancing.",
            "Provides a flow measurement accuracy of ±10% at the full open position, in accordance with BS 7350 standards.",
            "Built with a robust ductile iron body rated for PN16 pressure and temperatures ranging from -10 to 120°C.",
            "Features RF flanged end connections for secure and reliable installation in high-capacity piping systems.",
            "Supplied with two P84 pressure test points to facilitate easy and accurate system monitoring.",
        ],
        bullets: [
            "These are Y-Pattern globe valves supplied with two pressure test points P84 to provide flow measurement, regulation and isolation",
            "The Double Regulating feature allows the valve to be used for isolation and to be reopened to its pre-set position to maintain required flow rate",
            "Primarily used in injection or other circuits requiring a double regulating valve for system balancing",
            "Accuracy of flow measurement is ±10% at the full open position of the valve",
            "Some reduction in accuracy occurs at partial openings of the valve in accordance with BS 7350"
        ],
        specs: [
            { title: "Brand", text: "Crane" },
            { title: "Size", text: "DN65 to DN300" },
            { title: "Pressure rating", text: "PN16" },
            { title: "Temperature Rating", text: "10 - 120°C" },
            { title: "Material", text: "Ductile Iron" }
        ],
        technical: [
            { title: "Size", text: "DN65 to DN300" },
            { title: "Pressure rating", text: "PN16" },
            { title: "Flow rate", text: "Please see Flow Measurement Graphs" },
            { title: "Temperature Rating", text: "10 - 120°C" },
            { title: "End Connection", text: "Flanged" },
            { title: "Material", text: "Ductile Iron" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0JG90605Y",
        overview: "CRANE DM931 4\" VARIABLE ORIFICE DOUBLE REGULATING VALVE(VODRV) RF FLANGED Y-PATTERN WITH TEST POINT P84 PN16",
        standardPrice: "",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774379834/76622dc5-9720-4174-9b86-47793945ca87_damytn.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774379823/8689bce9-1c27-4609-a706-4e18f1c37d79_bfp17m.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774379840/bd101c3e-d913-489c-a848-d103a7f2c87d_jtr0xv.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774379985/image_pqulzr.png"
        ],
        about: [
            "Y-Pattern globe valve designed to provide accurate flow measurement, regulation, and isolation in one compact unit.",
            "Features a mechanism that allows the valve to be used for isolation and then reopened to its exact pre-set balancing position.",
            "Ideally suited for injection circuits or other systems that require a double regulating valve to maintain consistent system balancing.",
            "Offers a flow measurement accuracy of ±10% at the fully open position, strictly conforming to BS 7350: 1990 requirements.",
            "Constructed with a high-strength ductile iron body featuring RF flanged ends to BS EN 1092-2 (formerly BS 4504).",
            "Supplied with two P84 pressure test points to facilitate quick and accurate system monitoring and data collection."
        ],
        features: [
            { title: "End Connections", text: "DM931 Ends are flanged to BS EN 1092-2 (formerly BS 4504) and DA931 Ends are flanged to ANSI B16.1 Class 125" }
        ],
        bullets: [
            "These are Y-Pattern globe valves supplied with two pressure test points P84 to provide flow measurement, regulation and isolation",
            "The Double Regulating feature allows the valve to be used for isolation and to be reopened to its pre-set position to maintain required flow rate",
            "Primarily used in injection or other circuits requiring a double regulating valve for system balancing • Accuracy of flow measurement is ±10% at the fully open position of the valve",
            "Some reduction in accuracy occurs at partial openings of the valve in accordance with BS 7350"
        ],
        specs: [
            { title: "Model Series", text: "DM931 / DA931" },
            { title: "Size", text: "4 inch (DN100)" },
            { title: "Connection Type", text: "Flanged to BS EN 1092-2 PN16" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Ductile Iron" },
        ],
        technical: [
            { title: "Part Number", text: "0JG90605Y" },
            { title: "Item Number", text: "DM931" },
            { title: "Product Name", text: "CRANE DM931 4\" VARIABLE ORIFICE DOUBLE REGULATING VALVE(VODRV) RF FLANGED Y-PATTERN WITH TEST POINT P84 PN16" },
            { title: "Type", text: "Variable Orifice Double Regulating Valve (VODRV)" },
            { title: "Model Series", text: "DM931 / DA931" },
            { title: "Size", text: "4 inch (DN100)" },
            { title: "Connection Type", text: "Flanged to BS EN 1092-2 PN16" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Ductile Iron" },
            { title: "Accuracy", text: "±10% at full open position (conforms to BS 7350)" },
            { title: "Test Points", text: "Two P84 pressure test points fitted" },
            { title: "Temperature Rating", text: "-10 to 120°C" },
            { title: "Application", text: "Flow measurement, regulation, and isolation for system balancing" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0JG92001J",
        overview: "CRANE FM463 65MM DOUBLE DOOR WAFER CHECK VALVE SS DISC DI PN16",
        standardPrice: "255.40",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774380056/Screenshot_2026-01-24_090126_tivjh5.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774380062/image_fy0g00.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774380048/image2_kc5fuu.png"
        ],
        about: [
            "Closes automatically upon flow reversal based on pressure and velocity.",
            "Features a spring-assisted closure and rubber seat to facilitate quiet, non-slam operation.",
            "Equipped with an EPDM rubber seat to improve disk seating and reduce noise.",
            "Robust ductile iron body with high-quality stainless steel discs for corrosion resistance.",
            "Compact construction specifically tailored for pump duty and space-restricted applications.",
            "Designed and tested to perform reliably under PN16 pressure conditions."
        ],
        description: "The Crane FM463 Double Door Wafer Check Valve is a high-performance solution designed for pump duty applications where space and efficiency are critical. This 65mm (DN65) valve permits flow in a single direction and closes automatically if flow reverses, utilizing a spring-assisted closure to prevent water hammer. Its wafer-style design allows for a compact installation between flanges, while the EPDM rubber seat ensures quiet operation and superior disc seating. Constructed with a durable ductile iron body and stainless steel discs, it is engineered for long-term reliability in demanding piping systems.",
        bullets: [
            "Check valves permit flow in one direction only and close automatically if flow reverses, depending upon pressure and velocity of flow to perform the functions of the opening and closing.",
            "Non-Slam design as a result of rubber seat and spring-assisted closure.",
            "EPDM rubber seat to facilitate quiet operation and improve disk seating.",
            "Eyebolt tapped holes in sizes DN200 and above, to fit bolts to BS EN ISO 3226:2010 (eyebolts are not supplied with product).",
            "Design and construction lends itself to pump duty applications"
        ],
        specs: [
            { title: "Type", text: "Double Door Wafer Check Valve" },
            { title: "Model Series", text: "FM463 / FM466 / FA463" },
            { title: "Size", text: "65mm (DN65)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Ductile Iron" },
        ],
        technical: [
            { title: "Part Number", text: "0JG92001J" },
            { title: "Item Number", text: "FM463" },
            { title: "Product Name", text: "CRANE FM463 65MM DOUBLE DOOR WAFER CHECK VALVE SS DISC DI PN16" },
            { title: "Type", text: "Double Door Wafer Check Valve" },
            { title: "Model Series", text: "FM463 / FM466 / FA463" },
            { title: "Size", text: "65mm (DN65)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Ductile Iron" },
            { title: "Disc Material", text: "Stainless Steel" },
            { title: "Seat Material", text: "EPDM Rubber" },
            { title: "Design Style", text: "Wafer / Non-Slam / Spring-Assisted" },
            { title: "Application", text: "Pump duty; permits unidirectional flow and prevents reversal" },
            { title: "Standards Compliance", text: "Design lends itself to pump duty applications" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0JG92002K",
        overview: "CRANE FM463 80MM DOUBLE DOOR WAFER CHECK VALVE SS DISC DI PN16",
        standardPrice: "295.20",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774380056/Screenshot_2026-01-24_090126_tivjh5.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774380062/image_fy0g00.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774380048/image2_kc5fuu.png"
        ],
        about: [
            "Automatically permits flow in one direction and prevents reversal based on system pressure and velocity.",
            "Utilizes a spring-assisted closure and rubber seat to significantly reduce noise and prevent water hammer.",
            "Features an EPDM rubber seat that improves disc seating and ensures quiet operation during closing.",
            "Lightweight and space-saving construction specifically engineered for pump duty and space-restricted areas.",
            "Built with a robust ductile iron body and corrosion-resistant stainless steel discs for a long service life.",
            "Reliable performance in systems requiring a PN16 rating, conforming to standard industrial pressure requirements."
        ],
        description: "The Crane FM463 Double Door Wafer Check Valve is a specialized 80mm (DN80) valve designed for pump duty applications where preventing backflow is critical. This high-quality valve permits fluid to flow in only one direction and closes automatically if the flow reverses. It features a compact wafer-style design for space-efficient installation between flanges. To ensure long-term durability and quiet operation, it is constructed with a ductile iron body and stainless steel discs, complemented by an EPDM rubber seat that facilitates a non-slam, spring-assisted closure.",
        bullets: [
            "Check valves permit flow in one direction only and close automatically if flow reverses, depending upon pressure and velocity of flow to perform the functions of the opening and closing.",
            "Non-Slam design as a result of rubber seat and spring-assisted closure.",
            "EPDM rubber seat to facilitate quiet operation and improve disk seating.",
            "Eyebolt tapped holes in sizes DN200 and above, to fit bolts to BS EN ISO 3226:2010 (eyebolts are not supplied with product).",
            "Design and construction lends itself to pump duty applications"
        ],
        specs: [
            { title: "Type", text: "Double Door Wafer Check Valve" },
            { title: "Model Series", text: "FM463 / FM466 / FA463" },
            { title: "Size", text: "80mm (DN80)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Ductile Iron" },
        ],
        technical: [
            { title: "Part Number", text: "0JG92002K" },
            { title: "Item Number", text: "FM463" },
            { title: "Product Name", text: "CRANE FM463 80MM DOUBLE DOOR WAFER CHECK VALVE SS DISC DI PN16" },
            { title: "Type", text: "Double Door Wafer Check Valve" },
            { title: "Model Series", text: "FM463 / FM466 / FA463" },
            { title: "Size", text: "80mm (DN80)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Ductile Iron" },
            { title: "Disc Material", text: "Stainless Steel" },
            { title: "Seat Material", text: "EPDM Rubber" },
            { title: "Connection Type", text: "Wafer (Fits between flanges)" },
            { title: "Closing Mechanism", text: "Spring-Assisted / Non-Slam" },
            { title: "Application", text: "Pump duty; backflow prevention and unidirectional flow control" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0JG92003L",
        overview: "CRANE FM463 4\" DOUBLE DOOR WAFER CHECK VALVE SS DISC CI PN16",
        standardPrice: "319.80",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774380056/Screenshot_2026-01-24_090126_tivjh5.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774380062/image_fy0g00.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774380048/image2_kc5fuu.png"
        ],
        about: [
            "Seamlessly permits unidirectional flow and prevents backflow based on system pressure and velocity.",
            "Utilizes spring-assisted closure and an EPDM rubber seat to ensure quiet operation and eliminate pipe-damaging water hammer.",
            "The EPDM rubber seat significantly improves the seal of the stainless steel discs for superior performance.",
            "Specifically designed with a slim wafer profile to fit into tight spaces where traditional swing check valves may not fit.",
            "Equipped with Stainless Steel discs to provide long-term durability and resistance to wear.",
            "Design and construction are specifically tailored for the demanding environments of pump discharge lines."
        ],
        description: "The Crane FM463 Double Door Wafer Check Valve is a robust 4\" (DN100) valve engineered specifically for pump duty applications. This valve serves as a critical safety component by permitting fluid flow in a single direction and closing automatically upon flow reversal. Its wafer-style design is optimized for compact, space-saving installation between flanges. To ensure longevity and reliable performance, it features a Cast Iron body and high-grade Stainless Steel discs. The inclusion of an EPDM rubber seat and spring-assisted closure provides a \"non-slam\" operation, effectively preventing water hammer and ensuring quiet service in industrial and commercial piping systems.",
        bullets: [
            "Check valves permit flow in one direction only and close automatically if flow reverses, depending upon pressure and velocity of flow to perform the functions of the opening and closing.",
            "Non-Slam design as a result of rubber seat and spring-assisted closure.",
            "EPDM rubber seat to facilitate quiet operation and improve disk seating.",
            "Eyebolt tapped holes in sizes DN200 and above, to fit bolts to BS EN ISO 3226:2010 (eyebolts are not supplied with product).",
            "Design and construction lends itself to pump duty applications"
        ],
        specs: [
            { title: "Type", text: "Double Door Wafer Check Valve" },
            { title: "Model Series", text: "FM463 / FM466 / FA463" },
            { title: "Size", text: "4 inch (DN100)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Cast Iron (CI)" },
        ],
        technical: [
            { title: "Part Number", text: "0JG92003L" },
            { title: "Item Number", text: "FM463" },
            { title: "Product Name", text: "CRANE FM463 4\" DOUBLE DOOR WAFER CHECK VALVE SS DISC CI PN16" },
            { title: "Type", text: "Double Door Wafer Check Valve" },
            { title: "Model Series", text: "FM463 / FM466 / FA463" },
            { title: "Size", text: "4 inch (DN100)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Cast Iron (CI)" },
            { title: "Disc Material", text: "Stainless Steel (SS)" },
            { title: "Seat Material", text: "EPDM Rubber" },
            { title: "Connection Type", text: "Wafer (Fits between PN16 flanges)" },
            { title: "Operating Mechanism", text: "Spring-Assisted / Non-Slam" },
            { title: "Application", text: "Pump duty and backflow prevention" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0JG92004M",
        overview: "CRANE FM463 5\" DOUBLE DOOR WAFER CHECK VALVE SS DISC CI PN16",
        standardPrice: "423.20",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774380056/Screenshot_2026-01-24_090126_tivjh5.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774380062/image_fy0g00.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774380048/image2_kc5fuu.png"
        ],
        about: [
            "Seamlessly permits flow in one direction and provides rapid, automatic closure to prevent backflow.",
            "Engineered with a spring-assisted closure and an EPDM rubber seat to ensure quiet performance and eliminate water hammer.",
            "Features a compact and lightweight construction that fits easily between flanges, ideal for space-restricted pump rooms.",
            "Built with a robust Cast Iron body and corrosion-resistant Stainless Steel discs for long-term service in industrial environments.",
            "Specifically designed and constructed to meet the rigorous demands of pump discharge and suction lines.",
            "The EPDM rubber seat facilitates a soft closure, improving disc seating and significantly reducing operational noise."
        ],
        description: "The Crane FM463 Double Door Wafer Check Valve is a high-performance 5\" (DN125) valve specifically designed for pump duty applications where preventing backflow is essential. This valve permits fluid to flow in a single direction and utilizes a spring-assisted, automatic closure mechanism to prevent reversal as soon as flow velocity decreases. Its slim wafer-style design allows for easy and compact installation between standard PN16 flanges. Constructed with a durable Cast Iron body and high-grade Stainless Steel discs, the valve features an EPDM rubber seat that ensures superior disc seating and quiet, non-slam operation, protecting the piping system from the damaging effects of water hammer.",
        bullets: [
            "Check valves permit flow in one direction only and close automatically if flow reverses, depending upon pressure and velocity of flow to perform the functions of the opening and closing.",
            "Non-Slam design as a result of rubber seat and spring-assisted closure.",
            "EPDM rubber seat to facilitate quiet operation and improve disk seating.",
            "Eyebolt tapped holes in sizes DN200 and above, to fit bolts to BS EN ISO 3226:2010 (eyebolts are not supplied with product).",
            "Design and construction lends itself to pump duty applications"
        ],
        specs: [
            { title: "Type", text: "Double Door Wafer Check Valve" },
            { title: "Model Series", text: "FM463 / FM466 / FA463" },
            { title: "Size", text: "5 inch (DN125)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Cast Iron (CI)" },
        ],
        technical: [
            { title: "Part Number", text: "0JG92004M" },
            { title: "Item Number", text: "FM463" },
            { title: "Product Name", text: "CRANE FM463 5\" DOUBLE DOOR WAFER CHECK VALVE SS DISC CI PN16" },
            { title: "Type", text: "Double Door Wafer Check Valve" },
            { title: "Model Series", text: "FM463 / FM466 / FA463" },
            { title: "Size", text: "5 inch (DN125)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Cast Iron (CI)" },
            { title: "Disc Material", text: "Stainless Steel (SS)" },
            { title: "Seat Material", text: "EPDM Rubber" },
            { title: "Connection Type", text: "Wafer (Fits between flanges)" },
            { title: "Mechanism", text: "Spring-Assisted / Non-Slam" },
            { title: "Application", text: "Pump duty, backflow prevention, and water hammer protection" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "0JG92005N",
        overview: "CRANE FM463 6\" DOUBLE DOOR WAFER CHECK VALVE SS DISC CI PN16",
        standardPrice: "599.40",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774380056/Screenshot_2026-01-24_090126_tivjh5.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774380062/image_fy0g00.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774380048/image2_kc5fuu.png"
        ],
        about: [
            "Seamlessly permits unidirectional flow and prevents backflow based on system pressure and velocity.",
            "Utilizes spring-assisted closure and an EPDM rubber seat to ensure quiet operation and eliminate pipe-damaging water hammer.",
            "The EPDM rubber seat significantly improves the seal of the stainless steel discs for superior performance.",
            "Specifically designed with a slim wafer profile to fit into tight spaces where traditional swing check valves may not fit.",
            "Equipped with Stainless Steel discs to provide long-term durability and resistance to wear.",
            "Design and construction are specifically tailored for the demanding environments of pump discharge lines."
        ],
        description: "The Crane FM463 Double Door Wafer Check Valve is a high-performance 6\" (DN150) valve engineered specifically for pump duty applications. This valve serves as a critical safety component by permitting fluid flow in a single direction and closing automatically upon flow reversal. Its wafer-style design is optimized for compact, space-saving installation between flanges. To ensure longevity and reliable performance, it features a Cast Iron body and high-grade Stainless Steel discs. The inclusion of an EPDM rubber seat and spring-assisted closure provides a \"non-slam\" operation, effectively preventing water hammer and ensuring quiet service in industrial and commercial piping systems.",
        bullets: [
            "Check valves permit flow in one direction only and close automatically if flow reverses, depending upon pressure and velocity of flow to perform the functions of the opening and closing.",
            "Non-Slam design as a result of rubber seat and spring-assisted closure.",
            "EPDM rubber seat to facilitate quiet operation and improve disk seating.",
            "Eyebolt tapped holes in sizes DN200 and above, to fit bolts to BS EN ISO 3226:2010 (eyebolts are not supplied with product).",
            "Design and construction lends itself to pump duty applications"
        ],
        specs: [
            { title: "Type", text: "Double Door Wafer Check Valve" },
            { title: "Model Series", text: "FM463 / FM466 / FA463" },
            { title: "Size", text: "6 inch (DN150)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Cast Iron (CI)" },
        ],
        technical: [
            { title: "Part Number", text: "0JG92005N" },
            { title: "Item Number", text: "FM463" },
            { title: "Product Name", text: "CRANE FM463 6\" DOUBLE DOOR WAFER CHECK VALVE SS DISC CI PN16" },
            { title: "Type", text: "Double Door Wafer Check Valve" },
            { title: "Model Series", text: "FM463 / FM466 / FA463" },
            { title: "Size", text: "6 inch (DN150)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Cast Iron (CI)" },
            { title: "Disc Material", text: "Stainless Steel (SS)" },
            { title: "Seat Material", text: "EPDM Rubber" },
            { title: "Connection Type", text: "Wafer (Fits between PN16 flanges)" },
            { title: "Operating Mechanism", text: "Spring-Assisted / Non-Slam" },
            { title: "Application", text: "Pump duty and backflow prevention" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "80008989L",
        overview: "CRANE FM63 2.1/2\" GATE VALVE HANDWHEEL OPERATED RF FLANGED CI BODY & WEDGE DISC PN16",
        standardPrice: "657",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774380148/90f65f53-42a1-4dba-b3f5-4ccb4e7bcbd6_ig1obv.png"
        ],
        about: [
            "Specifically designed to offer the ultimate in dependable service with minimum pressure drop.",
            "The non-rising stem configuration minimizes the height required for installation and operation.",
            "Every valve is hydrostatically tested to BS EN 12266-1:2003 to ensure seat and body integrity.",
            "Produced in strict accordance with BS EN 1171:2002 standards for cast iron gate valves.",
            "Features a durable cast iron (CI) body and wedge disc suitable for PN16 pressure ratings.",
            "Capable of operating in environments ranging from -10°C to 200°C (at reduced pressure)."
        ],
        description: "The Crane FM63 Cast Iron Gate Valve is a 2.1/2\" (DN65) flanged valve engineered for dependable service in applications where minimizing pressure drop is a primary requirement. This valve features a non-rising stem and an inside screw design, making it ideal for installations with limited vertical space. It is equipped with a wedge disc and operated via a sturdy handwheel. Manufactured in accordance with BS EN 1171:2002 and hydrostatically tested to BS EN 12266-1:2003, it ensures high reliability for water and neutral liquid systems.",
        specs: [
            { title: "Type", text: "Cast Iron Gate Valve" },
            { title: "Model Series", text: "FM63" },
            { title: "Size", text: "2.1/2 inch (DN65)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Cast Iron (CI)" },
        ],
        technical: [
            { title: "Part Number", text: "80008989L" },
            { title: "Item Number", text: "FM63" },
            { title: "Product Name", text: "CRANE FM63 2.1/2\" GATE VALVE HANDWHEEL OPERATED RF FLANGED CI BODY & WEDGE DISC PN16" },
            { title: "Type", text: "Cast Iron Gate Valve" },
            { title: "Model Series", text: "FM63" },
            { title: "Size", text: "2.1/2 inch (DN65)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Cast Iron (CI)" },
            { title: "Disc Type", text: "Wedge Disc" },
            { title: "Stem Type", text: "Non-Rising Stem / Inside Screw" },
            { title: "Connection Type", text: "Flanged BS EN 1092-2: PN16 (RF - Raised Face)" },
            { title: "Temperature Range", text: "-10 to 120°C at 16 bar; up to 200°C at 12.8 bar" },
            { title: "Operator", text: "Handwheel" },
            { title: "Standards Compliance", text: "BS EN 1171: 2002, BS EN 12266-1: 2003" },
            { title: "Limitations", text: "Not suitable for Group 1 gases or unstable fluids (97/23/EC)" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "80008990D",
        overview: "CRANE FM63 3\" GATE VALVE HANDWHEEL OPERATED RF FLANGED CI BODY & WEDGE DISC PN16",
        standardPrice: "774.3",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774380148/90f65f53-42a1-4dba-b3f5-4ccb4e7bcbd6_ig1obv.png"
        ],
        about: [
            "Engineered to provide efficient flow with the ultimate in dependable service.",
            "The non-rising stem design reduces the overall height required for operation, ideal for tight spaces.",
            "Manufactured to BS EN 1171:2002 standards and hydrostatically tested for seat and body integrity.",
            "Built with a high-strength cast iron (CI) body and wedge disc for long-term durability.",
            "Rated for operation from -10°C to 120°C at 16 bar, and up to 200°C at 12.8 bar.",
            "Features RF (Raised Face) flanged ends to BS EN 1092-2: PN16 for secure system integration."
        ],
        description: "The Crane FM63 Cast Iron Gate Valve is a 3\" (DN80) flanged valve designed for reliable service in systems where maintaining a low pressure drop is essential. It features an inside screw and a non-rising stem, which makes it particularly suitable for installations where vertical space is restricted. The valve is constructed with a durable cast iron body and wedge disc, operated via a handwheel. Every unit is manufactured in accordance with BS EN 1171:2002 and undergoes hydrostatic testing to BS EN 12266-1:2003 to ensure high performance and safety for water and neutral liquid applications.",
        specs: [
            { title: "Type", text: "Cast Iron Gate Valve" },
            { title: "Model Series", text: "FM63" },
            { title: "Size", text: "3 inch (DN80)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Cast Iron (CI)" },
        ],
        technical: [
            { title: "Part Number", text: "80008990D" },
            { title: "Item Number", text: "FM63" },
            { title: "Product Name", text: "CRANE FM63 3\" GATE VALVE HANDWHEEL OPERATED RF FLANGED CI BODY & WEDGE DISC PN16" },
            { title: "Type", text: "Cast Iron Gate Valve" },
            { title: "Model Series", text: "FM63" },
            { title: "Size", text: "3 inch (DN80)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Cast Iron (CI)" },
            { title: "Disc Type", text: "Wedge Disc" },
            { title: "Stem Configuration", text: "Non-Rising Stem / Inside Screw" },
            { title: "Connection Type", text: "Flanged BS EN 1092-2: PN16 (RF)" },
            { title: "Temperature Range", text: "-10 to 120°C at 16 bar; 200°C at 12.8 bar" },
            { title: "Operator", text: "Handwheel" },
            { title: "Standards Compliance", text: "BS EN 1171: 2002, BS EN 12266-1: 2003" },
            { title: "Fluid Suitability", text: "Water and neutral liquids; not for Group 1 gases or unstable fluids" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "80008991E",
        overview: "CRANE FM63 4\" GATE VALVE HANDWHEEL OPERATED RF FLANGED CI BODY & WEDGE DISC PN16",
        standardPrice: "1132.20",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774380148/90f65f53-42a1-4dba-b3f5-4ccb4e7bcbd6_ig1obv.png"
        ],
        about: [
            "Expertly engineered to provide the ultimate in dependable service, specifically in systems where maintaining a low pressure drop is a critical requirement.",
            "Utilizes an inside screw and non-rising stem design, making it the ideal choice for installations with restricted vertical space.",
            "Manufactured in strict accordance with BS EN 1171: 2002 and hydrostatically tested to BS EN 12266-1: 2003 to ensure maximum seat and body integrity.",
            "Features a high-strength cast iron (CI) body and wedge disc designed to handle PN16 pressure ratings reliably.",
            "Equipped with RF (Raised Face) flanged ends conforming to BS EN 1092-2: PN16 for secure and stable system integration.",
            "Rated for operation from -10°C to 120°C at 16 bar, and remains functional up to 200°C at a reduced pressure of 12.8 bar.",
            "Comes standard with a sturdy handwheel for manual flow control and isolation."
        ],
        description: "PN16 Cast Iron Gate Valve",
        bullets: [
            "Crane cast iron gate valves offer the ultimate in dependable service wherever minimum pressure drop is important.",
            "Each valve is manufactured in accordance with BS EN 1171: 2002",
            "Hydrostatically tested to BS EN 12266-1: 2003"
        ],
        specs: [
            { title: "Brand", text: "Crane" },
            { title: "Size", text: "65mm to 300mm" },
            { title: "Pressure rating", text: "PN16" },
            { title: "Material", text: "Cast Iron" }
        ],
        technical: [
            { title: "Size", text: "65mm to 300mm" },
            { title: "Pressure rating", text: "PN16" },
            { title: "End Connections", text: "Flanged BS EN 1092-2: PN16" },
            { title: "Material", text: "Cast Iron" }

        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "80008992F",
        overview: "CRANE FM63 5\" GATE VALVE HANDWHEEL OPERATED RF FLANGED CI BODY & WEDGE DISC PN16",
        standardPrice: "1613.3",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774380148/90f65f53-42a1-4dba-b3f5-4ccb4e7bcbd6_ig1obv.png"
        ],
        about: [
            "Engineered specifically to offer minimum pressure drop for highly efficient system performance.",
            "The non-rising stem design ensures the valve maintains a constant height during operation, ideal for tight spaces.",
            "Manufactured in accordance with BS EN 1171:2002 and hydrostatically tested for guaranteed safety and performance.",
            "Built with high-quality cast iron (CI) for the body and wedge disc, rated for PN16 pressure.",
            "Suitable for temperatures from -10°C to 120°C at 16 bar, and up to 200°C at 12.8 bar.",
            "Features RF (Raised Face) flanged connections to BS EN 1092-2: PN16 for a reliable, leak-proof fit.",
            "Equipped with a durable handwheel for easy manual isolation and flow control."
        ],
        description: "The Crane FM63 Cast Iron Gate Valve is a 5\" (DN125) flanged valve designed to provide the ultimate in dependable service, particularly in systems where minimizing pressure drop is a priority. This valve features an inside screw and a non-rising stem, making it an excellent choice for installations with limited vertical headroom. Constructed with a robust cast iron body and a wedge disc, it is operated via a sturdy handwheel. Every unit is manufactured to BS EN 1171:2002 standards and undergoes rigorous hydrostatic testing to BS EN 12266-1:2003 to ensure superior seat and body integrity.",
        specs: [
            { title: "Type", text: "Cast Iron Gate Valve" },
            { title: "Model Series", text: "FM63" },
            { title: "Size", text: "5 inch (DN125)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Cast Iron (CI)" },
        ],
        technical: [
            { title: "Part Number", text: "80008992F" },
            { title: "Item Number", text: "FM63" },
            { title: "Product Name", text: "CRANE FM63 5\" GATE VALVE HANDWHEEL OPERATED RF FLANGED CI BODY & WEDGE DISC PN16" },
            { title: "Type", text: "Cast Iron Gate Valve" },
            { title: "Model Series", text: "FM63" },
            { title: "Size", text: "5 inch (DN125)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Cast Iron (CI)" },
            { title: "Disc Type", text: "Wedge Disc" },
            { title: "Stem Configuration", text: "Non-Rising Stem / Inside Screw" },
            { title: "Connection Type", text: "Flanged BS EN 1092-2: PN16 (RF)" },
            { title: "Temperature Range", text: "-10 to 120°C at 16 bar; 200°C at 12.8 bar" },
            { title: "Operator", text: "Handwheel" },
            { title: "Standards Compliance", text: "BS EN 1171: 2002, BS EN 12266-1: 2003" },
            { title: "Fluid Suitability", text: "Water and neutral liquids; not suitable for Group 1 gases" }
        ]
    },
    {
        categoryFilter: "crane",
        category: "Crane Butterfly Valve",
        partNumber: "80008993G",
        overview: "CRANE FM63 6\" GATE VALVE HANDWHEEL OPERATED RF FLANGED CI BODY & WEDGE DISC PN16",
        standardPrice: "2043.70",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774380148/90f65f53-42a1-4dba-b3f5-4ccb4e7bcbd6_ig1obv.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774380257/image_dvmps5.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774380250/image2_biyy27.png"
        ],
        about: [
            "Specially engineered to provide the ultimate in dependable service with minimum pressure drop.",
            "The non-rising stem maintains a constant profile, making it the preferred choice for installations with restricted vertical space.",
            "Manufactured in accordance with BS EN 1171:2002 and hydrostatically tested to ensure high performance and safety.",
            "Features a high-strength cast iron (CI) body and wedge disc rated for PN16 pressure conditions.",
            "Operates reliably from -10°C to 120°C at 16 bar, and remains functional up to 200°C at 12.8 bar.",
            "Equipped with RF (Raised Face) flanged ends conforming to BS EN 1092-2: PN16 for secure system integration."
        ],
        description: "The Crane FM63 Cast Iron Gate Valve is a 6\" (DN150) flanged valve designed for heavy-duty service in systems where maintaining a low pressure drop is essential. It features a non-rising stem and inside screw configuration, which allows for a consistent height during operation—ideal for installations with limited vertical clearance. Constructed with a durable cast iron body and a wedge disc, it is operated manually via a sturdy handwheel. Every unit is manufactured to BS EN 1171:2002 standards and is hydrostatically tested to BS EN 12266-1:2003 to ensure maximum seat and body integrity.",
        specs: [
            { title: "Type", text: "Cast Iron Gate Valve" },
            { title: "Model Series", text: "FM63" },
            { title: "Size", text: "6 inch (DN150)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Cast Iron (CI)" },
        ],
        technical: [
            { title: "Part Number", text: "80008993G" },
            { title: "Item Number", text: "FM63" },
            { title: "Product Name", text: "CRANE FM63 6\" GATE VALVE HANDWHEEL OPERATED RF FLANGED CI BODY & WEDGE DISC PN16" },
            { title: "Type", text: "Cast Iron Gate Valve" },
            { title: "Model Series", text: "FM63" },
            { title: "Size", text: "6 inch (DN150)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Body Material", text: "Cast Iron (CI)" },
            { title: "Disc Type", text: "Wedge Disc" },
            { title: "Stem Configuration", text: "Non-Rising Stem / Inside Screw" },
            { title: "Connection Type", text: "Flanged BS EN 1092-2: PN16 (RF)" },
            { title: "Temperature Range", text: "-10 to 120°C at 16 bar; 200°C at 12.8 bar" },
            { title: "Operator", text: "Handwheel" },
            { title: "Standards Compliance", text: "BS EN 1171: 2002, BS EN 12266-1: 2003" },
            { title: "Suitability", text: "Water and neutral liquids; Not for Group 1 gases or unstable fluids" }
        ]
    },
];
const dewaltProducts = [
    // 1. D25133K-B5 - SDS Plus Hammer
    {
        categoryFilter: "tools",
        category: "DeWalt SDS Plus Hammer",
        partNumber: "D25133K-B5",
        stockAllocated: "",
        overview: "DEWALT 26MM 3 MODE SDS PLUS HAMMER",
        standardPrice: "510",
        amazonPrice: "",
        weight: "17",
        freightCharges: "49",
        sellingPriceWithFreight: "497.21",
        newAmazonSellingPrice: "557",
        brand: "DEWALT",
        amazonLink: "https://www.amazon.ae/dp/DEWD25133K",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421634/61oaKFTEUJL._AC_SL1200__awsn9m.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421630/81D2e2wZkEL._AC_SL1500__pjnjwy.png"
        ],
        about: [
            "3-in-1 Functionality: Rotary drilling, hammer drilling, and chiselling - all powered by an 800W motor",
            "Variable Speed Trigger: Smooth control with forward/reverse options for total versatility",
            "Rotation-Stop Mode: Perfect for light chiselling in brick, soft masonry, and occasional concrete work",
            "Mechanical Clutch: Protects against sudden torque spikes if the bit jams",
            "Ergonomic Design: Rounded grip ensures comfort during extended use",
            "Professional Range: Ideal for anchor and fixing holes in concrete/masonry (4-26 mm diameter)"
        ],
        description: "DEWALT D25133K 26mm 3-Mode SDS Plus Hammer with 800W motor, 2.6 joules impact energy, rotating brush ring, and dust extraction compatibility.",
        bullets: [
            "2.6 joules of impact energy — delivers fast drilling and chipping speed.",
            "8.0-amp high performance motor — engineered for demanding professional applications.",
            "Rotating brush ring — maintains full speed and torque in both forward and reverse directions.",
            "Compact, lightweight design — ensures comfortable handling during extended use.",
            "Integral clutch — minimizes sudden, high torque reactions if the bit jams.",
            "Dust extraction compatibility — works seamlessly with drilling dust extraction systems."
        ],
        specs: [
            { title: "Brand", text: "DEWALT" },
            { title: "Power Source", text: "Corded Electric" },
            { title: "Power", text: "800W" },
            { title: "Impact Energy", text: "2.6 Joules" },
            { title: "Max Rotational Speed", text: "1500 RPM" },
            { title: "Voltage", text: "240V AC" },
            { title: "Amperage", text: "7 Amps" }
        ],
        technical: [
            { title: "Product Dimensions", text: "3.35 x 0.75 x 2.1 cm; 4.3 kg" },
            { title: "Model Number", text: "D25133K-B5" },
            { title: "Size", text: "D25133K-B5" },
            { title: "Colour", text: "Yellow/Black" },
            { title: "Style", text: "D25133K-B5" },
            { title: "Material", text: "Metal" },
            { title: "Power Source Type", text: "Corded Electric" },
            { title: "Voltage", text: "240 Volts (AC)" },
            { title: "Wattage", text: "800 Watts" },
            { title: "Maximum Power", text: "800 Watts" },
            { title: "Torque", text: "3.6 Newton Meters" },
            { title: "Item Package Quantity", text: "1" },
            { title: "Speed", text: "1500 RPM" },
            { title: "Special Features", text: "Electronic variable speed" },
            { title: "Specific Uses", text: "Professional" },
            { title: "Included Components", text: "1 x 360-degree Side Handle, 1 x D25133 Hammer Drill, 1 x Depth Rod, 1 x Kit Box, Instruction Manual" },
            { title: "Batteries Included?", text: "No" },
            { title: "Batteries Required?", text: "No" },
            { title: "Battery Cell Type", text: "Lithium Ion" },
        ]
    },
    // 2. DCD771D2T-GB - Drill Driver
    {
        categoryFilter: "tools",
        category: "DeWalt Drill Driver",
        partNumber: "DCD771D2T-GB",
        stockAllocated: "",
        overview: "DEWALT 18V XR HAMMER DRILL DRIVER 2*2AH BATTERY & CHARGER",
        standardPrice: "480",
        amazonPrice: "",
        weight: "17",
        freightCharges: "49",
        sellingPriceWithFreight: "435.75",
        newAmazonSellingPrice: "489",
        brand: "DEWALT",
        amazonLink: "https://www.amazon.ae/dp/DCD796D2W",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421593/61G0GECDsSL._AC_SL1200__btvkds.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421587/610VxMj66zL._AC_SL1200__sdko9g.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421591/518lx4XQYEL._AC_SL1200__b7r08x.png"
        ],
        about: [
            "18V XR Li-Ion Compact Drill Driver with XR 1.3Ah battery technology for reliable performance",
            "Two-speed settings with variable speed and reverse switch for maximum control",
            "15-position adjustable torque control for consistent screw driving across different materials and screw sizes",
            "Bright white LED with delay feature for improved visibility and added flashlight functionality",
            "13mm single sleeve chuck & spindle lock for quick, one-handed bit changes",
            "Intelligent trigger design for precise application control",
            "Drill Driver and Hammer settings for versatile use across multiple applications",
            "Ergonomic design with rubber grip for enhanced comfort during extended use",
            "Multi-voltage charger compatible with all XR Li-Ion slide pack batteries",
            "Part of the intelligent XR Lithium-Ion Series, engineered for efficiency and faster performance"
        ],
        description: "Powerful, compact, and built for professionals, the DEWALT DCD796D2W delivers precision and reliability in every job. Its brushless motor ensures maximum performance and longer runtime, while the two-speed transmission and hammer function make it versatile for drilling and fastening across multiple materials. Lightweight and easy to handle, it’s perfect for confined spaces and extended use. Supplied with two 2.0Ah batteries, a charger, and a durable kit bag, this all-in-one set keeps you ready on the move.",
        features: [
            { title: "Ultra-Compact & Lightweight Design", text: "Designed for comfortable handling and extended use, even in tight or overhead spaces." },
            { title: "Advanced Brushless Motor Technology", text: "Delivers higher efficiency, longer runtime, and extended tool life." },
            { title: "Hammer Drill Driver Functionality", text: "Ideal for drilling and fastening across wood, metal, and masonry applications." },
            { title: "Two-Speed High-Performance Transmission", text: "Allows precise speed control to match different tasks and materials." },
            { title: "Professional-Grade Portability", text: "Supplied with a tough nylon kit bag for easy storage and transport." }
        ],
        specs: [
            { title: "Brand", text: "DEWALT" },
            { title: "Voltage", text: "18V" },
            { title: "Item Weight", text: "4.6 Kg" },
            { title: "Battery Cell Composition", text: "Lith-Ion" },
            { title: "Included Components", text: "Battery Charger, Tool Bag" },
        ],
        technical: [
            { title: "Product Name", text: "XR Brushless Hammer Drill Driver Kit" },
            { title: "Brand", text: "DEWALT" },
            { title: "Model", text: "DCD796D2W" },
            { title: "Set Name", text: "DEWALT DCD796D2W XR Brushless Hammer Drill Driver Kit" },
            { title: "Voltage", text: "18 V" },
            { title: "Motor Technology", text: "Brushless Motor" },
            { title: "Power Source", text: "Battery Powered" },
            { title: "Battery Type", text: "Lithium-Ion" },
            { title: "Battery Capacity", text: "2.0 Ah" },
            { title: "Number of Batteries Supplied", text: "2" },
            { title: "Speed Control", text: "2-Speed High-Performance Transmission" },
            { title: "Tool Function", text: "Hammer Drill Driver" },
            { title: "Material", text: "Metal" },
            { title: "Colour", text: "Yellow" },
            { title: "Special Features", text: "Compact Design, Lightweight Construction, High Efficiency" },
            { title: "Item Weight", text: "4.6 kg" },
            { title: "Dimensions(L × W × H)", text: "13.1 × 8.7 × 5 cm" },
            { title: "Storage", text: "Nylon Kit Bag" },
            { title: "Included Accessories", text: "Batteries(2), Charger, Steel Belt Hook, Magnetic Bit Holder, Nylon Kit Bag" },
            { title: "Application", text: "Drilling & Fastening in Wood, Metal & Masonry" },
            { title: "Batteries Required?", text: "No (Included)" }
        ]
    },
    // 3. DCD776D2T-GB - Hammer Drill Driver
    {
        categoryFilter: "tools",
        category: "DeWalt Hammer Drill Driver",
        partNumber: "DCD776D2T-GB",
        stockAllocated: "",
        overview: "DEWALT 18V XR HAMMER DRILL DRIVER KINGFISHER",
        standardPrice: "505",
        amazonPrice: "",
        weight: "17",
        freightCharges: "49",
        sellingPriceWithFreight: "451.50",
        newAmazonSellingPrice: "509",
        brand: "DEWALT",
        amazonLink: "https://www.amazon.ae/dp/DCD776S2-B5",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421583/71RDkb-CH5L._AC_SL1500__xvaxxk.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421583/31TnOlSqP6L._AC__kkc4wf.png"
        ],
        about: [
            "18V XR Li-Ion Compact Drill Driver with XR 1.3Ah battery technology for reliable performance",
            "Two-speed settings with variable speed and reverse switch for maximum control",
            "15-position adjustable torque control for consistent screw driving across different materials and screw sizes",
            "Bright white LED with delay feature for improved visibility and added flashlight functionality",
            "13mm single sleeve chuck & spindle lock for quick, one-handed bit changes",
            "Intelligent trigger design for precise application control",
            "Drill Driver and Hammer settings for versatile use across multiple applications",
            "Ergonomic design with rubber grip for enhanced comfort during extended use",
            "Multi-voltage charger compatible with all XR Li-Ion slide pack batteries",
            "Part of the intelligent XR Lithium-Ion Series, engineered for efficiency and faster performance"
        ],
        description: "The Dewalt DCD776S2-B5 18V Li-Ion Cordless Compact Hammer Drill Driver is designed for users who need dependable performance in a compact form. Its powerful 18V motor and hammer drilling capability makes it suitable for a wide range of drilling and fastening tasks, including masonry applications. Featuring a two-speed gearbox, variable speed trigger, and 15-position adjustable torque control, this drill driver delivers precision and control in every application. The 13mm single-sleeve chuck allows quick, one-handed bit changes, while the ergonomic rubber grip ensures comfort during extended use. Built for durability and efficiency, it’s an ideal tool for professionals and serious DIY users.",
        specs: [
            { title: "Brand", text: "DEWALT" },
            { title: "Power source", text: "Battery Powered" },
            { title: "Maximum rotational speed", text: "1500 RPM" },
            { title: "Amperage", text: "1.5 Amps" },
            { title: "Voltage", text: "18V" }
        ],
        technical: [
            { title: "Manufacturer", text: "DeWalt" },
            { title: "Part number", text: "DCD776S2" },
            { title: "Item Weight", text: "4.1 kg" },
            { title: "Product Dimensions", text: "39 x 34 x 11.8 cm" },
            { title: "Batteries", text: "1 AA batteries required. (included)" },
            { title: "Item model number", text: "DCD776S2-TR" },
            { title: "Size", text: "13 mm" },
            { title: "Colour", text: "Yellow/Black" },
            { title: "Style", text: "Hammer Drill" },
            { title: "Material", text: "Metal" },
            { title: "Power source type", text: "Battery Powered" },
            { title: "Voltage", text: "18 Volts" },
            { title: "Maximum Power", text: "400 Watts" },
            { title: "Torque", text: "42 Newton Meters" },
            { title: "Item Package Quantity", text: "1" },
            { title: "Number Of Pieces", text: "1" },
            { title: "Speed", text: "1200 RPM" },
            { title: "Special Features", text: "Variable Speed" },
            { title: "Included components", text: "2 x 1.5Ah Battery with Charger, Drill, Instruction Manual" },
            { title: "Batteries Included?", text: "Yes" },
            { title: "Batteries Required?", text: "No" },
            { title: "Battery Cell Type", text: "Lithium Ion" },
            { title: "Battery Capacity", text: "1.5 Amp Hours" }
        ]
    },
    // 4. DCH133M1EXP-GB - Cordless SDS Hammer
    {
        categoryFilter: "tools",
        category: "DeWalt SDS Plus Cordless Hammer",
        partNumber: "DCH133M1EXP-GB",
        stockAllocated: "",
        overview: "DEWALT DCH133M1 18V Li-ion 26mm SDS-Plus 3-Mode Cordless Hammer with Brushless Motor",
        standardPrice: "880",
        amazonPrice: "",
        weight: "17",
        freightCharges: "49",
        sellingPriceWithFreight: "840",
        newAmazonSellingPrice: "942",
        brand: "DEWALT",
        amazonLink: "https://www.amazon.ae/dp/DCH133M1",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421591/61_8ev0eJXL._AC_SL1000__vbdhct.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421586/51K_y2sMDqL._AC_SL1000__l2nxcm.png"
        ],
        about: [
            "18V Brushless Motor for maximum efficiency and longer life",
            "26mm SDS-Plus chuck for fast, secure bit changes",
            "3 Modes: drilling, hammer drilling, and chiselling for versatile applications",
            "Compact & Lightweight (2 kg) for reduced fatigue and easy handling",
            "4.0Ah Li-ion Battery included for extended runtime",
            "Ergonomic design with comfortable grip for improved user"
        ],
        description: "DEWALT DCH133M1 18V brushless cordless hammer with 26mm SDS-Plus chuck, 3-mode operation, and 4.0Ah battery.",
        bullets: [
            "The DEWALT DCH133M1 is a high-performance cordless hammer designed for professionals who demand power, efficiency, and durability.",
            "Equipped with an 18V brushless motor, it delivers longer runtime, reduced maintenance, and superior drilling performance.",
            "Its SDS-Plus chuck allows quick bit changes, while the 3-mode operation (drill, hammer drill, and chisel) provides versatility across multiple applications.",
            "Weighing just 2 kg, this compact tool ensures comfort and control during prolonged use, even in tight spaces."
        ],
        specs: [
            { title: "Brand", text: "DEWALT" },
            { title: "Power source", text: "Battery Powered" },
            { title: "Maximum rotational speed", text: "1500 RPM" },
            { title: "Amperage", text: "4 Amps" },
            { title: "Voltage", text: "18V" }
        ],
        technical: [
            { title: "Manufacturer", text: "DEWALT" },
            { title: "Part number", text: "DCH133M1.1" },
            { title: "Item Weight", text: "430 g" },
            { title: "Product Dimensions", text: "44 x 35.3 x 12.8 cm; 430 g" },
            { title: "Batteries", text: "2 Lithium-Ion batteries required (included)" },
            { title: "Item model number", text: "DCH133M1EXP-GB" },
            { title: "Colour", text: "Black" },
            { title: "Material", text: "Aluminium" },
            { title: "Power source type", text: "Battery Powered" },
            { title: "Voltage", text: "18 Volts" },
            { title: "Maximum Power", text: "72 Watts" },
            { title: "Item Package Quantity", text: "1" },
            { title: "Number Of Pieces", text: "1" },
            { title: "Speed", text: "1550 RPM" },
            { title: "Special Features", text: "Brushless" },
            { title: "Included components", text: "Components included" },
            { title: "Batteries Included?", text: "Yes" },
            { title: "Batteries Required?", text: "No" },
            { title: "Battery Cell Type", text: "Lithium Ion" },
            { title: "Battery Capacity", text: "4 Amp Hours" }
        ]
    },
    // 5. DWD024-B5 - Percussion Drill
    {
        categoryFilter: "tools",
        category: "DeWalt Percussion Drill",
        partNumber: "DWD024-B5",
        stockAllocated: "",
        overview: "DEWALT PERCUSSION DRILL 750W WITH CARTON BOX",
        standardPrice: "210",
        amazonPrice: "",
        weight: "17",
        freightCharges: "49",
        sellingPriceWithFreight: "195.72",
        newAmazonSellingPrice: "239",
        brand: "DEWALT",
        amazonLink: "https://www.amazon.ae/dp/DWD024-B5",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421635/71LZFrdaulS._AC_SL1500__u1fgvu.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421653/81N51tEPbUS._AC_SL1500__o7fuoh.png"
        ],
        about: [
            "Powerful 750W motor for consistent performance",
            "Drilling Capacity: Wood - 25 mm, Steel - 13 mm, Concrete - 16 mm",
            "Variable speed trigger (0-2800 RPM) for precision control",
            "13mm chuck with spindle lock for quick bit changes",
            "Compact & lightweight design for improved handling",
            "Rubber back handle for user comfort during drilling and hammer tasks",
            "Yellow/Black DEWALT design - durable and professional"
        ],
        description: "DEWALT DWD024-B5 Percussion Drill with 750W motor, 13mm chuck, variable speed 0-2800 RPM, for wood, steel, and concrete drilling.",
        bullets: [
            "The DEWALT DWD024-B5 Percussion Drill is a compact yet powerful tool designed for precision and durability. With a 750W motor and a 13mm chuck capacity, it delivers reliable performance across drilling and hammer drilling applications. Its lightweight design ensures ease of use, while the rubber back handle provides enhanced comfort and control during extended tasks.",
            "Equipped with a variable speed trigger (0-2800 RPM), the drill allows users to start holes slowly for maximum accuracy, making it ideal for both professionals and DIY enthusiasts. The percussion function adds versatility, enabling efficient drilling into wood, steel, and concrete."
        ],
        specs: [
            { title: "Brand", text: "DEWALT" },
            { title: "Power source", text: "AC" },
            { title: "Maximum rotational speed", text: "2800 RPM" },
            { title: "Maximum chuck size", text: "13 mm" },
            { title: "Voltage", text: "240 V" }
        ],
        technical: [
            { title: "Manufacturer", text: "DeWalt" },
            { title: "Part number", text: "5035048448113" },
            { title: "Weight", text: "2.99 kg" },
            { title: "Dimensions", text: "31 x 26 x 8 cm" },
            { title: "Item model number", text: "DWD024- B5" },
            { title: "Colour", text: "Yellow/Black" },
            { title: "Style", text: "750W" },
            { title: "Material", text: "Plastic, Metal, Rubber" },
            { title: "Power Source type", text: "AC Corded" },
            { title: "Voltage", text: "240 Volts" },
            { title: "Wattage", text: "750 watts" },
            { title: "Maximum Power", text: "750 Watts" },
            { title: "Item Package Quantity", text: "1" },
            { title: "Speed", text: "2800 RPM" },
            { title: "Special Features", text: "Variable Speed" },
            { title: "Included components", text: "Drill, Instruction Manual, Kit Box" },
            { title: "Batteries Required?", text: "No" },
            { title: "Battery Cell Type", text: "Lithium Ion" }
        ]
    },
    // 6. DWE4010T-B5 - Angle Grinder 730W
    {
        categoryFilter: "tools",
        category: "DeWalt Angle Grinder",
        partNumber: "DWE4010T-B5",
        stockAllocated: "",
        overview: "DEWALT 115MM, 730W TOGGLE SWITCH ANGLE GRINDER",
        standardPrice: "200",
        amazonPrice: "",
        weight: "17",
        freightCharges: "49",
        sellingPriceWithFreight: "187.61",
        newAmazonSellingPrice: "210",
        brand: "DEWALT",
        amazonLink: "https://www.amazon.ae/dp/DWE4010T-B5",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774346571/image1_iey0bi.jpg",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774346559/image2_sdlice.jpg",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774346558/image3_rrvguo.jpg",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1774346559/image4_wzeeyo.jpg"
        ],
        about: [
            "18V XR Brushless Motor - maximum efficiency and extended tool life",
            "Two-Speed Transmission - optimized control for heavy-duty and fine drilling tasks",
            "High Torque Output - adjustable settings for precision screw driving",
            "13mm Chuck with Spindle Lock - quick, one-handed bit changes",
            "LED Work Light - improved visibility in low-light conditions",
            "Ergonomic Design - rubber grip for enhanced comfort during prolonged use",
            "XR Lithium-Ion Battery System - compatible with multi-voltage chargers"
        ],
        description: "DEWALT DWE4010T-B5 115mm Angle Grinder with 730W motor, toggle switch, and compact design for cutting and grinding.",
        bullets: [
            "The DEWALT 18V XR Hammer Drill Driver is engineered for professionals who demand power, precision, and durability.",
            "Featuring XR Lithium-Ion battery technology and a brushless motor, it delivers longer runtime, reduced maintenance, and superior drilling performance.",
            "Compact and lightweight, it is ideal for confined spaces and extended use, while the hammer function ensures versatility across wood, steel, and masonry applications."
        ],
        specs: [
            { title: "Brand", text: "DEWALT" },
            { title: "Material", text: "Metal" },
            { title: "Power source", text: "AC" },
            { title: "Maximum rotational speed", text: "2800 RPM" },
            { title: "Maximum chuck size", text: "13 mm" },
            { title: "Voltage", text: "240 V" }
        ],
        technical: [
            { title: "Manufacturer", text: "Dewalt" },
            { title: "Part number", text: "DWE4010T-B5" },
            { title: "Weight", text: "2.4 kg" },
            { title: "Product Dimensions", text: "37.6 x 11 x 8 cm" },
            { title: "Item model number", text: "DWE4010T- B5" },
            { title: "Colour", text: "Yellow" },
            { title: "Style", text: "Angled" },
            { title: "Material", text: "Metal" },
            { title: "Power Source type", text: "AC Corded" },
            { title: "Voltage", text: "220 Volts" },
            { title: "Included components", text: "As per Description" },
            { title: "Batteries Required", text: "No" },
            { title: "ASIN", text: "B07G9KM3F9" },
            { title: "Date First Available", text: "15 January 2019" },
        ]
    },
    // 7. DWE4120-B5 - Angle Grinder 900W
    {
        categoryFilter: "tools",
        category: "DeWalt Angle Grinder",
        partNumber: "DWE4120-B5",
        stockAllocated: "",
        overview: "DEWALT 115MM, 900W PADDLE SWITCH ANGLE GRINDER",
        standardPrice: "230",
        amazonPrice: "",
        weight: "17",
        freightCharges: "49",
        sellingPriceWithFreight: "215.18",
        newAmazonSellingPrice: "302",
        brand: "DEWALT",
        amazonLink: "https://www.amazon.ae/dp/DWE4120-B5",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421648/51K06n6XenL._AC_SL1275__vhxc2t.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421671/71-rIAZzXjL._AC_SL1500__jh7ftz.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421673/71a_CfU2PjS._AC_SL1500__movx2r.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421633/71c56bK0C3L._AC_SL1500__jottzl.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421689/81Cp6a2ODTL._AC_SL1500__agm3aq.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421674/81EWmO_bKMS._AC_SL1500__gbpnv4.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421673/81HpkIvQ0HS._AC_SL1500__ybjgty.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421668/91hA87_i2GL._AC_SL1500__zym3vs.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421664/91hSjxz3z4L._AC_SL1500__vmhmb0.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421653/91B7XzKKDoL._AC_SL1500__r9uxvo.png"
        ],
        about: [
            "Powerful 900W motor delivers up to 12,000 RPM",
            "Slim, ergonomic design for better control",
            "One-Touch Adjustable Guard with 360° rotation",
            "Low-Profile Gear Case for tight spaces",
            "Quick-Change Wheel Release (tool-free)",
            "2-Position Side Handle for comfort and control"
        ],
        description: "DEWALT DWE4120-B5 Angle Grinder with 900W motor, 115mm disc, paddle switch, 12,000 RPM, and tool-free wheel change.",
        bullets: [
            "The DEWALT DWE4120-B5 Angle Grinder is a compact, high-performance tool designed for fast material removal, durability, and extended user comfort.",
            "Powered by a robust 900W motor, it delivers consistent performance for cutting, grinding, and finishing applications in professional and industrial environments."
        ],
        features: [
            { title: "Powerful 900W (9 Amp) Motor", text: "Delivers up to 12,000 RPM for faster material removal and improved overload protection." },
            { title: "Slim, Ergonomic Design", text: "Compact body ensures better control and reduced fatigue during prolonged use." },
            { title: "One-Touch Adjustable Guard", text: "Allows 360° guard rotation with a single action for quick positioning." },
            { title: "Low-Profile Gear Case", text: "Enhances durability and enables access to tight or confined spaces." },
            { title: "Quick-Change Wheel Release", text: "Tool-free wheel removal eliminates the need for a wrench." },
            { title: "2-Position Side Handle", text: "Removable handle provides enhanced comfort and control." },
            { title: "Universal Spindle Compatibility", text: "5/8\"-11 spindle thread accepts a wide range of 4-1/2\"(115 mm) accessories." }
        ],
        specs: [
            { title: "Brand", text: "DEWALT" },
            { title: "Material", text: "Metal" },
            { title: "Product Dimensions", text: "36.6 (L) × 12.6 (W) × 15.6 (H) cm" },
            { title: "Style", text: "Angle Grinder" },
            { title: "Power Source", text: "AC" }
        ],
        technical: [
            { title: "Brand", text: "DEWALT" },
            { title: "Model Number", text: "DWE4120-B5" },
            { title: "Power Output", text: "900 Watts" },
            { title: "Voltage", text: "220 V" },
            { title: "Power Source", text: "AC" },
            { title: "No-Load Speed", text: "12,000 RPM" },
            { title: "Disc Size", text: "115 mm (4-1/2\")" },
            { title: "Material", text: "Metal" },
            { title: "Spindle Thread", text: "5/8\"-11" },
            { title: "Dimensions", text: "36.6 x 12.6 x 15.6 cm" },
            { title: "Weight", text: "620g" },
            { title: "Colour", text: "Black" },
            { title: "Switch Type", text: "Paddle Switch" },
            { title: "Batteries Required", text: "No" },
            { title: "Package Quantity", text: "1" }
        ]
    },
    // 8. DWE4212-B5 - Angle Grinder 1200W
    {
        categoryFilter: "tools",
        category: "DeWalt Angle Grinder",
        partNumber: "DWE4212-B5",
        stockAllocated: "",
        overview: "DEWALT 115MM, 1200W PADDLE SWITCH SMALL ANGLE GRINDER",
        standardPrice: "310",
        amazonPrice: "",
        weight: "17",
        freightCharges: "49",
        sellingPriceWithFreight: "257.25",
        newAmazonSellingPrice: "289",
        brand: "DEWALT",
        amazonLink: "https://www.amazon.ae/dp/DWE4212-B5",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421605/81kifZlm9gL._AC_SL1500__aaorqk.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421618/81W6Exo4XOL._AC_SL1500__nbdppd.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421620/91EruL-9SPL._AC_SL1500__1_mi9o3s.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421623/91EruL-9SPL._AC_SL1500__ksqfhj.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421629/91JnX4MEffL._AC_SL1500__o6za3t.png"
        ],
        about: [
            "Non-locking paddle switch automatically switches off the grinder when released for enhanced safety",
            "High-efficiency motor delivers improved performance in demanding applications",
            "Dust ejection system removes most debris from the cooling air, preventing abrasion and extending motor life",
            "Small girth body design ensures a comfortable grip and superior ergonomics",
            "Anti-vibration side handle reduces user fatigue and improves control",
            "Compact gear case allows easy access to confined and hard-to-reach areas",
            "Fully leaded stator windings provide increased motor durability",
            "Pop-off carbon brushes protect the armature at the end of brush life, ensuring longer motor service life"
        ],
        description: "DeWalt DWE4212-B5 Angle Grinder with 1200W motor, 115mm disc, 11,000 RPM, paddle switch, dust ejection, and anti-vibration handle.",
        bullets: [
            "The DeWalt Angle Grinder with Toggle Switch delivers reliable power and durability for professional cutting and grinding tasks. Its efficient dust removal system protects the motor from debris, reducing wear and extending service life. The abrasion-protected motor and removable carbon brushes ensure long-term performance, while the anti-lock flange allows quick and easy disc changes.",
            "Designed for comfort and control, it features a tool-free adjustable safety guard, anti-vibration side handle, and a low-profile gearbox for access to tight spaces. A side-mounted spindle lock provides added protection when working in confined areas."
        ],
        specs: [
            { title: "Brand", text: "DeWalt" },
            { title: "Model", text: "DWE4212-B5" },
            { title: "Power Source", text: "Corded" },
            { title: "Voltage", text: "220V" },
            { title: "Blade Size", text: "4.5\" (115 mm)" },
            { title: "No-Load Speed", text: "11,000 RPM" },
            { title: "Warranty", text: "3 Years" },
        ],
        technical: [
            { title: "Power Source", text: "Corded" },
            { title: "Voltage", text: "220V" },
            { title: "Power Input", text: "1200 W" },
            { title: "Weight", text: "2.2 kg" },
            { title: "Blade Size", text: "115 mm" },
            { title: "Switch Type", text: "Paddle" },
            { title: "Dimensions", text: "286 x 80 mm" },
            { title: "No-Load Speed", text: "11,000 RPM" },
            { title: "Spindle Thread", text: "M14" },
            { title: "Weight", text: "2.2 kg" },
            { title: "Dimensions(L × H)", text: "286 × 80 mm" }
        ]
    }
];
const franklinMotors = [
    {
        categoryFilter: "motors",
        category: "Submersible Motor for Borewell Pumps",
        partNumber: "2247526700L",
        stockAllocated: "3 Nos (DXB18)",
        overview: "Franklin borehole motor 2.2Kw,1ph,230V,4\"",
        standardPrice: "1200",
        amazonPrice: "1200",
        weight: "17",
        freightCharges: "54",
        sellingPriceWithFreight: "1254",
        newAmazonSellingPrice: "1316.7",
        brand: "FRANKLIN",
        amazonLink: "",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422322/Picture1_uvoma3.png"
        ],
        about: [
            "Hermetically sealed stator with anti-track, self-healing stator resin prevents motor burn out",
            "High efficiency electrical design for low operation cost and cooler winding temperature",
            "Removable 'Water Bloc' lead connector",
            "Cable material according to drinking water regulations (KTW approved)",
            "Water lubricated radial and thrust bearings",
            "All motors prefilled and 100% tested",
            "Non contaminating, water-filled design",
            "For use with Franklin Electric control box",
            "Offers highest starting torque of all single phase motors"
        ],
        description: "Franklin Electric 4\" encapsulated 3-wire capacitor start single phase motor, manufactured to ISO 9001 standards. Together with Franklin Electric Control Boxes, offers maintenance-free long life operation with high starting torque and included motor protection.",
        bullets: [
            "Motor cable KTW, VDE approved (1,5m; special lengths available)",
            "Complete 316 SS Motor with SiC seal",
            "Built-in lightning arrestor"
        ],
        specs: [
            { title: "Power", text: "2.2 kW" },
            { title: "Phase", text: "Single Phase (1ph)" },
            { title: "Voltage", text: "230V" },
            { title: "Motor Size", text: "4\" / 100mm" },
            { title: "Flange", text: "4\" NEMA flange" },
            { title: "Protection", text: "IP68" }
        ],
        technical: [
            { title: "Rotation", text: "CCW facing shaft end" },
            { title: "Insulation", text: "Class B" },
            { title: "Rated Ambient Temp", text: "30°C" },
            { title: "Cooling Flow", text: "min 8 cm/sec (for 2.2 kW and larger)" },
            { title: "Starts per Hour", text: "20" },
            { title: "Mounting", text: "Vertical/Horizontal" },
            { title: "Voltage Tolerance", text: "+6% / -10% UN" },
            { title: "Motor Protection", text: "Included via Franklin Electric Control Boxes" }
        ]
    }
];
const globalWaterProducts = [
    {
        categoryFilter: "pressure-vessle",
        category: "Under the Sink RO System",
        partNumber: "AW-PRM-75-38-J-C",
        stockAllocated: "10 Nos (DXB18)",
        overview: "GWS AQUAWAVE PREMIUM, ALL IN ONE UNDER THE SINK RO SYSTEM 75GPD, 5 STAGES, 2.2GAL TANK, WITH PRV & PUMP",
        standardPrice: "1100",
        amazonPrice: "1300",
        weight: "10.1",
        freightCharges: "40.2",
        sellingPriceWithFreight: "1340.2",
        newAmazonSellingPrice: "1407.21",
        brand: "GLOBAL WATER SOLUTIONS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422636/Picture1_yiezev.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422639/Picture2_md01xh.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422642/Picture3_idjiba.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422645/Picture6_fbmjuk.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422648/Picture4_twgq7t.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422651/Picture5_mxc3vz.png"
        ],
        about: [
            "Reverse Osmosis purification method",
            "Under sink installation",
            "75GPD capacity with 5 stages",
            "2.2 gallon tank included",
            "With PRV & Pump", "Made in Turkey"
        ],
        bullets: [
            "Under the sink RO System GWS AQUAWAVE PREMIUM",
            "ALL IN ONE RO SYSTEM 75GPD",
            "5 STAGES,2.2GAL TANK, WITH PRV & PUMP",
            "GWS Aqua wave Premium 75gpd 5 stage",
            "Under the Sink RO system for Domestic Use",
            "1 year from the date of Invoice Against Manufacturing Defect",
            "Made In Turkey"
        ],
        specs: [
            { title: "Capacity", text: "2.2 Gallons / 75GPD" },
            { title: "Stages", text: "5" },
            { title: "Material", text: "Polyamide" },
            { title: "Installation", text: "Under Sink" },
            { title: "Power Source", text: "Corded Electric" }],
        technical: [
            { title: "Purification Method", text: "Reverse Osmosis" },
            { title: "Origin", text: "Turkey" }
        ]
    },
    {
        categoryFilter: "pressure-vessle",
        category: "Pressure Vessel",
        partNumber: "FLXCON-V-0060",
        stockAllocated: "10 Nos (DXB18)",
        overview: "GWS Challenger Series 60 Litres Pressure Steel Tank, 10 Bar, With round base",
        standardPrice: "675",
        amazonPrice: "800",
        weight: "12.25",
        freightCharges: "44.5",
        sellingPriceWithFreight: "844.5",
        newAmazonSellingPrice: "886.725",
        brand: "GLOBAL WATER SOLUTIONS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422658/Picture1_j3lbbm.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422661/Picture2_tgf80g.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422663/Picture3_cvdhqt.png"
        ],
        about: ["60 Liter capacity", "Pressure vessel for water systems", "3 years warranty against Manufacturing Defect", "Made in USA"],
        bullets: [
            "GWS Pressure Vessel Vertical Floor Standing type with Stand",
            "GWS Challenger Series 60 Litres",
            "Pressure Steel Tank",
            "10 Bar",
            "With round base",
            "GWS Challenger pressure vessel",
            "3 years from the date of Invoice Against Manufacturing Defect",
            "Made in USA"
        ],
        specs: [{ title: "Capacity", text: "60 Liters" }, { title: "Material", text: "Steel" }, { title: "Colour", text: "White" }, { title: "Shape", text: "Round" }],
        technical: [{ title: "Dimensions", text: "80 x 40 x 40 cm" }, { title: "Item Weight", text: "10 kg" }, { title: "Origin", text: "USA" }, { title: "Batteries Included?", text: "No" }, { title: "Batteries Required?", text: "No" }]
    },
    {
        categoryFilter: "pressure-vessle",
        category: "Anti Scaling System",
        partNumber: "OSP-20JB",
        stockAllocated: "2 Nos (DXB18)",
        overview: "GWS 20\" JUMBO ONESTOP PLUS HOUSING KIT (BSP VERSION) FOR DOMESTIC USE",
        standardPrice: "850",
        amazonPrice: "900",
        weight: "7.75",
        freightCharges: "35.5",
        sellingPriceWithFreight: "935.5",
        newAmazonSellingPrice: "982.275",
        brand: "GLOBAL WATER SOLUTIONS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422674/Picture1_ekgoon.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422677/Picture2_d2rxzg.png"
        ],
        about: ["Anti scaling system for domestic use", "20\" Jumbo housing kit", "BSP version"],
        description: "GWS Anti scaling System for Domestic Use 20\" JUMBO ONESTOP PLUS HOUSING KIT (BSP VERSION).",
        specs: [{ title: "Size", text: "20\" Jumbo" }, { title: "Type", text: "BSP Version" }, { title: "Category", text: "Water Purification Unit" }],
        technical: [{ title: "Manufacturer", text: "GLOBAL WATER SOLUTIONS" }, { title: "Batteries Included?", text: "No" }, { title: "Batteries Required?", text: "No" }]
    },
    {
        categoryFilter: "pressure-vessle",
        category: "Pressure Vessel",
        partNumber: "PEB-24L",
        overview: "GWS Econowave Series 24 Litres Pressure Steel Tank, 10 Bar, Inline Type, Without base",
        standardPrice: "120",
        amazonPrice: "200",
        weight: "4.1",
        freightCharges: "25",
        sellingPriceWithFreight: "63",
        newAmazonSellingPrice: "200",
        brand: "GLOBAL WATER SOLUTIONS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422628/Picture1_ks7tfa.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422630/Picture2_jxct3y.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422633/Picture3_h1aivs.png"
        ],
        about: [
            "High Capacity 24 Liter Tank Ensures reliable water pressure for household and commercial systems.",
            "Durable Steel Construction Corrosion-resistant design for long-lasting performance and strength.",
            "Max Pressure: 10 Bar Suitable for high-demand water supply and booster systems.",
            "Test Pressure: 14.3 Bar Rigorously tested for maximum safety and durability.",
            "Standard Recharge: 2 Bar Provides optimal efficiency, reduces pump cycling, and prolongs pump life.",
            "Versatile Applications Ideal for domestic use, irrigation, workshops, and light industrial water systems.",
            "Reliable Brand Manufactured by Global Water Solutions, known for trusted and high-quality water system components."
        ],
        description: "Oracz (Global Water Solutions) 24 Liter Water Pressure Tank. Built with premium-grade steel for domestic, commercial, and light industrial applications.",
        bullets: [
            "Ensure consistent and reliable water pressure in your home or workplace with the Oracz (Global Water Solutions) 24 Liter Water Pressure Tank.",
            "Built with premium-grade steel and engineered for durability, this booster tank is designed to handle high-pressure demands while maintaining long-lasting performance.",
            "With a maximum pressure of 10 Bar and a test pressure of 14.3 Bar, it delivers dependable results for domestic, commercial, and light industrial applications.",
            "Recharged at 2 Bar, the tank ensures optimal operation for boosting systems, reducing pump cycling, and extending the life of your water pump.",
            "Perfect for use in homes, offices, irrigation systems, and industrial setups, this pressure tank is a reliable solution to maintain stable water supply and performance."
        ],
        specs: [
            { title: "Brand", text: "ORACZ" },
            { title: "Colour", text: "Off-White" },
            { title: "Product dimensions", text: "30L x 30W x 45H centimetres" },
            { title: "Item weight", text: "3900 Grams" },
            { title: "Manufacturer", text: "JASI BUILDING MATERIALS TRADING LLC." }
        ],
        technical: [
            { title: "Manufacturer", text: "JASI BUILDING MATERIALS TRADING LLC." },
            { title: "Item Weight", text: "3.9 kg" },
            { title: "Dimensions", text: "30 x 30 x 45 cm" },
            { title: "Item model number", text: "PEB-24LX" },
            { title: "Colour", text: "Off-White" },
            { title: "Item Package Quantity", text: "1" },
            { title: "Batteries Included?", text: "No" },
            { title: "Batteries Required?", text: "No" },
            { title: "Date First Available", text: "7 September 2025" },
            { title: "ASIN", text: "B0FQ3M7VRK" },
            { title: "Item Model Number", text: "PEB-24LX" }
        ]
    },
    {
        categoryFilter: "pressure-vessle",
        category: "Pressure Vessel",
        partNumber: "PWB-60LV",
        overview: "GWS Pressure Wave Series 60 Litres Pressure Steel Tank, 10 Bar, With round base",
        standardPrice: "405",
        amazonPrice: "886",
        weight: "12.25",
        freightCharges: "40",
        sellingPriceWithFreight: "273",
        newAmazonSellingPrice: "700",
        brand: "GLOBAL WATER SOLUTIONS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422666/Picture1_g9nkde.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422669/Picture2_gen8em.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422672/Picture3_lck4ot.png"
        ],
        about: [
            "Ideal for booster systems, thermal expansion, irrigation systems, and hydraulic hammer arresting",
            "Virgin polypropylene liner with FDA approved high grade butyl diaphragm",
            "Patented stainless steel water connection",
            "UV and salt spray protection coating"
        ],
        description: "Global Water Solution Pressure Wave tanks represent the best value and are the best quality pressure vessels available. 1 year warranty.",
        bullets: [
            "Global Water Solution Pressure Wave tanks are ideally suited for a wide range of applications, including booster systems, thermal expansion, irrigation systems, and hydraulic hammer arresting.",
            "Global Water Solution Pressure Wave tanks are constructed of a virgin polypropylene liner combined with an FDA approved high grade butyl diaphragm. Water enters the tank through a patented stainless steel water connection. The diaphragm and liner are both reinforced in specific wear areas for longer life. All internal parts including the air valve are rounded to prevent piercing of the diaphragm in extreme conditions.",
            "Global Water Solution Pressure Wave tanks are quality tested at several stages on the production line to ensure the structural integrity of every tank. On the exterior the almond-coloured two-part polyurethane paint finish over an epoxy undercoating provides hundreds of hours of UV and salt spray protection. Global Water Solution Pressure Wave tanks represent the best value for the investment and are the best quality pressure vessels available today in the World.",
            "Tank pre-charge: 1.9 bar / 28 psi Maximum Working Pressure: 10 bar / 150 psi Maximum Working Temperature: 90¡C / 194¡F",
            "It is suitable to use in booster systems, thermal expansion, irrigation systems, and hydraulic hammer arresting. It is not RO Tank."
        ],
        specs: [{ title: "Capacity", text: "60 Liters" }, { title: "Pre-charge", text: "1.9 bar / 28 psi" }, { title: "Max Working Pressure", text: "10 bar / 150 psi" }, { title: "Max Working Temp", text: "90°C / 194°F" }],
        technical: [
            { title: "Indoor/Outdoor Usage", text: "Indoor" },
            { title: "Brand", text: "GLOBAL WATER" },
            { title: "Special Feature", text: "UV protection" },
            { title: "Item Weight", text: "15 kg" },
            { title: "Net Quantity", text: "1.0 Count" },
            { title: "Product Care Instructions", text: "Water" },
            { title: "USDA Hardiness Zone", text: "10" },
            { title: "Number of Pieces", text: "1" },
            { title: "Manufacturer", text: "Global Water Solutions Ltd" },
            { title: "Item part number", text: "GWSPWB60LVHP60TWh" },
            { title: "Package Dimensions", text: "64 x 40 x 16.5 cm" },
            { title: "ASIN", text: "B07P6RC3S8" },
        ]
    },
    {
        categoryFilter: "pressure-vessle",
        category: "Pressure Vessel",
        partNumber: "PWB-100LV",
        overview: "GWS Challenger Pressure Vessel 100L Pressure Steel Tank, 10 Bar, With round base",
        standardPrice: "560",
        amazonPrice: "800",
        weight: "20.1",
        sellingPriceWithFreight: "367.5",
        newAmazonSellingPrice: "800",
        brand: "GLOBAL WATER SOLUTIONS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422652/Picture1_p9b6ws.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422655/Picture2_ij7pyv.png"
        ],
        about: [
            "Virgin polypropylene liner and high-grade butyl diaphragm",
            "Patented stainless-steel water connection with dual water/air seal",
            "Ideal for booster systems and thermal expansion",
            "Round base",
            "3 years warranty against Manufacturing Defect",
            "Made in USA"
        ],
        description: "The Pressure Wave 100-liter vertical pressure tank is built for durability and reliability in demanding pressure applications. Robust carbon steel shell with dual-layer polyurethane paint for excellent corrosion resistance.",
        bullets: [
            "The Pressure Wave™ 100-liter / 26.42-gallon vertical pressure tank is built for durability and reliability in demanding pressure applications. Its virgin polypropylene liner and high-grade butyl diaphragm, clench-ring sealed and reinforced in critical areas, ensure longevity and efficiency. The patented stainless-steel water connection provides a dual water/air seal for leak-free operation.",
            "Pre-charged to 1.9 bar / 28 psi and fitted with a 1\" NPT connection, this vertical tank is ideal for high-capacity systems like booster systems or thermal expansion. Its robust carbon steel shell, finished with dual-layer polyurethane paint, guarantees excellent resistance to corrosion and wear.",
            "GWS Pressure Vessel Vertical Floor Standing type with Stand"
        ],
        specs: [{ title: "Capacity", text: "100 Liters / 26.42 Gallons" }, { title: "Connection", text: "1\" FNPT" }, { title: "Pre-charge", text: "1.9 bar / 28 psi" }, { title: "Max Pressure", text: "10 bar / 150 psi" }, { title: "Max Temp", text: "90°C / 194°F" }, { title: "Diameter", text: "43 cm / 16.9 in" }],
        technical: [{ title: "Weight", text: "19.72 kg" }, { title: "Material", text: "Steel" }, { title: "Colour", text: "White" }, { title: "Origin", text: "USA" }]
    }
];
const grundfosProducts = [
    {
        categoryFilter: "pump",
        category: "Booster Pump",
        partNumber: "92867630",
        overview: "Grundfos Electronic Pressure Control Kit PM1-15, 1.5 BAR",
        standardPrice: "275",
        freightCharges: "20",
        sellingPriceWithFreight: "350",
        weight: "1.65",
        brand: "GRUNDFOS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423150/Picture1_eivc8u.png"
        ],
        about: ["Automatic start/stop control", "Dry running protection", "1.5 bar start cut-in pressure", "Automatic restart"],
        description: "Grundfos PM START pressure manager designed for automatic start/stop control of water supply pumps with dry-running protection.",
        bullets: [
            "PM START is a basic control solution suitable for applications where start and stop operation of the pump according to consumption is needed.",
            "PM START starts the pump when a start cut-in pressure of 1.5 bar is reached and keeps the pump running as long as there is sufficient flow. PM START stops the pump in case of water shortage and protects it from dry running",
            "It offers basic control features as well as dry-running protection and automatic restart."
        ],
        specs: [{ title: "Pressure", text: "1.5 BAR" }],
        technical: [
            { title: "Manufacturer", text: "Groundfos" },
            { title: "Date First Available", text: "26 August 2023" },
            { title: "Weight", text: "1.06 kg" },
            { title: "Dimensions", text: "28 x 17.8 x 17.2 cm" },
            { title: "Batteries Required?", text: "No" }
        ]
    },
    {
        categoryFilter: "pump",
        category: "Horizontal Multistage Centrifugal Pump",
        partNumber: "92914823",
        overview: "Grundfos CM5-5 (2.0HP), 1ph, 230V, 1.25\" X 1.0\" Connections",
        standardPrice: "1850",
        amazonPrice: "2797",
        freightCharges: "50",
        weight: "17.4",
        brand: "GRUNDFOS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423121/Picture1_j4ks9d.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423125/Picture2_ffvdsd.png"
        ],
        about: [
            "Installation services are available upon request by Grundfos Trained Professionals",
            "Self-Priming Design - ideal for pressurizing water from above or below ground water sources",
            "Equipped with dry run protection - automatically stops if water source runs out, avoiding pump damage"
        ],
        description: "Multipurpose pump for optimal water pressure. Applications: Private homes/villas, Gardens, Schools, Hotels, Small office buildings.",
        bullets: [
            "Bringing a high degree of comfort to your homes",
            "CM is a multipurpose pump that ensures optimal water pressure at all times",
            "It's a modern advanced solution that brings comfort to people's homes",
            "Applications: Private homes/villas Gardens Schools Hotels Small office buildings"
        ],
        specs: [
            { title: "Brand", text: "Grundfos" },
            { title: "Colour", text: "Multi" },
            { title: "Material", text: "Stainless Steel" },
            { title: "Style", text: "Circulator" },
            { title: "Power source", text: "Electric" },
            { title: "Power", text: "2.0 HP" }
        ],
        technical: [
            { title: "Manufacturer", text: "Groundfos" },
            { title: "Weight", text: "16 kg" },
            { title: "Dimensions", text: "49.2 x 25 x 20.8 cm" },
            { title: "Item model number", text: "CM5-5" },
            { title: "Color", text: "Multi" },
            { title: "Style", text: "Circulator" },
            { title: "Material", text: "Stainless Steel" },
            { title: "Power source", text: "Electric" },
            { title: "Batteries Required?", text: "No" },
            { title: "Date First Available ", text: "2 April 2019" }
        ]
    },
    {
        categoryFilter: "pump",
        category: "Horizontal Multistage Centrifugal Pump",
        partNumber: "92914824",
        overview: "Grundfos CM5-4 (1.5HP), 1ph, 230V, 1.25\" X 1.0\" Connections",
        standardPrice: "1300",
        amazonPrice: "1990",
        freightCharges: "50",
        weight: "16.1",
        brand: "GRUNDFOS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423129/Picture1_rmyum5.png"
        ],
        about: [
            "Installation services are available upon request by Grundfos Trained Professionals",
            "Install easily with CM’s customized and compact design",
            "Self-Priming Design - ideal for pressurizing water from above or below ground water sources"
        ],
        description: "Multipurpose pump ensuring optimal water pressure for homes, gardens, schools, hotels, small office buildings.",
        bullets: [
            "Bringing a high degree of comfort to your homes",
            "CM is a multipurpose pump that ensures optimal water pressure at all times",
            "It’s a modern advanced solution that brings comfort to people’s homes Private homes/villas Gardens Schools Hotels Small office buildings"
        ],
        specs: [
            { title: "Brand", text: "Grundfos" },
            { title: "Colour", text: "Black" },
            { title: "Material", text: "Stainless Steel" },
            { title: "Style", text: "Above Ground" },
            { title: "Power source", text: "Corded Electric" },
        ],
        technical: [
            { title: "Manufacturer", text: "Groundfos" },
            { title: "Part number", text: "97901003 CM5-4" },
            { title: "Item Weight", text: "16 kg" },
            { title: "Dimensions", text: "39.6 x 24.2 x 20.5 cm" },
            { title: "Item model number", text: "97901003 CM5-4" },
            { title: "Color", text: "Black" },
            { title: "Style", text: "Above Ground" },
            { title: "Material", text: "Stainless Steel" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Power", text: "1.5 HP" },
            { title: "Batteries Required?", text: "No" },
            { title: "Date First Available", text: "2 April 2019" }
        ]
    },
    {
        categoryFilter: "pump",
        category: "Horizontal Multistage Centrifugal Pump",
        partNumber: "92914826",
        overview: "Grundfos CM5-3 (1HP), 1ph, 230V, 1.0\" X 1.0\" Connections",
        standardPrice: "895",
        amazonPrice: "1098",
        freightCharges: "45",
        weight: "14.4",
        brand: "GRUNDFOS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423143/Picture1_bdi5wl.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423147/Picture2_nzxzqs.png"
        ],
        about: ["Friendly user control panel", "One year warranty", "Self priming design"],
        description: "The Grundfos CM5-3 is a high-performance horizontal multistage centrifugal pump designed for efficient water transfer and pressure boosting applications. Built with durable materials and advanced engineering, it ensures reliable performance in residential, commercial, and light industrial environments.",
        features: [
            { title: "Performance & Build", text: "This multistage pump is engineered for high efficiency and consistent pressure output. Its robust construction using corrosion-resistant materials ensures long-lasting durability and minimal maintenance requirements." },
            { title: "Applications", text: "Water supply systems, Pressure boosting, Irrigation systems, Commercial and residential water transfer" }
        ],
        specs: [
            { title: "Brand", text: "Grundfos" },
            { title: "Colour", text: "Black" },
            { title: "Material", text: "Stainless Steel or Cast Iron or Thermoplastics like PVC or polypropylene" },
            { title: "Style", text: "Utilitarian" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Power", text: "1 HP" }
        ],
        technical: [
            { title: "Color", text: "Black" },
            { title: "Style", text: "Utilitarian" },
            { title: "Material", text: "Stainless Steel or Cast Iron or Thermoplastics like PVC or polypropylene" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Batteries Included?", text: "No" },
            { title: "Brand", text: "Grundfos" },
            { title: "Manufacturer", text: "Grundfos" },
            { title: "Item model number", text: "CM5-3" },
            { title: "Package Dimensions", text: "30 x 20 x 10 cm; 2 kg" }
        ]
    },
    {
        categoryFilter: "pump",
        category: "Booster Pump",
        partNumber: "93013322",
        overview: "Grundfos SCALA2 Intelligent Booster Pump for Domestic Application",
        standardPrice: "2250",
        amazonPrice: "2625",
        freightCharges: "40",
        weight: "12",
        brand: "GRUNDFOS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423159/Picture1_fst0pr.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423162/Picture2_aiuiii.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423166/Picture3_lrn2cj.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423169/Picture4_va3xpf.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423173/Picture5_phaepy.png"
        ],
        about: ["Intelligent pump control", "Low noise operation (47 dba)", "Up to 80% energy savings", "Suitable for villas with 3 floors and 8 taps"],
        description: "Smart water pump with intelligent boosting system. Perfect water pressure with automatic adjustment.",
        bullets: [
            "Save energy with Scala2's intelligent boosting system",
            "Perfect for villas with up to 3 floors and 8 taps",
            "Perfect water pressure: Intelligent pump control adjusts operation automatically",
            "Experience comfort with low noise operation",
            "Manage easily with our user-friendly control panel",
            "Save up to 80% energy compared to conventional pumps",
            "Low noise: as quiet as a modern dishwasher (47 dba) in typical use",
            "Easy selection: One variant for all domestic boosting needs",
            "Pump housing Material Cast Iron Boosting from wells",
            "Pumps water from a depth of 8 meters"
        ],
        specs: [
            { title: "Brand", text: "Grundfos" },
            { title: "Colour", text: "Multi" },
            { title: "Material", text: "Cast Iron" },
            { title: "Style", text: "Submersible" },
            { title: "Power Source", text: "Smart Electric Pump" }
        ],
        technical: [
            { title: "Manufacturer", text: "Grundfos" },
            { title: "Part number", text: "‎98562870" },
            { title: "Weight", text: "3.94 kg" },
            { title: "Dimensions", text: "46.4 x 37.4 x 25.4 cm" },
            { title: "Item model number", text: "‎98562870" },
            { title: "Color", text: "Multi" },
            { title: "Style", text: "Submersible" },
            { title: "Material", text: "Cast Iron" },
            { title: "Power Source type", text: "Smart Electric Pump" },
            { title: "Batteries Required?", text: "No" },
        ]
    },
    {
        categoryFilter: "pump",
        category: "Horizontal Multistage Centrifugal Pump",
        partNumber: "97900686",
        overview: "Grundfos CM5-5 (2.0HP), 1ph, 230V, 1.25\" X 1.0\" Connections",
        standardPrice: "1500",
        amazonPrice: "1842.54",
        freightCharges: "54.8",
        weight: "17.4",
        brand: "GRUNDFOS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423153/Picture1_qnr0yw.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423156/Picture2_u3rgxs.png"
        ],
        about: [
            "Installation services are available upon request by Grundfos Trained Professionals",
            "Self-Priming Design - ideal for pressurizing water from above or below ground water sources",
            "Equipped with dry run protection - automatically stops if water source runs out, avoiding pump damage"
        ],
        description: "Multipurpose pump for optimal water pressure. Applications: Private homes, gardens, schools, hotels.",
        bullets: [
            "Bringing a high degree of comfort to your homes",
            "CM is a multipurpose pump that ensures optimal water pressure at all times",
            "It's a modern advanced solution that brings comfort to people's homes"
        ],
        specs: [
            { title: "Brand", text: "Grundfos" },
            { title: "Colour", text: "Multi" },
            { title: "Material", text: "Stainless Steel" },
            { title: "Style", text: "Circulator" },
            { title: "Power source", text: "Electric" },
            { title: "Power", text: "2.0 HP" },
        ],
        technical: [
            { title: "Manufacturer", text: "Grundfos" },
            { title: "Weight", text: "16 kg" },
            { title: "Dimensions", text: "49.2 x 25 x 20.8 cm" },
            { title: "Item model number", text: "CM5-5" },
            { title: "Color", text: "Multi" },
            { title: "Style", text: "Circulator" },
            { title: "Material", text: "Stainless Steel" },
            { title: "Power source type", text: "Electric" },
            { title: "Batteries Required?", text: "No" },
            { title: "Date First Available", text: "2 April 2019" }
        ]
    },
    {
        categoryFilter: "pump",
        category: "Horizontal Multistage Centrifugal Pump",
        partNumber: "97901003",
        overview: "Grundfos CM5-4 (1.5HP), 1ph, 230V, 1.25\" X 1.0\" Connections",
        standardPrice: "900",
        amazonPrice: "1157.31",
        freightCharges: "52.2",
        weight: "16.1",
        brand: "GRUNDFOS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422998/Picture1_kuh0ph.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423000/Picture2_onboqz.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423002/Picture3_wnkmuu.png"
        ],
        about: [
            "Installation services are available upon request by Grundfos Trained Professionals",
            "Install easily with CM’s customized and compact design",
            "Self-Priming Design - ideal for pressurizing water from above or below ground water sources"
        ],
        description: "Multipurpose pump ensuring optimal water pressure for residential and commercial applications.",
        bullets: [
            "Bringing a high degree of comfort to your homes",
            "CM is a multipurpose pump that ensures optimal water pressure at all times",
            "It’s a modern advanced solution that brings comfort to people’s homes Private homes/villas Gardens Schools Hotels Small office buildings"
        ],
        specs: [
            { title: "Brand", text: "Grundfos" },
            { title: "Colour", text: "Black" },
            { title: "Material", text: "Stainless Steel" },
            { title: "Style", text: "Above Ground" },
            { title: "Power source", text: "Corded Electric" },
        ],
        technical: [
            { title: "Manufacturer", text: "Groundfos" },
            { title: "Part number", text: "97901003 CM5-4" },
            { title: "Weight", text: "16 kg" },
            { title: "Dimensions", text: "39.6 x 24.2 x 20.5 cm" },
            { title: "Item model number", text: "97901003 CM5-4" },
            { title: "Colour", text: "Black" },
            { title: "Style", text: "Above Ground" },
            { title: "Material", text: "Stainless Steel" },
            { title: "Power source type", text: "Corded Electric" },
            { title: "Power", text: "1.5 HP" },
            { title: "Batteries Required?", text: "No" },
        ]
    },
    {
        categoryFilter: "pump",
        category: "Horizontal Multistage Centrifugal Pump",
        partNumber: "98279546",
        overview: "Grundfos CM5-3 (1HP), 1ph, 230V, 1.0\" X 1.0\" Connections",
        standardPrice: "625",
        amazonPrice: "838.74",
        freightCharges: "48.8",
        weight: "14.4",
        brand: "GRUNDFOS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423131/Picture1_b8irxb.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423134/Picture2_dkhcij.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423137/Picture3_i0pv8j.png"
        ],
        about: [
            "Installation services are available upon request by Grundfos Trained Professionals",
            "Self-Priming Design - ideal for pressurizing water from above or below ground water sources",
            "Equipped with dry run protection - automatically stops if water source runs out, avoiding pump damage"
        ],
        description: "Multipurpose pump for optimal water pressure in private homes, gardens, schools, hotels.",
        bullets: [
            "Bringing a high degree of comfort to your homes",
            "CM is a multipurpose pump that ensures optimal water pressure at all times",
            "It’s a modern advanced solution that brings comfort to people’s homes Private homes/villas Gardens Schools Hotels Small office buildings"
        ],
        specs: [
            { title: "Brand", text: "Grundfos" },
            { title: "Colour", text: "Black" },
            { title: "Material", text: "Stainless Steel" },
            { title: "Style", text: "Above Ground" },
            { title: "Power source", text: "Electric" },
            { title: "Power", text: "1 HP" },
        ],
        technical: [
            { title: "Manufacturer", text: "Grundfos" },
            { title: "Part number", text: "98279546 CM5-3" },
            { title: "Weight", text: "16 kg" },
            { title: "Dimensions", text: "39.4 x 25.4 x 20.6 cm" },
            { title: "Item model number", text: "CM Horizontal Multipurpose Pump 5-3" },
            { title: "Colour", text: "Black" },
            { title: "Style", text: "Above Ground" },
            { title: "Material", text: "Stainless Steel" },
            { title: "Power source", text: "Electric" },
            { title: "Batteries Required?	", text: "No" },
            { title: "", text: "" },
            { title: "", text: "" },
        ]
    },
    {
        categoryFilter: "pump",
        category: "Booster Pump",
        partNumber: "98562870",
        overview: "Grundfos SCALA2 Intelligent Booster Pump for Domestic Application",
        standardPrice: "1900",
        amazonPrice: "2460.78",
        freightCharges: "43.6",
        weight: "11.8",
        brand: "GRUNDFOS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423006/Picture1_pzyvtj.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423065/Picture2_bn11iz.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423085/Picture3_b8akjm.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423119/Picture4_hwpnvl.png"
        ],
        about: [
            "Intelligent pump control",
            "Low noise (47 dba)",
            "Up to 80% energy savings",
            "Pumps from 8m depth"
        ],
        description: "Smart water pump perfect for villas with up to 3 floors and 8 taps with intelligent boosting.",
        bullets: [
            "Save energy with Scala2’s intelligent boosting system",
            "Perfect for villas with up to 3 floors and 8 taps",
            "Perfect water pressure: Intelligent pump control adjusts operation automatically",
            "Experience comfort with low noise operation",
            "Manage easily with our user-friendly control panel",
            "Save up to 80% energy compared to conventional pumps",
            "Low noise: as quiet as a modern dishwasher (47 dba) in typical Use",
            "Easy selection: One variant for all domestic boosting needs Pump housing Material Cast Iron Boosting from wells",
            "Pumps water from a depth of 8 meters"
        ],
        specs: [
            { title: "Brand", text: "Grundfos" },
            { title: "Material", text: "Cast Iron" },
            { title: "Well Depth", text: "8 meters" }
        ],
        technical: [
            { title: "Manufacturer", text: "Grundfos" },
            { title: "Part number", text: "98562870" },
            { title: "Weight", text: "3.94 kg" },
            { title: "Dimensions", text: "46.4 x 37.4 x 25.4 cm" },
            { title: "Item model number", text: "98562870" },
            { title: "Colour", text: "Multi" },
            { title: "Style", text: "Submersible" },
            { title: "Material", text: "Cast Iron" },
            { title: "Power source type", text: "Smart Electric Pump" },
            { title: "Batteries Required?", text: "No" },
            { title: "ASIN", text: "B07PQZSXRX" },
            { title: "Date First Available", text: "16 March 2019" },
        ]
    },
    {
        categoryFilter: "pump",
        category: "Inline Circulator Pump",
        partNumber: "99206629",
        overview: "Grundfos ALPHA SOLAR 25-75 N 180 Hot Water Circulation Pump, 1X230V",
        standardPrice: "625",
        sellingPriceWithFreight: "850",
        freightCharges: "25",
        weight: "2.7",
        brand: "GRUNDFOS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423140/Picture1_mjidnc.png"
        ],
        about: [
            "High-efficiency pump with EC permanent magnet motor technology (electronically commutated motor)",
            "Suitable for use in solar systems with variable or constant flow rate",
            "Speed can be controlled via a signal supplied by the solar system controller",
            "Without PWM signal, the Alpha Solar can be set to one of four constant speeds",
            "Quick and easy installation - easy installation and maintenance-free"
        ],
        description: "High-efficiency circulation pump for solar systems with variable or constant flow rate. Energy efficiency index ≤ 0.20.",
        bullets: [
            "Grundfos High Efficiency Circulation Pump Alpha Solar 25-75 180 mm",
            "The Grundfos Alpha Solar high-efficiency circulation pump is suitable for use in solar systems with variable or constant volume flow.",
            "However, high-efficiency pumps with electronically commutated motor (ECM), such as the Alpha Solar, must not be controlled via an external speed controller that changes or varies the supply voltage.",
            "The speed can be controlled via a pulse width modulated signal (PWM signal) supplied by the solar system controller to optimise the solar energy yield and the system temperature.",
            "This also significantly reduces the power consumption of the pump.",
            "If no PWM signal is available, the Alpha Solar can be set to one of four constant speeds. The pump is then only switched on or off via the control.",
            "High-efficiency EC permanent magnet motor technology.",
            "Energy efficiency index (EEI) ≤ 0.20 according to EN 16297-3: 2012 Best in Class",
            "PWM signal C. The PWM signal is a method of generating an analog signal from a digital source",
            "4 constant speeds, Maintenance-free, Low noise, Easy to install, Deblocking screw."
        ],
        features: [
            { title: "Box Contents", text: "1 x pump, 1 x Alpha Male PWM Male, 2 x sealing rings, 1 x user manual. Attention: A screw connection for connecting the pump is not included." },
        ],
        specs: [
            { title: "Brand", text: "Grundfos" },
            { title: "Colour", text: "Schwarz" },
            { title: "Material", text: "Gusseisen" },
            { title: "Style", text: "Circulation pump" },
            { title: "Power source type", text: "Corded Electric" },
        ],
        technical: [
            { title: "Manufacturer", text: "Grundfos" },
            { title: "Part number", text: "98989300" },
            { title: "Weight", text: "2.14 kg" },
            { title: "Item model number", text: "ALPHA" },
            { title: "Color", text: "Schwarz" },
            { title: "Style", text: "Circulation pump" },
            { title: "Material", text: "Gusseisen" },
            { title: "Power source type", text: "Corded Electric" },
            { title: "Voltage", text: "230V" },
            { title: "Item Package Quantity", text: "1" },
            { title: "Batteries Included?", text: "No" },
            { title: "Batteries Required ?", text: "No" },
            { title: "Temperature Range", text: "2-110°C" },
            { title: "Installation Length", text: "180 mm" },
            { title: "Maximum discharge height", text: "7.5 m" },
            { title: "Pump housing", text: "Grey cast iron" },
            { title: "Max. Operating pressure", text: "10 bar" },
            { title: "Nominal width", text: "G 1 1/2 inch" },
            { title: "Installation length", text: "180 mm" },
            { title: "Media temperature range", text: "2 - 110 °C" },
            { title: "Media temperature", text: "60 °C" },
            { title: "Power consumption P1", text: "2 - 45 watts" },
            { title: "Maximum current consumption", text: "0.04 - 0.52 A" },
            { title: "Mains frequency", text: "50 Hz" },
            { title: "Rated voltage", text: "1 x 230 V" },
            { title: "Protection class (IEC 34-5)", text: "X4D" },
            { title: "Energy (EEI)", text: "0.20" }
        ]
    }
];

const productsSources = [
    aristonProducts,
    craneProducts,
    dewaltProducts,
    franklinMotors,
    globalWaterProducts,
    grundfosProducts,
];

const products = [
    {
        id: 1,
        modelsCount: 3,
        images: ["/products/pump.png", "/products/pump2.png"],
        price: 4000,
        partnerId: 0
    },
    {
        id: 2,
        modelsCount: 2,
        images: ["/products/submersible-pump.png"],
        price: 5000,
        partnerId: 0
    },
    {
        id: 3,
        modelsCount: 3,
        images: ["/products/multistage-pump.png"],
        price: 3000,
        partnerId: 3
    },
    {
        id: 4,
        modelsCount: 3,
        images: ["/products/fire-fighting.png"],
        price: 6000,
        partnerId: 4
    },
    {
        id: 5,
        modelsCount: 3,
        images: ["/products/booster-skid.png"],
        price: 7000,
        partnerId: 5
    }
];

// export const getProduct = async (id) => {
//     const t = await getTranslations("Products");
//     const product = products.find(p => p.id === Number(id));
//     if (!product) return null;

//     let models = [];
//     for (let i = 1; i <= product.modelsCount; i++) {
//         models.push(t(`Product${product.id}.Models.Model${i}`));
//     }

//     return {
//         ...product,
//         name: t(`Product${product.id}.Name`),
//         models
//     };
// };

// export const getProducts = async () => {
//     const t = await getTranslations("Products");
//     return products.map(product => {
//         let models = [];
//         for (let i = 1; i < product.modelsCount; i++) {
//             models.push(t(`Product${product.id}.Models.Model${i}`));
//         }
//         return {
//             ...product,
//             name: t(`Product${product.id}.Name`),
//             models
//         };
//     });
// };

// export const getProductsByIds = async (ids) => {
//     const t = await getTranslations("Products");
//     const idSet = ids.map(Number);

//     return products
//         .filter(product => idSet.includes(product.id))
//         .map(product => {
//             const models = [];
//             for (let i = 1; i < product.modelsCount; i++) {
//                 models.push(t(`Product${product.id}.Models.Model${i}`));
//             }

//             return {
//                 ...product,
//                 name: t(`Product${product.id}.Name`),
//                 models,
//             };
//         });
// };

export const combineProductsWithCart = async (products, cart) => {
    if (!Array.isArray(products) || !Array.isArray(cart)) return [];

    return cart
        .map(({ productId, quantity, modelIndex }) => {
            const product = products.find(
                (p) => p.id === Number(productId)
            );

            if (!product) return null;

            return {
                ...product,
                quantity,
                modelIndex
            };
        })
        .filter(Boolean);
};

export default products;