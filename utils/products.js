import Cookies from "js-cookie";

export const CART_COOKIE_KEY = "cart";
export const DEFAULT_CURRENCY = "AED";

const isBrowser = () => typeof window !== "undefined";

const sanitizeQuantity = (value) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed <= 0) return 1;
    return Math.floor(parsed);
};

const normalizeCartItem = (item) => {
    if (!item || typeof item !== "object") return null;

    const productId = item.productId ?? item.id;
    if (productId === undefined || productId === null) return null;

    return {
        productId: String(productId),
        name: item.name ?? item.title ?? "",
        price: Number(item.price) || 0,
        image: item.image || item.images?.[0] || "",
        quantity: sanitizeQuantity(item.quantity ?? 1),
        currency: item.currency || DEFAULT_CURRENCY,
    };
};

export const readCartFromCookies = () => {
    if (!isBrowser()) return [];

    const raw = Cookies.get(CART_COOKIE_KEY);
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.map(normalizeCartItem).filter(Boolean);
    } catch (error) {
        return [];
    }
};

export const writeCartToCookies = (items) => {
    if (!isBrowser()) return Array.isArray(items) ? items : [];

    if (!Array.isArray(items) || items.length === 0) {
        Cookies.remove(CART_COOKIE_KEY);
        return [];
    }

    const sanitized = items.map(normalizeCartItem).filter(Boolean);
    if (sanitized.length === 0) {
        Cookies.remove(CART_COOKIE_KEY);
        return [];
    }

    Cookies.set(CART_COOKIE_KEY, JSON.stringify(sanitized), { expires: 7 });
    return sanitized;
};

export const upsertCartItem = (items, item) => {
    const nextItem = normalizeCartItem(item);
    if (!nextItem) return Array.isArray(items) ? items : [];

    const list = Array.isArray(items) ? [...items] : [];
    const index = list.findIndex((entry) => entry.productId === nextItem.productId);

    if (index >= 0) {
        list[index] = {
            ...list[index],
            ...nextItem,
            quantity: list[index].quantity + nextItem.quantity,
        };
        return list;
    }

    list.push(nextItem);
    return list;
};

export const setCartItemQuantity = (items, productId, quantity) => {
    if (!Array.isArray(items)) return [];
    return items.map((item) =>
        item.productId === productId ? { ...item, quantity: sanitizeQuantity(quantity) } : item
    );
};

export const removeCartItem = (items, productId) => {
    if (!Array.isArray(items)) return [];
    return items.filter((item) => item.productId !== productId);
};

export const clearCart = () => {
    if (!isBrowser()) return [];
    Cookies.remove(CART_COOKIE_KEY);
    return [];
};
