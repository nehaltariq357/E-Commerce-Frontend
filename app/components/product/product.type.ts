export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
}

export interface ProductVariant {
  id: number;
  productId: number;
  size: string | null;
  stock: number;
  color: string | null;
  sku: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  slug: string;
  price: string;
  isActive: boolean;
  categoryId: number | null;
  category: ProductCategory | null;
  productImages?: ProductImage[];
  productVariants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

// create product ke liye
export interface ProductInput {
  name: string;
  description: string;
  slug: string;
  price: number;
  isActive?: boolean;
  categoryId?: number | null;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface DeleteProductResponse {
  success: boolean;
  message: string;
}


// product variant 

export interface ProductVariant {
  id: number;
  productId: number;
  size: string | null;
  stock: number;
  color: string | null;
  sku: string;
}

export interface ProductVariantInput {
  productId: number;
  size?: string;
  stock: number;
  color?: string;
  sku: string;
}

export interface ProductVariantsResponse {
  success: boolean;
  message: string;
  data: ProductVariant[];
}

export interface ProductVariantResponse {
  success: boolean;
  message: string;
  data: ProductVariant;
}

export interface DeleteProductVariantResponse {
  success: boolean;
  message: string;
}


// product image

export interface ProductImageInput {
  productId: number;
  imageUrl: string;
}

export interface ProductImageResponse {
  success: boolean;
  message: string;
  data: ProductImage;
}

