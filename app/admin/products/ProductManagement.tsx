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

function CheckCircleIcon() {
    return (
        <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    );
}
function AlertCircleIcon() {
    return (
        <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}
function XIcon({ className = "h-4 w-4" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}
function PencilIcon() {
    return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
        </svg>
    );
}

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

    const [isPanelVisible, setIsPanelVisible] = useState(false);

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

    // animate the manage-product panel in, and lock scroll while it's open
    useEffect(() => {
        if (selectedProduct) {
            document.body.style.overflow = "hidden";
            const raf = requestAnimationFrame(() => setIsPanelVisible(true));
            return () => cancelAnimationFrame(raf);
        }
        setIsPanelVisible(false);
        document.body.style.overflow = "";
    }, [selectedProduct]);

    useEffect(() => {
        if (!selectedProduct) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleCloseVariants();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [selectedProduct]);

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
        <div className="min-h-screen bg-zinc-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                        Product Management
                    </h1>

                    <p className="mt-2 text-sm text-zinc-500">
                        Manage your store products, prices, categories and inventory.
                    </p>
                </div>

                {/* Messages */}
                {(error || message) && (
                    <div className="mb-6 space-y-3">
                        {error && (
                            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                                <span className="mt-0.5 text-red-500"><AlertCircleIcon /></span>
                                <p className="flex-1 text-sm font-medium text-red-700">
                                    {error}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setError("")}
                                    aria-label="Dismiss"
                                    className="text-red-400 transition-colors hover:text-red-600"
                                >
                                    <XIcon />
                                </button>
                            </div>
                        )}

                        {message && (
                            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                                <span className="mt-0.5 text-emerald-500"><CheckCircleIcon /></span>
                                <p className="flex-1 text-sm font-medium text-emerald-700">
                                    {message}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setMessage("")}
                                    aria-label="Dismiss"
                                    className="text-emerald-400 transition-colors hover:text-emerald-600"
                                >
                                    <XIcon />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Product Form Section */}
                <div
                    className={`mb-8 overflow-hidden rounded-2xl border bg-white shadow-sm transition-colors duration-200 ${editingProduct ? "border-zinc-900" : "border-zinc-200"
                        }`}
                >
                    <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-6 py-5">
                        <div>
                            <div className="flex items-center gap-2">
                                {editingProduct && (
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-white">
                                        <PencilIcon />
                                    </span>
                                )}
                                <h2 className="text-lg font-semibold text-zinc-900">
                                    {editingProduct ? "Edit Product" : "Add New Product"}
                                </h2>
                            </div>

                            <p className="mt-1 text-sm text-zinc-500">
                                {editingProduct
                                    ? "Update the product information below."
                                    : "Fill in the details to create a new product."}
                            </p>
                        </div>
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
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">

                    <div className="flex flex-col gap-2 border-b border-zinc-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-900">
                                All Products
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                View and manage all products in your store.
                            </p>
                        </div>

                        <div className="w-fit rounded-full bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700">
                            {products.length} {products.length === 1 ? "Product" : "Products"}
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
                    </div>

                </div>

            </div>

            {/* Manage Product slide-over panel */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div
                        className={`absolute inset-0 bg-zinc-900/40 backdrop-blur-[2px] transition-opacity duration-200 ${isPanelVisible ? "opacity-100" : "opacity-0"
                            }`}
                        onClick={handleCloseVariants}
                        aria-hidden="true"
                    />

                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Manage ${selectedProduct.name}`}
                        className={`relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl transition-transform duration-200 ease-out ${isPanelVisible ? "translate-x-0" : "translate-x-full"
                            }`}
                    >
                        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-6 py-5">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                                    Manage product
                                </p>
                                <h2 className="mt-0.5 text-lg font-semibold text-zinc-900">
                                    {selectedProduct.name}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={handleCloseVariants}
                                aria-label="Close panel"
                                className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
                            >
                                <XIcon className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            <section>
                                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                                    Variants
                                </h3>
                                <VariantManagement productId={selectedProduct.id} />
                            </section>

                            <div className="my-6 border-t border-zinc-200" />

                            <section>
                                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                                    Images
                                </h3>
                                <ImageManagement productId={selectedProduct.id} />
                            </section>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}