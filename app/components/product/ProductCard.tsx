import Link from "next/link";
import { Product } from "./product.type";

interface ProductCartProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCartProps) => {
    
const image = product.productImages?.[0]?.imageUrl;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-xl border bg-white transition hover:-translate-y-1 hover:shadow-lg"
    >
      {" "}
      {/* Product Image */}{" "}
      <div className="aspect-square bg-gray-100">
        {" "}
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            {" "}
            No image{" "}
          </div>
        )}{" "}
      </div>{" "}
      {/* Product Info */}{" "}
      <div className="p-4">
        {" "}
        <h3 className="text-lg font-semibold"> {product.name} </h3>{" "}
        {product.category && (
          <p className="mt-1 text-sm text-gray-500">
            {" "}
            {product.category.name}{" "}
          </p>
        )}{" "}
        <p className="mt-3 text-lg font-bold"> ${product.price} </p>{" "}
      </div>{" "}
    </Link>
  );
};
