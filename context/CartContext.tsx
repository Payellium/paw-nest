
"use client";

import {
    createContext,
    useContext,
    useSyncExternalStore,
    type ReactNode,
} from "react";

export interface CartProduct {
    id: number;
    name: string;
    category: string;
    price: string;
    image: string;
}

export interface CartItem {
    product: CartProduct;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    addToCart: (product: CartProduct) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "pawnest-cart";

const EMPTY_CART: CartItem[] = [];

let cachedRawCart: string | null = null;
let cachedCart: CartItem[] = EMPTY_CART;

const listeners = new Set<() => void>();

// Read the cart from localStorage and cache the parsed result.
function getCartSnapshot(): CartItem[] {
    if (typeof window === "undefined") {
        return EMPTY_CART;
    }

    try {
        const rawCart = localStorage.getItem(STORAGE_KEY);

        if (rawCart === cachedRawCart) {
            return cachedCart;
        }

        cachedRawCart = rawCart;

        if (rawCart) {
            const parsedCart = JSON.parse(rawCart);

            cachedCart = Array.isArray(parsedCart)
                ? parsedCart
                : EMPTY_CART;
        } else {
            cachedCart = EMPTY_CART;
        }

        return cachedCart;
    } catch (error) {
        console.error("Failed to load cart:", error);
        cachedRawCart = null;
        cachedCart = EMPTY_CART;
        return EMPTY_CART;
    }
}

// The server always renders an empty cart.
function getServerSnapshot(): CartItem[] {
    return EMPTY_CART;
}

// Subscribe to cart changes.
function subscribeToCart(callback: () => void) {
    listeners.add(callback);

    // Also listen for changes from other browser tabs.
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === STORAGE_KEY || event.key === null) {
            cachedRawCart = null;
            callback();
        }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
        listeners.delete(callback);
        window.removeEventListener("storage", handleStorageChange);
    };
}

// Save cart changes and notify subscribers.
function saveCart(items: CartItem[]) {
    try {
        const rawCart = JSON.stringify(items);

        localStorage.setItem(STORAGE_KEY, rawCart);

        cachedRawCart = rawCart;
        cachedCart = items;

        listeners.forEach((callback) => callback());
    } catch (error) {
        console.error("Failed to save cart:", error);
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const cartItems = useSyncExternalStore(
        subscribeToCart,
        getCartSnapshot,
        getServerSnapshot
    );

    const addToCart = (product: CartProduct) => {
        const currentItems = getCartSnapshot();

        const existingItem = currentItems.find(
            (item) => item.product.id === product.id
        );

        if (existingItem) {
            const updatedItems = currentItems.map((item) =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );

            saveCart(updatedItems);
            return;
        }

        saveCart([
            ...currentItems,
            { product, quantity: 1 },
        ]);
    };

    const removeFromCart = (productId: number) => {
        const updatedItems = getCartSnapshot().filter(
            (item) => item.product.id !== productId
        );

        saveCart(updatedItems);
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }

        const updatedItems = getCartSnapshot().map((item) =>
            item.product.id === productId
                ? { ...item, quantity }
                : item
        );

        saveCart(updatedItems);
    };

    const clearCart = () => {
        saveCart([]);
    };

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }

    return context;
}
