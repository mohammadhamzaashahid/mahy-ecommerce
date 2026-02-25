// import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import categories from "./categories";

const productsPerPage = 16;

export const getNewProducts = async (brand, page, category, price_min, price_max) => {
    if (brand === "ariston")
        return getPaginatedProducts(aristonProducts, page, category, price_min, price_max)
    else if (brand === "crane")
        return getPaginatedProducts(craneProducts, page, category, price_min, price_max)
    else if (brand === "dewalt")
        return getPaginatedProducts(dewaltProducts, page, category, price_min, price_max)
    else if (brand === "franklin")
        return getPaginatedProducts(franklinMotors, page, category, price_min, price_max)
    else if (brand === "globalWater")
        return getPaginatedProducts(globalWaterProducts, page, category, price_min, price_max)
    else if (brand === "grundfos")
        return getPaginatedProducts(grundfosProducts, page, category, price_min, price_max)
    else {
        return await getPaginatedRandomProducts(page, category, price_min, price_max);
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
                name: product.overview,
                price: parseFloat(product.standardPrice),
                image: product.images[0],
                quantity,
            };
        })
        .filter(Boolean);
};

const getPaginatedProducts = (products, page, category, price_min, price_max) => {
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;

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

export const getPaginatedRandomProducts = async (page, category, price_min, price_max) => {
    const cookieStore = await cookies();
    const cookieKey = "randomProductsByPage";

    const storedCookie = cookieStore.get(cookieKey)?.value;
    const stored = storedCookie ? JSON.parse(storedCookie) : {};

    const pageKey = `page_${page}`;
    let allProducts = productsSources.flat();
    const total = allProducts.length;
    const totalPages = Math.ceil(total / productsPerPage);

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
            "Titanium enamelled tank for durability: This premium quality water heater the best tank protection with the properties of titanium, wich constitutes a perfect shield against corrosion. Every single component is developed to ensure longlasting high performance with the guarantee of Ariston Brand",
            "Maximum Comfort: Andris series products are able to keep the water hot for a long time thanks to the thick high-density polyurethane insulation placed in the tank and the outside of the water heater. It provides an effective barrier against heat losses, optimizing both the performance of the product and the usersâ€ comfort. The models of the Andris series are equipped with an immersion thermostat, which allows a very precise adjustment of the water temperature, heating it to the desired point",
            "Installation kits to be purchased separately"
        ],
        description: "The Andris R is an unvented electric storage water heater and part of Ariston's market-leading Andris range. This easy to install entry model offers impressive hot water performance and fast reheat times. Safety, durability, and design are what the Andris Lux range stands for, making it perfect for comfort ina myriad of domestic and light commercial applications. Its compact, light-weight body and front panel are the finest composition of Italian design, studied to compliment any environment. The front panel takes centre-stage with the Ariston wave, equipped with a mechanical dial for simple usability, and an Ariston red heating lamp. The Andris R is available in 10 and 15 litre versions and unvented installation kits are available separately. While boasting an elegant design by Italian designer Umberto Palermo, this compact water heating unit, also promises extra durability through a copper heating element, ensures optimum water efficiency through the Flexomix technology, and total safety guaranteed by all ARISTON products all over the world. Please note that this product specifically complies with regulations on the UK market and is KIWA certified.",
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
            { title: "Batteries Required", text: "No" },
            { title: "Brand", text: "Ariston" },
            { title: "Brand", text: "Ariston" },
            { title: "Brand", text: "Ariston" },
            { title: "Brand", text: "Ariston" },
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
            "Hygienic packaging",
            "Temperature regulation",
            "Glass lined inner tank tested at 16 bars",
            "Oversized magnesium anode",
            "Pressure safety valve tested at 8 bar",
            "Copper heating element"
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
        description: "Electric Water Heater",
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
            { title: "Batteries Required", text: "No" },
            { title: "ASIN", text: "B07MJ8BQD7" }
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
            "Manufacturer: Ariston",
            "WaterPlus Technology: up to 16% more hot water available",
            "Compliant with top regulations",
            "External Temperature Setting",
            "Double Safety Thermostat",
            "Robust Insulation Material (Polyurethane)",
            "Magnesium anode to fight corrosion",
            "High Quality titanium enameled tank",
            "7 Years Tank Warranty",
            "Designed in Italy",
            "Modern shape with 'Ariston Wave'"
        ],
        description: "WaterPlus Technology: up to 16% more hot water available. Compliant with top regulations. External Temperature Setting. Double Safety Thermostat. Robust Insulation Material (Polyurethane). Magnesium anode to fight corrosion. High Quality titanium enameled tank. 7 Years Tank Warranty. Designed in Italy. Modern shape with 'Ariston Wave'.",
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
        specs: [
            { title: "Brand", text: "Ariston" },
            { title: "Capacity", text: "50 Liters" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Product dimensions", text: "55W x 80H centimetres" },
            { title: "Colour", text: "WHITE" }
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
            { title: "Batteries Required", text: "No" },
            { title: "ASIN", text: "B07S3R2B3X" }
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
            { title: "Included components", text: "SAFETY VALVE" },
            { title: "Batteries Required", text: "No" },
            { title: "ASIN", text: "B07S2QPC13" }
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
        description: "Ariston Electric Water Heater 100 Litter Horizontal Pro-R Italy",
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
            { title: "Weight", text: "25KG" },
            { title: "Depth", text: "480mm" },
            { title: "Height", text: "450mm" },
            { title: "Width", text: "913mm" },
            { title: "Water Heater Type", text: "Tank Water Heater" },
            { title: "Power Source Type", text: "Electric" },
            { title: "Country of Origin", text: "Italy" }
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
        description: "BLU R 80 Liters Vertical Installation Electric Water Heater COMFORT External temperature regulation EFFICIENCY & ENERGY SAVING Extra thick polyurethane insulation.",
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
        description: "Brand: Ariston. Colour: White. Weight: 17 Kg. Depth: 480MM. Height: 450MM. Width: 603MM. Power Source Type: Electric. Water Heater Type: Tank Water Heater. Model Number: BLU-R 50LH. Capacity: 50 Liter.",
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
            { title: "Weight", text: "17 Kg" },
            { title: "Depth", text: "480MM" },
            { title: "Height", text: "450MM" },
            { title: "Width", text: "603MM" },
            { title: "Power Source Type", text: "Electric" },
            { title: "Water Heater Type", text: "Tank Water Heater" }
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
            { title: "Batteries Required", text: "No" },
            { title: "ASIN", text: "B07MQ9QD35" }
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
        specs: [
            { title: "Brand", text: "Ariston" },
            { title: "Capacity", text: "50 Liters" },
            { title: "Power source", text: "Corded Electric" },
            { title: "Product dimensions", text: "55W x 80H centimetres" },
            { title: "Colour", text: "WHITE" }
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
            { title: "Batteries Required", text: "No" },
            { title: "ASIN", text: "B07S3R2B3X" }
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
            { title: "Color", text: "white" },
            { title: "Style", text: "tank" },
            { title: "Material", text: "Titanium" },
            { title: "Power source type", text: "Corded Electric" },
            { title: "Item Package Quantity", text: "1" },
            { title: "Plug Profile", text: "Floor" },
            { title: "Included components", text: "SAFETY VALVE" },
            { title: "Batteries Required", text: "No" },
            { title: "ASIN", text: "B07S2QPC13" }
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
        description: "Weight: 25KG. Depth: 480mm. Height: 450mm. Width: 913mm. Model Number: PRO-R 100H. Water Heater Type: Tank Water Heater. Power Source Type: Electric. Brand: Ariston. Country of Origin: Italy.",
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
            { title: "Item Weight", text: "150 g" },
            { title: "Weight", text: "25KG" },
            { title: "Depth", text: "480mm" },
            { title: "Height", text: "450mm" },
            { title: "Width", text: "913mm" },
            { title: "Water Heater Type", text: "Tank Water Heater" },
            { title: "Power Source Type", text: "Electric" },
            { title: "Country of Origin", text: "Italy" }
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
        weight: "0.269",
        freightCharges: "",
        sellingPriceWithFreight: "",
        newAmazonSellingPrice: "",
        brand: "CRANE",
        amazonLink: "",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769418510/valve_converted_xgfz0v.png"
        ],
        about: [
            "Crane gate valves offer the ultimate in dependable service wherever minimum pressure drop is important",
            "The D151 carries the British Standards Institution kitemark - your assurance of exacting quality standards",
            "WRAS approved for use on wholesome (potable) water"
        ],
        description: "Bronze Gate Valve, Non-Rising Stem, Solid Wedge, Screwed Bonnet, in accordance with BS EN 12288:2010, PN20 rated. Body, Bonnet and disc to Bronze to BS EN 1982 CC491K. Valves are manufactured in accordance with BS EN 12288: 2010 PN20 Series B and are BSI Kitemark approved.",
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
            { title: "Item Weight", text: "0.269 kg" },
            { title: "Dimensions", text: "50mm x 78mm x 52.5mm" },
            { title: "Body Material", text: "Bronze BS EN 1982 CC491K" },
            { title: "Stem Material", text: "DZR Brass BS EN 12164 CW602N" },
            { title: "Disc Material", text: "Bronze BS EN 1982 CC491K" },
            { title: "Packing", text: "Asbestos Free" },
            { title: "UK End Connection", text: "Taper threaded to BS EN 10226-2 (ISO 7-1)" },
            { title: "Operator", text: "Handwheel" }
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
        weight: "0.5",
        freightCharges: "",
        sellingPriceWithFreight: "",
        newAmazonSellingPrice: "",
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
        specs: [
            { title: "Brand", text: "Generic" },
            { title: "Size", text: "PN20 3/4''" },
            { title: "Material", text: "Bronze" },
            { title: "Colour", text: "Golden" },
            { title: "Exterior Finish", text: "Bronze" }
        ],
        technical: [
            { title: "Manufacturer", text: "Generic" },
            { title: "Part Number", text: "0EA04307Q" },
            { title: "Item Weight", text: "500 g" },
            { title: "Product Dimensions", text: "9.2 x 4.9 x 9.2 cm" },
            { title: "Item Model Number", text: "3/4''" },
            { title: "ASIN", text: "B0D9B9YVVC" },
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
        weight: "0.593",
        freightCharges: "",
        sellingPriceWithFreight: "",
        newAmazonSellingPrice: "",
        brand: "CRANE",
        amazonLink: "",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769418513/valve_image_1_unlxgk.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769418511/valve_image_2_m2kupy.png"
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
        description: "Bronze Gate Valve, Non-Rising Stem, Solid Wedge, Screwed Bonnet, in accordance with BS EN 12288:2010, PN20 rated. Body, Bonnet and disc to Bronze to BS EN 1982 CC491K. DZR Brass Stem to CW602N. PTFE packing ring complete with Brass packing gland and nut design. WRAS approved and BSI Kitemark approved.",
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
            { title: "Item Weight", text: "0.593 kg" },
            { title: "Dimensions", text: "62mm x 105mm x 65mm" },
            { title: "Body Material", text: "Bronze BS EN 1982 CC491K" },
            { title: "Stem Material", text: "DZR Brass BS EN 12164 CW602N" },
            { title: "Disc Material", text: "Bronze BS EN 1982 CC491K" },
            { title: "Packing", text: "Asbestos Free" },
            { title: "UK End Connection", text: "Taper threaded to BS EN 10226-2 (ISO 7-1)" },
            { title: "US End Connection", text: "ANSI B1.20.1" },
            { title: "Operator", text: "Handwheel" }
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
            "The D151 carries the British Standards Institution kitemark – your assurance of exacting quality standards",
            "WRAS approved for use on wholesome (potable) water in sizes 1/2\"-2\" only"
        ],
        description: "PN20 Bronze Gate Valve with taper threaded connection to BS EN 10226-2 (ISO 7-1) formerly BS 21. Available in sizes 1/4\" to 4\".",
        specs: [
            { title: "Brand", text: "Crane" },
            { title: "Size", text: "1.1/4\"" },
            { title: "Valve Body Material", text: "Bronze" },
            { title: "Pressure Class", text: "PN20" },
            { title: "Connection Type", text: "Taper threaded to BS EN 10226-2 (ISO 7-1)" }
        ],
        technical: [
            { title: "Manufacturer", text: "Crane" },
            { title: "Part Number", text: "0EA04309S" },
            { title: "Item Number", text: "D151" },
            { title: "Item Weight", text: "0.844 kg" },
            { title: "Dimensions", text: "71mm x 111mm x 70mm" },
            { title: "Size Range", text: "1/4\" to 4\"" }
        ]
    },
    // DM931 Variable Orifice Double Regulating Valves
    {
        categoryFilter: "crane",
        category: "Crane Variable Orifice Double Regulating Valve",
        partNumber: "0JG90606A",
        overview: "CRANE F678L 2.1/2\" BUTTERFLY VALVE PN16 DI BODY FULLY LUGGED LEVER OPERATED EPDM LINER ALUMINIUM BRONZE DISC",
        standardPrice: "220.90",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420943/Picture1_b8bwbg.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420945/Picture2_v8o8vd.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420960/Picture3_q2kecj.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420953/Picture4_e1cd1j.png"
        ],
        about: [
            "These are Y-Pattern globe valves supplied with two pressure test points P84 to provide flow measurement, regulation and isolation",
            "The Double Regulating feature allows the valve to be used for isolation and to be reopened to its pre-set position to maintain required flow rate",
            "Primarily used in injection or other circuits requiring a double regulating valve for system balancing",
            "Accuracy of flow measurement is ±10% at the full open position of the valve",
            "Some reduction in accuracy occurs at partial openings of the valve in accordance with BS 7350"
        ],
        description: "Variable Orifice Double Regulating Valve (DRV) – Ductile Iron. These are Y-Pattern globe valves supplied with two pressure test points P84 to provide flow measurement, regulation and isolation.",
        specs: [
            { title: "Size Range", text: "DN65 to DN300" },
            { title: "Pressure Rating", text: "PN16" },
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
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420967/Picture4_c9azai.png"
        ],
        about: [
            "These are Y-Pattern globe valves supplied with two pressure test points P84 to provide flow measurement, regulation and isolation",
            "The Double Regulating feature allows the valve to be used for isolation and to be reopened to its pre-set position to maintain required flow rate",
            "Primarily used in injection or other circuits requiring a double regulating valve for system balancing",
            "Accuracy of flow measurement is ±10% at the full open position of the valve",
            "Some reduction in accuracy occurs at partial openings of the valve in accordance with BS 7350"
        ],
        description: "DM931 Variable Orifice Double Regulating Valve (DRV) – Ductile Iron DN65 to DN300.",
        specs: [
            { title: "Size Range", text: "DN65 to DN300" },
            { title: "Pressure Rating", text: "PN16" },
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
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420980/Screenshot_2026-01-23_162658_oofjyl.png"
        ],
        about: [
            "A generous use of pipeline strainers will make a significant contribution to the reliability of a piping system and to optimise performance of the equipment - pumps, valves, flow measuring devices, traps etc",
            "Strainers are a low cost investment for any piping system and result in reduced maintenance costs as well as minimising 'downtime' by protecting the circuit from damage by foreign matter"
        ],
        description: "D298 Bronze Strainer with SS304 mesh, WRAS approved, BSPT connection, PN16 rated.",
        specs: [
            { title: "Size", text: "1/2\" (DN15)" },
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
            { title: "ID Plate", text: "Aluminium" },
            { title: "Mesh Hole", text: "0.75mm" },
            { title: "Weight", text: "0.16 kg" }
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
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420989/Screenshot_2026-01-23_162658_e1kfny.png"
        ],
        about: [
            "A generous use of pipeline strainers will make a significant contribution to the reliability of a piping system and to optimise performance of the equipment - pumps, valves, flow measuring devices, traps etc",
            "Strainers are a low cost investment for any piping system and result in reduced maintenance costs as well as minimising 'downtime' by protecting the circuit from damage by foreign matter"
        ],
        description: "D298 Bronze Strainer with SS304 mesh, WRAS approved, BSPT connection, PN16 rated.",
        specs: [
            { title: "Size", text: "3/4\" (DN20)" },
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
            { title: "ID Plate", text: "Aluminium" },
            { title: "Mesh Hole", text: "0.75mm" },
            { title: "Weight", text: "0.28 kg" }
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
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420981/Screenshot_2026-01-23_162658_sykxzs.png"
        ],
        about: [
            "A generous use of pipeline strainers will make a significant contribution to the reliability of a piping system and to optimise performance of the equipment - pumps, valves, flow measuring devices, traps etc",
            "Strainers are a low cost investment for any piping system and result in reduced maintenance costs as well as minimising 'downtime' by protecting the circuit from damage by foreign matter"
        ],
        description: "D298 Bronze Strainer with SS304 mesh, WRAS approved, BSPT connection, PN16 rated.",
        specs: [
            { title: "Size", text: "1\" (DN25)" },
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
            { title: "ID Plate", text: "Aluminium" },
            { title: "Mesh Hole", text: "0.75mm" },
            { title: "Weight", text: "0.38 kg" }
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
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420955/Screenshot_2026-01-23_162658_kgnzt8.png"
        ],
        about: [
            "A generous use of pipeline strainers will make a significant contribution to the reliability of a piping system and to optimise performance of the equipment - pumps, valves, flow measuring devices, traps etc",
            "Strainers are a low cost investment for any piping system and result in reduced maintenance costs as well as minimising 'downtime' by protecting the circuit from damage by foreign matter"
        ],
        description: "D298 Bronze Strainer with SS304 mesh, WRAS approved, BSPT connection, PN16 rated.",
        specs: [
            { title: "Size", text: "1.1/4\" (DN32)" },
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
            { title: "ID Plate", text: "Aluminium" },
            { title: "Mesh Hole", text: "1.4mm" },
            { title: "Weight", text: "0.64 kg" }
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
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420958/Screenshot_2026-01-23_162658_sraqqv.png"
        ],
        about: [
            "A generous use of pipeline strainers will make a significant contribution to the reliability of a piping system and to optimise performance of the equipment - pumps, valves, flow measuring devices, traps etc",
            "Strainers are a low cost investment for any piping system and result in reduced maintenance costs as well as minimising 'downtime' by protecting the circuit from damage by foreign matter"
        ],
        description: "D298 Bronze Strainer with SS304 mesh, WRAS approved, BSPT connection, PN16 rated.",
        specs: [
            { title: "Size", text: "1.1/2\" (DN40)" },
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
            { title: "ID Plate", text: "Aluminium" },
            { title: "Mesh Hole", text: "1.4mm" },
            { title: "Weight", text: "0.88 kg" }
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
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420988/Screenshot_2026-01-23_162658_g47noe.png"
        ],
        about: [
            "A generous use of pipeline strainers will make a significant contribution to the reliability of a piping system and to optimise performance of the equipment - pumps, valves, flow measuring devices, traps etc",
            "Strainers are a low cost investment for any piping system and result in reduced maintenance costs as well as minimising 'downtime' by protecting the circuit from damage by foreign matter"
        ],
        description: "D298 Bronze Strainer with SS304 mesh, WRAS approved, PN16 rated.",
        specs: [
            { title: "Size", text: "2\" (DN50)" },
            { title: "Pressure Rating", text: "PN16" },
            { title: "Temperature Rating", text: "-10 to 100°C" },
            { title: "WRAS Approval", text: "-10 to 85°C" }
        ],
        technical: [
            { title: "Body", text: "Bronze to BS EN 1982 CC491K" },
            { title: "Mesh", text: "Stainless Steel to A.I.S.I. Type 304" },
            { title: "Cap Seal", text: "PTFE" },
            { title: "Cap", text: "Bronze to BS EN 1982 CC491K" },
            { title: "ID Plate", text: "Aluminium" },
            { title: "Mesh Hole", text: "1.4mm" },
            { title: "Weight", text: "1.40 kg" }
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
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420969/Picture1_nqrpok.png"
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
        partNumber: "0JG92985K",
        overview: "CRANE F678L 3\" BUTTERFLY VALVE PN16 DI BODY FULLY LUGGED LEVER OPERATED EPDM LINER ALUMINIUM BRONZE DISC",
        standardPrice: "253.10",
        brand: "CRANE",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420963/Picture1_dswqya.png"
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
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420972/Picture1_wkasqh.png"
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
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420984/Picture1_micw9q.png"
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
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769420976/Picture1_drjylw.png"
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
    }
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
        weight: "4.3",
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
            "3-in-1 Functionality: Rotary drilling, hammer drilling, and chiselling – all powered by an 800W motor",
            "Variable Speed Trigger: Smooth control with forward/reverse options for total versatility",
            "Rotation-Stop Mode: Perfect for light chiselling in brick, soft masonry, and occasional concrete work",
            "Mechanical Clutch: Protects against sudden torque spikes if the bit jams",
            "Ergonomic Design: Rounded grip ensures comfort during extended use",
            "Professional Range: Ideal for anchor and fixing holes in concrete/masonry (4–26 mm diameter)"
        ],
        description: "DEWALT D25133K 26mm 3-Mode SDS Plus Hammer with 800W motor, 2.6 joules impact energy, rotating brush ring, and dust extraction compatibility.",
        specs: [
            { title: "Power", text: "800W" },
            { title: "Impact Energy", text: "2.6 Joules" },
            { title: "Max Speed", text: "1500 RPM" },
            { title: "Voltage", text: "240V AC" },
            { title: "Amperage", text: "7 Amps" }
        ],
        technical: [
            { title: "Weight", text: "4.3 kg" },
            { title: "Colour", text: "Yellow/Black" },
            { title: "Material", text: "Metal" },
            { title: "Torque", text: "3.6 Newton Meters" },
            { title: "Power Source", text: "Corded Electric" }
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
        weight: "4.6",
        freightCharges: "49",
        sellingPriceWithFreight: "435.75",
        newAmazonSellingPrice: "489",
        brand: "DEWALT",
        amazonLink: "https://www.amazon.ae/dp/DCD796D2W",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421593/61G0GECDsSL._AC_SL1200__btvkds.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421587/610VxMj66zL._AC_SL1200__sdko9g.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421591/518lx4XQYEL._AC_SL1200__b7r08x.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421591/518lx4XQYEL._AC_SL1200__b7r08x.png"
        ],
        about: [
            "Ultra-Compact & Lightweight Design: Designed for comfortable handling and extended use",
            "Advanced Brushless Motor Technology: Delivers higher efficiency, longer runtime, and extended tool life",
            "Hammer Drill Driver Functionality: Ideal for drilling and fastening across wood, metal, and masonry",
            "Two-Speed High-Performance Transmission: Allows precise speed control",
            "Professional-Grade Portability: Supplied with a tough nylon kit bag"
        ],
        description: "DEWALT DCD796D2W XR 18V Cordless Hammer Drill Driver with brushless motor, 2x 2.0Ah batteries, charger, and kit bag.",
        specs: [
            { title: "Voltage", text: "18V" },
            { title: "Battery Type", text: "Lithium-Ion" },
            { title: "Battery Capacity", text: "2.0 Ah" },
            { title: "Number of Batteries", text: "2" },
            { title: "Motor", text: "Brushless" }
        ],
        technical: [
            { title: "Weight", text: "4.6 kg" },
            { title: "Colour", text: "Yellow" },
            { title: "Material", text: "Metal" },
            { title: "Included", text: "2x Batteries, Charger, Belt Hook, Bit Holder, Nylon Kit Bag" }
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
        weight: "4.1",
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
            "18V XR Li-Ion Compact Drill Driver with XR 1.3Ah battery technology",
            "Two-speed settings with variable speed and reverse switch",
            "15-position adjustable torque control for consistent screw driving",
            "Bright white LED with delay feature for improved visibility",
            "13mm single sleeve chuck & spindle lock for quick bit changes",
            "Ergonomic design with rubber grip for enhanced comfort"
        ],
        description: "Dewalt DCD776S2-B5 18V Li-Ion Cordless Compact Hammer Drill Driver with two-speed gearbox, 15-position torque control, and 13mm chuck.",
        specs: [
            { title: "Voltage", text: "18V" },
            { title: "Max Speed", text: "1500 RPM" },
            { title: "Chuck Size", text: "13mm" },
            { title: "Max Power", text: "400W" },
            { title: "Torque", text: "42 Nm" }
        ],
        technical: [
            { title: "Weight", text: "4.1 kg" },
            { title: "Dimensions", text: "39 x 34 x 11.8 cm" },
            { title: "Battery Capacity", text: "1.5 Ah" },
            { title: "Battery Type", text: "Lithium-Ion" },
            { title: "Colour", text: "Yellow/Black" }
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
        weight: "2.0",
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
            "3 Modes: drilling, hammer drilling, and chiselling",
            "Compact & Lightweight (2 kg) for reduced fatigue",
            "4.0Ah Li-ion Battery included for extended runtime",
            "Ergonomic design with comfortable grip"
        ],
        description: "DEWALT DCH133M1 18V brushless cordless hammer with 26mm SDS-Plus chuck, 3-mode operation, and 4.0Ah battery.",
        specs: [
            { title: "Voltage", text: "18V" },
            { title: "Chuck Type", text: "SDS-Plus 26mm" },
            { title: "Modes", text: "3 (Drill, Hammer Drill, Chisel)" },
            { title: "Max Speed", text: "1550 RPM" },
            { title: "Max Power", text: "72W" }
        ],
        technical: [
            { title: "Weight", text: "2 kg (tool only)" },
            { title: "Battery Capacity", text: "4.0 Ah" },
            { title: "Battery Type", text: "Lithium-Ion" },
            { title: "Motor", text: "Brushless" },
            { title: "Colour", text: "Black" }
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
        weight: "2.99",
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
            "Drilling Capacity: Wood – 25 mm, Steel – 13 mm, Concrete – 16 mm",
            "Variable speed trigger (0–2800 RPM) for precision control",
            "13mm chuck with spindle lock for quick bit changes",
            "Compact & lightweight design for improved handling",
            "Rubber back handle for user comfort"
        ],
        description: "DEWALT DWD024-B5 Percussion Drill with 750W motor, 13mm chuck, variable speed 0-2800 RPM, for wood, steel, and concrete drilling.",
        specs: [
            { title: "Power", text: "750W" },
            { title: "Max Speed", text: "2800 RPM" },
            { title: "Chuck Size", text: "13mm" },
            { title: "Voltage", text: "240V AC" },
            { title: "Drilling Capacity", text: "Wood 25mm, Steel 13mm, Concrete 16mm" }
        ],
        technical: [
            { title: "Weight", text: "2.99 kg" },
            { title: "Dimensions", text: "31 x 26 x 8 cm" },
            { title: "Colour", text: "Yellow/Black" },
            { title: "Material", text: "Plastic, Metal, Rubber" },
            { title: "Power Source", text: "AC Corded" }
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
        weight: "2.4",
        freightCharges: "49",
        sellingPriceWithFreight: "187.61",
        newAmazonSellingPrice: "210",
        brand: "DEWALT",
        amazonLink: "https://www.amazon.ae/dp/DWE4010T-B5",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421603/51IL4uVw7mL._AC_SL1500__avzejp.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421596/513i86x3PiL._AC_SL1392__-_Copy_-_Copy_vgqsxe.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421675/81S4BwmXETL._AC_SL1500__kt6joq.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769421606/71GOOhcsiwL._AC_SL1500__ndojqo.png"
        ],
        about: [
            "730W motor for reliable grinding performance",
            "115mm disc diameter for versatile applications",
            "Toggle switch for easy operation",
            "Compact design for access to tight spaces",
            "Ergonomic grip for user comfort"
        ],
        description: "DEWALT DWE4010T-B5 115mm Angle Grinder with 730W motor, toggle switch, and compact design for cutting and grinding.",
        specs: [
            { title: "Power", text: "730W" },
            { title: "Disc Size", text: "115mm" },
            { title: "Voltage", text: "220V AC" },
            { title: "Switch Type", text: "Toggle" }
        ],
        technical: [
            { title: "Weight", text: "2.4 kg" },
            { title: "Dimensions", text: "37.6 x 11 x 8 cm" },
            { title: "Colour", text: "Yellow" },
            { title: "Material", text: "Metal" },
            { title: "Power Source", text: "AC Corded" }
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
        weight: "0.62",
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
        specs: [
            { title: "Power", text: "900W" },
            { title: "Disc Size", text: "115mm" },
            { title: "No-Load Speed", text: "12,000 RPM" },
            { title: "Voltage", text: "220V AC" },
            { title: "Spindle Thread", text: "5/8\"-11" }
        ],
        technical: [
            { title: "Weight", text: "620g" },
            { title: "Dimensions", text: "36.6 x 12.6 x 15.6 cm" },
            { title: "Colour", text: "Black" },
            { title: "Switch Type", text: "Paddle Switch" },
            { title: "Material", text: "Metal" }
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
        weight: "2.2",
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
            "Non-locking paddle switch for enhanced safety",
            "High-efficiency 1200W motor for demanding applications",
            "Dust ejection system extends motor life",
            "Small girth body for comfortable grip",
            "Anti-vibration side handle reduces fatigue",
            "Pop-off carbon brushes protect armature"
        ],
        description: "DeWalt DWE4212-B5 Angle Grinder with 1200W motor, 115mm disc, 11,000 RPM, paddle switch, dust ejection, and anti-vibration handle.",
        specs: [
            { title: "Power", text: "1200W" },
            { title: "Disc Size", text: "115mm" },
            { title: "No-Load Speed", text: "11,000 RPM" },
            { title: "Voltage", text: "220V" },
            { title: "Spindle Thread", text: "M14" }
        ],
        technical: [
            { title: "Weight", text: "2.2 kg" },
            { title: "Dimensions", text: "286 x 80 mm" },
            { title: "Switch Type", text: "Paddle" },
            { title: "Warranty", text: "3 Years" },
            { title: "Power Source", text: "Corded" }
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
        weight: "17 kg",
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
            "Offers highest starting torque of all single phase motors"
        ],
        description: "Franklin Electric 4\" encapsulated 3-wire capacitor start single phase motor, manufactured to ISO 9001 standards. Together with Franklin Electric Control Boxes, offers maintenance-free long life operation with high starting torque and included motor protection.",
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
        weight: "10.1 kg",
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
        about: ["Reverse Osmosis purification method", "Under sink installation", "75GPD capacity with 5 stages", "2.2 gallon tank included", "With PRV & Pump", "Made in Turkey"],
        description: "GWS Aqua wave Premium 75gpd 5 stage Under the Sink RO system for Domestic Use. 1 year warranty from the date of Invoice against Manufacturing Defect.",
        specs: [{ title: "Capacity", text: "2.2 Gallons / 75GPD" }, { title: "Stages", text: "5" }, { title: "Material", text: "Polyamide" }, { title: "Installation", text: "Under Sink" }, { title: "Power Source", text: "Corded Electric" }],
        technical: [{ title: "Purification Method", text: "Reverse Osmosis" }, { title: "Origin", text: "Turkey" }]
    },
    {
        categoryFilter: "pressure-vessle",
        category: "Pressure Vessel",
        partNumber: "FLXCON-V-0060",
        stockAllocated: "10 Nos (DXB18)",
        overview: "GWS Challenger Series 60 Litres Pressure Steel Tank, 10 Bar, With round base",
        standardPrice: "675",
        amazonPrice: "800",
        weight: "12.25 kg",
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
        description: "GWS Pressure Vessel Vertical Floor Standing type with Stand. GWS Challenger Series 60 Litres Pressure Steel Tank, 10 Bar, With round base.",
        specs: [{ title: "Capacity", text: "60 Liters" }, { title: "Material", text: "Steel" }, { title: "Colour", text: "White" }, { title: "Shape", text: "Round" }],
        technical: [{ title: "Dimensions", text: "80 x 40 x 40 cm" }, { title: "Item Weight", text: "10 kg" }, { title: "Origin", text: "USA" }]
    },
    {
        categoryFilter: "pressure-vessle",
        category: "Anti Scaling System",
        partNumber: "OSP-20JB",
        stockAllocated: "2 Nos (DXB18)",
        overview: "GWS 20\" JUMBO ONESTOP PLUS HOUSING KIT (BSP VERSION) FOR DOMESTIC USE",
        standardPrice: "850",
        amazonPrice: "900",
        weight: "7.75 kg",
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
        technical: [{ title: "Manufacturer", text: "GLOBAL WATER SOLUTIONS" }]
    },
    {
        categoryFilter: "pressure-vessle",
        category: "Pressure Vessel",
        partNumber: "PEB-24L",
        overview: "GWS Econowave Series 24 Litres Pressure Steel Tank, 10 Bar, Inline Type, Without base",
        standardPrice: "120",
        amazonPrice: "200",
        weight: "4.1 kg",
        freightCharges: "25",
        sellingPriceWithFreight: "63",
        newAmazonSellingPrice: "200",
        brand: "GLOBAL WATER SOLUTIONS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422628/Picture1_ks7tfa.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422630/Picture2_jxct3y.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422633/Picture3_h1aivs.png"
        ],
        about: ["24 Liter capacity", "Max Pressure: 10 Bar", "Test Pressure: 14.3 Bar", "Standard Recharge: 2 Bar", "Corrosion-resistant design", "Reduces pump cycling and prolongs pump life"],
        description: "Oracz (Global Water Solutions) 24 Liter Water Pressure Tank. Built with premium-grade steel for domestic, commercial, and light industrial applications.",
        specs: [{ title: "Capacity", text: "24 Liters" }, { title: "Max Pressure", text: "10 Bar" }, { title: "Test Pressure", text: "14.3 Bar" }, { title: "Standard Recharge", text: "2 Bar" }, { title: "Colour", text: "Off-White" }],
        technical: [{ title: "Dimensions", text: "30 x 30 x 45 cm" }, { title: "Item Weight", text: "3.9 kg" }, { title: "Model", text: "PEB-24LX" }]
    },
    {
        categoryFilter: "pressure-vessle",
        category: "Pressure Vessel",
        partNumber: "PWB-60LV",
        overview: "GWS Pressure Wave Series 60 Litres Pressure Steel Tank, 10 Bar, With round base",
        standardPrice: "405",
        amazonPrice: "886",
        weight: "12.25 kg",
        freightCharges: "40",
        sellingPriceWithFreight: "273",
        newAmazonSellingPrice: "700",
        brand: "GLOBAL WATER SOLUTIONS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422666/Picture1_g9nkde.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422669/Picture2_gen8em.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422672/Picture3_lck4ot.png"
        ],
        about: ["Ideal for booster systems, thermal expansion, irrigation systems, and hydraulic hammer arresting", "Virgin polypropylene liner with FDA approved high grade butyl diaphragm", "Patented stainless steel water connection", "UV and salt spray protection coating"],
        description: "Global Water Solution Pressure Wave tanks represent the best value and are the best quality pressure vessels available. 1 year warranty.",
        specs: [{ title: "Capacity", text: "60 Liters" }, { title: "Pre-charge", text: "1.9 bar / 28 psi" }, { title: "Max Working Pressure", text: "10 bar / 150 psi" }, { title: "Max Working Temp", text: "90°C / 194°F" }],
        technical: [{ title: "Weight", text: "15 kg" }, { title: "Dimensions", text: "64 x 40 x 16.5 cm" }, { title: "Special Feature", text: "UV protection" }]
    },
    {
        categoryFilter: "pressure-vessle",
        category: "Pressure Vessel",
        partNumber: "PWB-100LV",
        overview: "GWS Challenger Pressure Vessel 100L Pressure Steel Tank, 10 Bar, With round base",
        standardPrice: "560",
        amazonPrice: "800",
        weight: "20.1 kg",
        sellingPriceWithFreight: "367.5",
        newAmazonSellingPrice: "800",
        brand: "GLOBAL WATER SOLUTIONS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422652/Picture1_p9b6ws.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422655/Picture2_ij7pyv.png"
        ],
        about: ["Virgin polypropylene liner and high-grade butyl diaphragm", "Patented stainless-steel water connection with dual water/air seal", "Ideal for booster systems and thermal expansion", "3 years warranty against Manufacturing Defect", "Made in USA"],
        description: "The Pressure Wave 100-liter vertical pressure tank is built for durability and reliability in demanding pressure applications. Robust carbon steel shell with dual-layer polyurethane paint for excellent corrosion resistance.",
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
        weight: "1.65 kg",
        brand: "GRUNDFOS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423150/Picture1_eivc8u.png"
        ],
        about: ["Automatic start/stop control", "Dry running protection", "1.5 bar start cut-in pressure", "Automatic restart"],
        description: "Grundfos PM START pressure manager designed for automatic start/stop control of water supply pumps with dry-running protection.",
        specs: [{ title: "Pressure", text: "1.5 BAR" }],
        technical: [{ title: "Weight", text: "1.06 kg" }, { title: "Dimensions", text: "28 x 17.8 x 17.2 cm" }]
    },
    {
        categoryFilter: "pump",
        category: "Horizontal Multistage Centrifugal Pump",
        partNumber: "92914823",
        overview: "Grundfos CM5-5 (2.0HP), 1ph, 230V, 1.25\" X 1.0\" Connections",
        standardPrice: "1850",
        amazonPrice: "2797",
        freightCharges: "50",
        weight: "17.4 kg",
        brand: "GRUNDFOS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423121/Picture1_j4ks9d.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423125/Picture2_ffvdsd.png"
        ],
        about: ["Installation services available", "Self-priming design", "Dry run protection", "Compact design"],
        description: "Multipurpose pump for optimal water pressure. Applications: Private homes/villas, Gardens, Schools, Hotels, Small office buildings.",
        specs: [{ title: "Power", text: "2.0 HP" }, { title: "Material", text: "Stainless Steel" }],
        technical: [{ title: "Weight", text: "16 kg" }, { title: "Dimensions", text: "49.2 x 25 x 20.8 cm" }, { title: "Style", text: "Circulator" }]
    },
    {
        categoryFilter: "pump",
        category: "Horizontal Multistage Centrifugal Pump",
        partNumber: "92914824",
        overview: "Grundfos CM5-4 (1.5HP), 1ph, 230V, 1.25\" X 1.0\" Connections",
        standardPrice: "1300",
        amazonPrice: "1990",
        freightCharges: "50",
        weight: "16.1 kg",
        brand: "GRUNDFOS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423129/Picture1_rmyum5.png"
        ],
        about: ["Installation services available", "Self-priming design", "Compact design"],
        description: "Multipurpose pump ensuring optimal water pressure for homes, gardens, schools, hotels, small office buildings.",
        specs: [{ title: "Power", text: "1.5 HP" }, { title: "Material", text: "Stainless Steel" }],
        technical: [{ title: "Weight", text: "16 kg" }, { title: "Dimensions", text: "39.6 x 24.2 x 20.5 cm" }, { title: "Style", text: "Above Ground" }]
    },
    {
        categoryFilter: "pump",
        category: "Horizontal Multistage Centrifugal Pump",
        partNumber: "92914826",
        overview: "Grundfos CM5-3 (1HP), 1ph, 230V, 1.0\" X 1.0\" Connections",
        standardPrice: "895",
        amazonPrice: "1098",
        freightCharges: "45",
        weight: "14.4 kg",
        brand: "GRUNDFOS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423143/Picture1_bdi5wl.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423147/Picture2_nzxzqs.png"
        ],
        about: ["Friendly user control panel", "One year warranty", "Self priming design"],
        description: "Multipurpose pump for optimal water pressure in residential and commercial applications.",
        specs: [{ title: "Power", text: "1 HP" }, { title: "Material", text: "Stainless Steel" }],
        technical: [{ title: "Color", text: "Black" }, { title: "Power Source", text: "Corded Electric" }]
    },
    {
        categoryFilter: "pump",
        category: "Booster Pump",
        partNumber: "93013322",
        overview: "Grundfos SCALA2 Intelligent Booster Pump for Domestic Application",
        standardPrice: "2250",
        amazonPrice: "2625",
        freightCharges: "40",
        weight: "12 kg",
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
        specs: [{ title: "Material", text: "Cast Iron" }, { title: "Style", text: "Submersible" }],
        technical: [{ title: "Weight", text: "3.94 kg" }, { title: "Dimensions", text: "46.4 x 37.4 x 25.4 cm" }, { title: "Power Source", text: "Smart Electric Pump" }]
    },
    {
        categoryFilter: "pump",
        category: "Horizontal Multistage Centrifugal Pump",
        partNumber: "97900686",
        overview: "Grundfos CM5-5 (2.0HP), 1ph, 230V, 1.25\" X 1.0\" Connections",
        standardPrice: "1500",
        amazonPrice: "1842.54",
        freightCharges: "54.8",
        weight: "17.4 kg",
        brand: "GRUNDFOS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423153/Picture1_qnr0yw.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423156/Picture2_u3rgxs.png"
        ],
        about: ["Installation services available", "Self-priming design", "Dry run protection"],
        description: "Multipurpose pump for optimal water pressure. Applications: Private homes, gardens, schools, hotels.",
        specs: [{ title: "Power", text: "2.0 HP" }, { title: "Material", text: "Stainless Steel" }],
        technical: [{ title: "Weight", text: "16 kg" }, { title: "Dimensions", text: "49.2 x 25 x 20.8 cm" }, { title: "Style", text: "Circulator" }]
    },
    {
        categoryFilter: "pump",
        category: "Horizontal Multistage Centrifugal Pump",
        partNumber: "97901003",
        overview: "Grundfos CM5-4 (1.5HP), 1ph, 230V, 1.25\" X 1.0\" Connections",
        standardPrice: "900",
        amazonPrice: "1157.31",
        freightCharges: "52.2",
        weight: "16.1 kg",
        brand: "GRUNDFOS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769422998/Picture1_kuh0ph.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423000/Picture2_onboqz.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423002/Picture3_wnkmuu.png"
        ],
        about: ["Installation services available", "Self-priming design", "Compact design"],
        description: "Multipurpose pump ensuring optimal water pressure for residential and commercial applications.",
        specs: [{ title: "Power", text: "1.5 HP" }, { title: "Material", text: "Stainless Steel" }],
        technical: [{ title: "Weight", text: "16 kg" }, { title: "Dimensions", text: "39.6 x 24.2 x 20.5 cm" }]
    },
    {
        categoryFilter: "pump",
        category: "Horizontal Multistage Centrifugal Pump",
        partNumber: "98279546",
        overview: "Grundfos CM5-3 (1HP), 1ph, 230V, 1.0\" X 1.0\" Connections",
        standardPrice: "625",
        amazonPrice: "838.74",
        freightCharges: "48.8",
        weight: "14.4 kg",
        brand: "GRUNDFOS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423131/Picture1_b8irxb.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423134/Picture2_dkhcij.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423137/Picture3_i0pv8j.png"
        ],
        about: ["Installation services available", "Self-priming design", "Dry run protection"],
        description: "Multipurpose pump for optimal water pressure in private homes, gardens, schools, hotels.",
        specs: [{ title: "Power", text: "1 HP" }, { title: "Material", text: "Stainless Steel" }],
        technical: [{ title: "Weight", text: "16 kg" }, { title: "Dimensions", text: "39.4 x 25.4 x 20.6 cm" }]
    },
    {
        categoryFilter: "pump",
        category: "Booster Pump",
        partNumber: "98562870",
        overview: "Grundfos SCALA2 Intelligent Booster Pump for Domestic Application",
        standardPrice: "1900",
        amazonPrice: "2460.78",
        freightCharges: "43.6",
        weight: "11.8 kg",
        brand: "GRUNDFOS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423006/Picture1_pzyvtj.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423065/Picture2_bn11iz.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423085/Picture3_b8akjm.png",
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423119/Picture4_hwpnvl.png"
        ],
        about: ["Intelligent pump control", "Low noise (47 dba)", "Up to 80% energy savings", "Pumps from 8m depth"],
        description: "Smart water pump perfect for villas with up to 3 floors and 8 taps with intelligent boosting.",
        specs: [{ title: "Material", text: "Cast Iron" }, { title: "Well Depth", text: "8 meters" }],
        technical: [{ title: "Weight", text: "3.94 kg" }, { title: "Dimensions", text: "46.4 x 37.4 x 25.4 cm" }]
    },
    {
        categoryFilter: "pump",
        category: "Inline Circulator Pump",
        partNumber: "99206629",
        overview: "Grundfos ALPHA SOLAR 25-75 N 180 Hot Water Circulation Pump, 1X230V",
        standardPrice: "625",
        sellingPriceWithFreight: "850",
        freightCharges: "25",
        weight: "2.7 kg",
        brand: "GRUNDFOS",
        images: [
            "https://res.cloudinary.com/dpn6mdpxd/image/upload/v1769423140/Picture1_mjidnc.png"
        ],
        about: ["EC permanent magnet motor", "Suitable for solar systems", "PWM signal control", "4 constant speeds", "Maintenance-free"],
        description: "High-efficiency circulation pump for solar systems with variable or constant flow rate. Energy efficiency index ≤ 0.20.",
        specs: [{ title: "Max Height", text: "7.5 m" }, { title: "Max Pressure", text: "10 bar" }, { title: "Power", text: "2-45 watts" }],
        technical: [{ title: "Weight", text: "2.14 kg" }, { title: "Voltage", text: "230V" }, { title: "Temperature Range", text: "2-110°C" }, { title: "Installation Length", text: "180 mm" }]
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