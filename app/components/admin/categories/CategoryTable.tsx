"use client";

import type { Category } from "../../../features/category/category.types";

interface CategoryTableProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: number) => Promise<void>;
}

export default function CategoryTable({
  categories,
  isLoading,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border p-6">
        Loading categories...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-gray-500">
        No categories found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">

      <table className="w-full">

        <thead className="border-b bg-gray-50">

          <tr>
            <th className="px-6 py-3 text-left">
              ID
            </th>

            <th className="px-6 py-3 text-left">
              Name
            </th>

            <th className="px-6 py-3 text-left">
              Description
            </th>

            <th className="px-6 py-3 text-left">
              Status
            </th>

            <th className="px-6 py-3 text-left">
              Actions
            </th>
          </tr>

        </thead>

        <tbody>

          {categories.map((category) => (

            <tr
              key={category.id}
              className="border-b"
            >

              <td className="px-6 py-4">
                {category.id}
              </td>

              <td className="px-6 py-4 font-medium">
                {category.name}
              </td>

              <td className="px-6 py-4">
                {category.description || "-"}
              </td>

              <td className="px-6 py-4">
                {category.isActive
                  ? "Active"
                  : "Inactive"}
              </td>

              <td className="px-6 py-4">

                <div className="flex gap-2">

                  <button
                    onClick={() => onEdit(category)}
                    className="rounded-md border px-3 py-1"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(category.id)}
                    className="rounded-md bg-red-500 px-3 py-1 text-white"
                  >
                    Delete
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}