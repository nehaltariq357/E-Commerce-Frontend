
export interface CartProduct {
  id: number;
  name: string;
  description: string;
  slug: string;
  price: string;
  isActive: boolean;
  categoryId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CartVariant {
  id: number;
  productId: number;
  size: string | null;
  color: string | null;
  stock: number;
  sku: string;
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  variantId: number | null;
  quantity: number;
  createdAt: string;
  updatedAt: string;

  product: CartProduct;
  variant: CartVariant | null;
}

export interface Cart {
  id: number | null;
  userId: number;
  cartItems: CartItem[];
}

export interface AddToCartInput {
  productId: number;
  variantId?: number;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}

