"use client"

import Cookies from 'js-cookie';
import { useEffect } from "react"

function StoreProductsInCookies({ cookieKey, stored }) {
    useEffect(() => {
        Cookies.set(cookieKey, JSON.stringify(stored), { expires: 7 });
    }, []);
    return (
        <></>
    )
}

export default StoreProductsInCookies