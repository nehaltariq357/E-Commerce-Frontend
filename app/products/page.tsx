import { ProductList } from "../components/product/ProductList";

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <div className="mb-10 border-b border-zinc-200 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          All Products
        </h1>
        <p className="mt-2 text-sm text-zinc-500 sm:text-base">
          Explore our latest products
        </p>
      </div>

      <ProductList />
    </main>
  );
}