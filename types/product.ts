
export type ProductCategory =
  | "Food"
  | "Toys"
  | "Beds"
  | "Grooming"
  | "Accessories";

export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: "Best Seller" | "New" | "Sale";
  featured: boolean;
  stock: number;
}
