import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";
import { products } from "@/data/products";

// GET: Retrieve the logged-in user's cart
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Please log in to access your cart." },
        { status: 401 },
      );
    }

    await connectDB();

    const cart = await Cart.findOne({
      userId: session.user.id,
    }).lean();

    if (!cart) {
      return NextResponse.json({ items: [] });
    }

    // Rebuild product details using our trusted product catalog.
    const items = (cart.items as { productId: number; quantity: number }[])
      .map((item) => {
        const product = products.find(
          (product) => product.id === item.productId,
        );

        if (!product) return null;

        return {
          product: {
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
          },
          quantity: item.quantity,
        };
      })
      .filter((item) => item !== null);

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Cart GET error:", error);

    return NextResponse.json(
      { message: "Failed to load your cart." },
      { status: 500 },
    );
  }
}

// POST: Add a product to the logged-in user's cart
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Please log in to add products to your cart." },
        { status: 401 },
      );
    }

    const { productId, quantity = 1 } = await request.json();

    if (
      !Number.isInteger(productId) ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return NextResponse.json(
        { message: "Invalid product ID or quantity." },
        { status: 400 },
      );
    }

    await connectDB();

    // Find the product in our trusted catalog.
    const product = products.find((item) => item.id === productId);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 },
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { message: "Not enough stock available." },
        { status: 400 },
      );
    }

    let cart = await Cart.findOne({
      userId: session.user.id,
    });

    if (!cart) {
      cart = new Cart({
        userId: session.user.id,
        items: [{ productId, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item: { productId: number; quantity: number }) =>
          item.productId === productId,
      );

      if (existingItem) {
        if (existingItem.quantity + quantity > product.stock) {
          return NextResponse.json(
            { message: "Not enough stock available." },
            { status: 400 },
          );
        }

        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();

    return NextResponse.json({
      message: "Product added to cart.",
    });
  } catch (error) {
    console.error("Cart POST error:", error);

    return NextResponse.json(
      { message: "Failed to add product to cart." },
      { status: 500 },
    );
  }
}

// PATCH: Update a product quantity
export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Please log in to update your cart." },
        { status: 401 },
      );
    }

    const { productId, quantity } = await request.json();

    if (
      !Number.isInteger(productId) ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return NextResponse.json(
        { message: "Invalid product or quantity." },
        { status: 400 },
      );
    }

    await connectDB();

    const product = products.find((item) => item.id === productId);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 },
      );
    }

    if (quantity > product.stock) {
      return NextResponse.json(
        { message: "Requested quantity exceeds available stock." },
        { status: 400 },
      );
    }

    const cart = await Cart.findOne({
      userId: session.user.id,
    });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found." }, { status: 404 });
    }

    const item = cart.items.find(
      (item: { productId: number; quantity: number }) =>
        item.productId === productId,
    );

    if (!item) {
      return NextResponse.json(
        { message: "Product not found in your cart." },
        { status: 404 },
      );
    }

    item.quantity = quantity;

    await cart.save();

    return NextResponse.json({
      message: "Cart quantity updated.",
    });
  } catch (error) {
    console.error("Cart PATCH error:", error);

    return NextResponse.json(
      { message: "Failed to update cart." },
      { status: 500 },
    );
  }
}

// DELETE: Remove a product or clear the entire cart
export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Please log in to manage your cart." },
        { status: 401 },
      );
    }

    const { productId } = await request.json();

    await connectDB();

    const cart = await Cart.findOne({
      userId: session.user.id,
    });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found." }, { status: 404 });
    }

    // Remove one product if productId is provided.
    if (productId !== undefined) {
      if (!Number.isInteger(productId)) {
        return NextResponse.json(
          { message: "Invalid product." },
          { status: 400 },
        );
      }

      cart.items = cart.items.filter(
        (item: { productId: number; quantity: number }) =>
          item.productId !== productId,
      );
    } else {
      // Otherwise, clear the entire cart.
      cart.items = [];
    }

    await cart.save();

    return NextResponse.json({
      message: "Cart updated successfully.",
    });
  } catch (error) {
    console.error("Cart DELETE error:", error);

    return NextResponse.json(
      { message: "Failed to update cart." },
      { status: 500 },
    );
  }
}
