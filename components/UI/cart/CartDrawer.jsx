"use client";

import { useCart } from "@/components/Providers/CartProvider";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

const formatPrice = (value) =>
    Number(value || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

function CartDrawerItem({ item, onIncrement, onDecrement, onRemove, removeLabel }) {
    return (
        <li className="flex gap-4 border-b border-gray-100 py-4 last:border-b-0">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-contain" sizes="80px" />
                ) : (
                    <span className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        No Image
                    </span>
                )}
            </div>
            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <p className="line-clamp-2 text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="mt-1 text-sm text-gray-500">
                        {item.currency} {formatPrice(item.price)}
                    </p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-3 rounded-full border border-gray-200 px-3 py-1">
                        <button
                            type="button"
                            onClick={onDecrement}
                            className="text-gray-500 hover:text-gray-900"
                            aria-label="Decrease quantity"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="text-sm font-semibold text-gray-900">{item.quantity}</span>
                        <button
                            type="button"
                            onClick={onIncrement}
                            className="text-gray-500 hover:text-gray-900"
                            aria-label="Increase quantity"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
                    >
                        <Trash2 size={16} />
                        {removeLabel}
                    </button>
                </div>
            </div>
        </li>
    );
}

export default function CartDrawer() {
    const t = useTranslations("CartPage");
    const {
        items,
        itemCount,
        subtotal,
        currency,
        isOpen,
        incrementItem,
        decrementItem,
        removeItem,
        closeCart,
    } = useCart();

    const isEmpty = items.length === 0;

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-black/50 transition-all duration-300 ${
                    isOpen ? "visible opacity-100" : "invisible opacity-0"
                }`}
                onClick={closeCart}
            />
            <aside
                className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                    <div>
                        <p className="text-lg font-semibold text-gray-900">{t("DrawerTitle")}</p>
                        <p className="text-sm text-gray-500">{t("ItemsCount", { count: itemCount })}</p>
                    </div>
                    <button
                        type="button"
                        onClick={closeCart}
                        className="rounded-full border border-gray-200 p-2 text-gray-500 hover:text-gray-900"
                        aria-label="Close cart"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="h-[calc(100%-200px)] overflow-y-auto px-6 py-4">
                    {isEmpty ? (
                        <div className="flex h-full flex-col items-center justify-center text-center text-gray-600">
                            <ShoppingBag className="mb-4 h-12 w-12 text-gray-300" />
                            <p className="text-base font-semibold text-gray-800">{t("EmptyTitle")}</p>
                            <p className="mt-2 text-sm text-gray-500">{t("EmptySubtitle")}</p>
                            <button
                                type="button"
                                onClick={closeCart}
                                className="mt-6 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                {t("ContinueShopping")}
                            </button>
                        </div>
                    ) : (
                        <ul>
                            {items.map((item) => (
                                <CartDrawerItem
                                    key={item.productId}
                                    item={item}
                                    onIncrement={() => incrementItem(item.productId)}
                                    onDecrement={() => decrementItem(item.productId)}
                                    onRemove={() => removeItem(item.productId)}
                                    removeLabel={t("RemoveItem")}
                                />
                            ))}
                        </ul>
                    )}
                </div>

                {!isEmpty && (
                    <div className="sticky bottom-0 border-t border-gray-100 bg-white px-6 py-5 shadow-[0_-12px_25px_rgba(15,23,42,0.08)]">
                        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/60 px-4 py-3 text-sm text-gray-600">
                            <div>
                                <p className="text-xs uppercase tracking-widest text-gray-400">{t("Total")}</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {currency} {formatPrice(subtotal)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400">{t("ItemsCount", { count: itemCount })}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col gap-3">
                            <Link
                                href="/cart"
                                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                onClick={closeCart}
                            >
                                {t("ViewCart")}
                                <ArrowRight size={16} />
                            </Link>
                            <Link
                                href="/cart"
                                className="w-full rounded-2xl bg-gradient-to-r from-[#79c4e7] to-[#3597d3] px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-[#79c4e7]/40 transition hover:brightness-105"
                                onClick={closeCart}
                            >
                                {t("Checkout")}
                            </Link>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
}
