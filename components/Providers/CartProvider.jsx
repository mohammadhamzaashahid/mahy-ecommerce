"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
    DEFAULT_CURRENCY,
    readCartFromCookies,
    removeCartItem,
    setCartItemQuantity,
    upsertCartItem,
    writeCartToCookies,
} from "@/utils/products";

const CartContext = createContext(null);

export default function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setItems(readCartFromCookies());
    }, []);

    const persistItems = useCallback((updater) => {
        setItems((prev) => {
            const nextValue = typeof updater === "function" ? updater(prev) : updater;
            return writeCartToCookies(nextValue);
        });
    }, []);

    const addItem = useCallback(
        (item, quantity = 1) => {
            persistItems((prev) => upsertCartItem(prev, { ...item, quantity }));
        },
        [persistItems]
    );

    const incrementItem = useCallback(
        (productId) => {
            persistItems((prev = []) =>
                prev.map((entry) =>
                    entry.productId === productId
                        ? { ...entry, quantity: entry.quantity + 1 }
                        : entry
                )
            );
        },
        [persistItems]
    );

    const decrementItem = useCallback(
        (productId) => {
            persistItems((prev = []) =>
                prev
                    .map((entry) =>
                        entry.productId === productId
                            ? { ...entry, quantity: Math.max(entry.quantity - 1, 0) }
                            : entry
                    )
                    .filter((entry) => entry.quantity > 0)
            );
        },
        [persistItems]
    );

    const removeItemFromCart = useCallback(
        (productId) => {
            persistItems((prev) => removeCartItem(prev, productId));
        },
        [persistItems]
    );

    const clearCartItems = useCallback(() => {
        persistItems([]);
    }, [persistItems]);

    const setQuantity = useCallback(
        (productId, quantity) => {
            persistItems((prev) => setCartItemQuantity(prev, productId, quantity));
        },
        [persistItems]
    );

    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);
    const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

    const subtotal = useMemo(
        () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [items]
    );

    const itemCount = useMemo(
        () => items.reduce((sum, item) => sum + item.quantity, 0),
        [items]
    );

    const currency = items[0]?.currency || DEFAULT_CURRENCY;

    const value = useMemo(
        () => ({
            items,
            itemCount,
            subtotal,
            currency,
            isOpen,
            addItem,
            incrementItem,
            decrementItem,
            removeItem: removeItemFromCart,
            clearCart: clearCartItems,
            setQuantity,
            openCart,
            closeCart,
            toggleCart,
        }),
        [
            items,
            itemCount,
            subtotal,
            currency,
            isOpen,
            addItem,
            incrementItem,
            decrementItem,
            removeItemFromCart,
            clearCartItems,
            setQuantity,
            openCart,
            closeCart,
            toggleCart,
        ]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
