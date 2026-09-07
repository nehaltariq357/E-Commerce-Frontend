
import Link from "next/link";

import type { Category } from "../../features/category/category.types";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({
  category,
}: CategoryCardProps) {
  return (
    <Link
      href={`/products?categoryId=${category.id}`}
      className="group block rounded-xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <h3 className="text-lg font-semibold transition group-hover:text-gray-600">
        {category.name}
      </h3>

      {category.description && (
        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
          {category.description}
        </p>
      )}

      <div className="mt-4 text-sm font-medium">
        Explore →
      </div>
    </Link>
  );
}
