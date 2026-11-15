
"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

import type { Product } from "@/types/product";

export type CartProduct = Pick<
    Product,
    "id" | "name" | "category" | "price" | "image"
>;

export interface CartItem {
    product: CartProduct;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    isCartLoading: boolean;
    addToCart: (
        product: CartProduct,
        quantity?: number
    ) => Promise<boolean>;
    removeFromCart: (productId: number) => Promise<void>;
    updateQuantity: (productId: number, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const EMPTY_CART: CartItem[] = [];

export function CartProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    const userId = session?.user?.id;

    const [cartItems, setCartItems] = useState<CartItem[]>(EMPTY_CART);
    const [cartOwnerId, setCartOwnerId] = useState<string | null>(null);
    const [isCartLoading, setIsCartLoading] = useState(true);

    // Remove the old shared localStorage cart.
    useEffect(() => {
        if (status !== "loading") {
            localStorage.removeItem("pawnest-cart");
        }
    }, [status]);

    // Load the authenticated user's cart from MongoDB.
    const loadCart = useCallback(async () => {
        if (status !== "authenticated" || !userId) {
            return;
        }

        const response = await fetch("/api/cart");

        if (!response.ok) {
            throw new Error("Failed to load cart.");
        }

        const data = await response.json();

        setCartItems(data.items || []);
        setCartOwnerId(userId);
    }, [status, userId]);

    // Load a fresh cart whenever the authenticated user changes.
    useEffect(() => {
        let isActive = true;

        const fetchCart = async () => {
            if (status === "loading") {
                setIsCartLoading(true);
                return;
            }

            if (status === "unauthenticated" || !userId) {
                setCartItems(EMPTY_CART);
                setCartOwnerId(null);
                setIsCartLoading(false);
                return;
            }

            setCartItems(EMPTY_CART);
            setCartOwnerId(null);
            setIsCartLoading(true);

            try {
                const response = await fetch("/api/cart");

                if (!response.ok) {
                    throw new Error("Failed to load cart.");
                }

                const data = await response.json();

                if (isActive) {
                    setCartItems(data.items || []);
                    setCartOwnerId(userId);
                }
            } catch (error) {
                console.error("Failed to load user cart:", error);

                if (isActive) {
                    setCartItems(EMPTY_CART);
                    setCartOwnerId(userId);
                }
            } finally {
                if (isActive) {
                    setIsCartLoading(false);
                }
            }
        };

        fetchCart();

        return () => {
            isActive = false;
        };
    }, [status, userId]);

    // Redirect guests to login.
    const requireLogin = useCallback(() => {
        if (status === "unauthenticated") {
            router.push(
                `/login?callbackUrl=${encodeURIComponent(pathname || "/shop")}`
            );
        }
    }, [status, router, pathname]);

    // Add a product.
    const addToCart = useCallback(
        async (product: CartProduct, quantity = 1): Promise<boolean> => {
            if (status !== "authenticated" || !userId) {
                requireLogin();
                return false;
            }

            try {
                const response = await fetch("/api/cart", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        productId: product.id,
                        quantity,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to add product.");
                }

                await loadCart();
                return true;
            } catch (error) {
                console.error("Add to cart error:", error);
                return false;
            }
        },
        [status, userId, requireLogin, loadCart]
    );

    // Remove a product.
    const removeFromCart = useCallback(
        async (productId: number) => {
            if (status !== "authenticated" || !userId) {
                requireLogin();
                return;
            }

            try {
                const response = await fetch("/api/cart", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ productId }),
                });

                if (!response.ok) {
                    throw new Error("Failed to remove product.");
                }

                await loadCart();
            } catch (error) {
                console.error("Remove from cart error:", error);
            }
        },
        [status, userId, requireLogin, loadCart]
    );

    // Update product quantity.
    const updateQuantity = useCallback(
        async (productId: number, quantity: number) => {
            if (status !== "authenticated" || !userId) {
                requireLogin();
                return;
            }

            if (quantity < 1) {
                await removeFromCart(productId);
                return;
            }

            try {
                const response = await fetch("/api/cart", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        productId,
                        quantity,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to update quantity.");
                }

                await loadCart();
            } catch (error) {
                console.error("Update cart error:", error);
            }
        },
        [status, userId, requireLogin, removeFromCart, loadCart]
    );

    // Clear the entire cart.
    const clearCart = useCallback(async () => {
        if (status !== "authenticated" || !userId) {
            return;
        }

        const currentUserId = userId;

        try {
            const response = await fetch("/api/cart", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                throw new Error("Failed to clear cart.");
            }

            // Only reload if the same user is still logged in.
            if (currentUserId === userId) {
                await loadCart();
            }
        } catch (error) {
            console.error("Clear cart error:", error);
        }
    }, [status, userId, loadCart]);

    // Never expose another user's cart during account switching.
    const visibleCartItems =
        status === "authenticated" && cartOwnerId === userId
            ? cartItems
            : EMPTY_CART;

    const cartCount = visibleCartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems: visibleCartItems,
                cartCount,
                isCartLoading,
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
