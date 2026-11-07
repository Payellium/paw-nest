
"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "pawnest-wishlist";

let cachedWishlist: number[] = [];
let isInitialized = false;

const listeners = new Set<() => void>();

const notifyListeners = () => {
    listeners.forEach((listener) => listener());
};

const getSnapshot = () => cachedWishlist;

const getServerSnapshot = () => [];

const initializeWishlist = () => {
    if (isInitialized || typeof window === "undefined") return;

    isInitialized = true;

    try {
        const storedWishlist = localStorage.getItem(STORAGE_KEY);

        if (storedWishlist) {
            const parsedWishlist: unknown = JSON.parse(storedWishlist);

            if (Array.isArray(parsedWishlist)) {
                cachedWishlist = [
                    ...new Set(
                        parsedWishlist.filter(
                            (id): id is number =>
                                typeof id === "number" && Number.isFinite(id)
                        )
                    ),
                ];
            }
        }
    } catch {
        cachedWishlist = [];
    }
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);

    initializeWishlist();

    listener();

    const handleStorageChange = (event: StorageEvent) => {
        if (event.key !== STORAGE_KEY && event.key !== null) return;

        try {
            const storedWishlist = localStorage.getItem(STORAGE_KEY);
            const parsedWishlist: unknown = storedWishlist
                ? JSON.parse(storedWishlist)
                : [];

            cachedWishlist = Array.isArray(parsedWishlist)
                ? [
                    ...new Set(
                        parsedWishlist.filter(
                            (id): id is number =>
                                typeof id === "number" && Number.isFinite(id)
                        )
                    ),
                ]
                : [];
        } catch {
            cachedWishlist = [];
        }

        notifyListeners();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", handleStorageChange);
    };
};

const updateWishlist = (updatedWishlist: number[]) => {
    cachedWishlist = [...new Set(updatedWishlist)];

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(cachedWishlist)
        );
    } catch {
        // Keep the current in-memory wishlist if storage is unavailable.
    }

    notifyListeners();
};

export function useWishlist() {
    const wishlist = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    );

    const toggleWishlist = (productId: number) => {
        const updatedWishlist = cachedWishlist.includes(productId)
            ? cachedWishlist.filter((id) => id !== productId)
            : [...cachedWishlist, productId];

        updateWishlist(updatedWishlist);
    };

    const removeFromWishlist = (productId: number) => {
        updateWishlist(
            cachedWishlist.filter((id) => id !== productId)
        );
    };

    const clearWishlist = () => {
        updateWishlist([]);
    };

    const isWishlisted = (productId: number) =>
        wishlist.includes(productId);

    return {
        wishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isWishlisted,
    };
}
