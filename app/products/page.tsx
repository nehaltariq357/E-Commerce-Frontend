import { ProductList } from "../components/product/ProductList";

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {" "}
      <div className="mb-8">
        {" "}
        <h1 className="text-3xl font-bold"> All Products </h1>{" "}
        <p className="mt-2 text-gray-500"> Explore our latest products </p>{" "}
      </div>{" "}
      <ProductList />{" "}
    </main>
  );
}
