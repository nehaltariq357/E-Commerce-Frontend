import { api } from "../../lib/api";
import type {
  Product,
  ProductInput,
  ProductsResponse,
  ProductResponse,
  DeleteProductResponse,
  ProductVariantsResponse,
  ProductVariantInput,
  ProductVariantResponse,
  DeleteProductVariantResponse,
  ProductImageInput,
  ProductImageResponse
} from "./product.type";

// GET all products

export const getProducts = async (): Promise<ProductsResponse> => {
  return await api("/products", {
    method: "GET",
  });
};

// GET product by id

export const getProductById = async (
  productId: number
): Promise<ProductResponse> => {
  return await api(`/products/${productId}`, {
    method: "GET",
  });
};

// CREATE product

export const createProduct = async (
  data: ProductInput
): Promise<ProductResponse> => {
  return await api("/products", {
    method: "POST",
    body: data,
  });
};

// UPDATE product

export const updateProduct = async (
  productId: number,
  data: ProductInput
): Promise<ProductResponse> => {
  return await api(`/products/${productId}`, {
    method: "PATCH",
    body: data,
  });
};

// DELETE product

export const deleteProduct = async (
  productId: number
): Promise<DeleteProductResponse> => {
  return await api(`/products/${productId}`, {
    method: "DELETE",
  });
};



// ================================
// Product Variant APIs
// ================================

// get variants of a product

export const getProductVariants = async (
  productId: number
): Promise<ProductVariantsResponse> => {
  return await api(
    `/products/${productId}/variants`,
    {
      method: "GET",
    }
  );
};

// create product variant

export const createProductVariant = async (
  data: ProductVariantInput
): Promise<ProductVariantResponse> => {
  return await api("/products/variants", {
    method: "POST",
    body: data,
  });
};

// update product variant

export const updateProductVariant = async (
  variantId: number,
  data: ProductVariantInput
): Promise<ProductVariantResponse> => {
  return await api(
    `/products/variants/${variantId}`,
    {
      method: "PATCH",
      body: data,
    }
  );
};

// delete product variant

export const deleteProductVariant = async (
  variantId: number
): Promise<DeleteProductVariantResponse> => {
  return await api(
    `/products/variants/${variantId}`,
    {
      method: "DELETE",
    }
  );
};

// ===============================
// Product Image APIs
// ================================

// create product image

export const addProductImage  = async (
  data: ProductImageInput
): Promise<ProductImageResponse> => {
  return await api("/products/images", {
    method: "POST",
    body: data,
  });
};