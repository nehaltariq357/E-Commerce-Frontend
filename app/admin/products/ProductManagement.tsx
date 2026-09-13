"use client";

import { useEffect, useState } from "react";

import {
    createProduct,
    deleteProduct,
    getProducts,
    updateProduct,
} from "../../components/product/product.api";
import ImageManagement from "./ImageManagement";
import type {
    Product,
    ProductInput,
} from "../../components/product/product.type";

import {
    addProduct,
    removeProduct,
    setProducts,
    updateProduct as updateProductState,
} from "../../components/product/productSlice";

import {
    getCategories,
} from "../../features/category/category.api";

import type { Category } from "../../features/category/category.types";

import { useAppDispatch, useAppSelector } from "../../store/hooks";

import ProductForm from "./ProductForm";
import ProductTable from "./ProductTable";
import VariantManagement from "./VariantManagement";

export default function ProductManagement() {
    const dispatch = useAppDispatch();

    const products = useAppSelector(
        (state) => state.product.products
    );

    const [categories, setCategories] = useState<Category[]>(
        []
    );

    const [editingProduct, setEditingProduct] =
        useState<Product | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [error, setError] = useState("");

    const [message, setMessage] = useState("");

    const [selectedProduct, setSelectedProduct] =
        useState<Product | null>(null);
    const handleManageVariants = (
        product: Product
    ) => {
        setSelectedProduct(product);
        setError("");
        setMessage("");
    };
    const handleCloseVariants = () => {
        setSelectedProduct(null);
    };
    // load products
    const loadProducts = async () => {
        try {
            setIsLoading(true);
            setError("");

            const response = await getProducts();

            dispatch(setProducts(response.data));
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load products"
            );
        } finally {
            setIsLoading(false);
        }
    };

    // load categories
    const loadCategories = async () => {
        try {
            const response = await getCategories();

            setCategories(response.data);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load categories"
            );
        }
    };

    // initial load
    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    // create / update product
    const handleSubmit = async (
        data: ProductInput
    ) => {
        try {
            setIsSubmitting(true);
            setError("");
            setMessage("");

            if (editingProduct) {
                // update
                const response = await updateProduct(
                    editingProduct.id,
                    data
                );

                dispatch(
                    updateProductState(response.data)
                );

                setMessage(
                    "Product updated successfully"
                );

                setEditingProduct(null);
            } else {
                // create
                const response = await createProduct(data);

                dispatch(addProduct(response.data));

                setMessage(
                    "Product created successfully"
                );
            }
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // edit
    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setMessage("");
        setError("");
    };

    // cancel edit
    const handleCancel = () => {
        setEditingProduct(null);
        setError("");
        setMessage("");
    };

    // delete
    const handleDelete = async (
        productId: number
    ) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            const response = await deleteProduct(
                productId
            );

            dispatch(removeProduct(productId));

            setMessage(response.message);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to delete product"
            );
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Product Management
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Manage your store products, prices, categories and inventory.
                    </p>
                </div>

                {/* Messages */}
                <div className="mb-6 space-y-3">
                    {error && (
                        <div className="flex items-center rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                            <p className="text-sm font-medium text-red-700">
                                {error}
                            </p>
                        </div>
                    )}

                    {message && (
                        <div className="flex items-center rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                            <p className="text-sm font-medium text-green-700">
                                {message}
                            </p>
                        </div>
                    )}
                </div>

                {/* Product Form Section */}
                <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                    <div className="border-b border-gray-200 px-6 py-5">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {editingProduct ? "Edit Product" : "Add New Product"}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {editingProduct
                                ? "Update the product information below."
                                : "Fill in the details to create a new product."}
                        </p>
                    </div>

                    <div className="p-6">
                        <ProductForm
                            editingProduct={editingProduct}
                            categories={categories}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </div>

                {/* Products Section */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                    <div className="flex flex-col gap-2 border-b border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                All Products
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                View and manage all products in your store.
                            </p>
                        </div>

                        <div className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">
                            {products.length} Products
                        </div>
                    </div>

                    <div className="p-6">
                        <ProductTable
                            products={products}
                            isLoading={isLoading}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onManageVariants={handleManageVariants}
                        />

                        {selectedProduct && (
                            <div>
                                <h2>Manage Product: {selectedProduct.name}</h2>

                                <button type="button" onClick={handleCloseVariants}>
                                    Close
                                </button>

                                <VariantManagement productId={selectedProduct.id} />

                                <hr />

                                <ImageManagement productId={selectedProduct.id} />
                            </div>
                        )}

                    </div>

                </div>

            </div>
        </div>
    );
}