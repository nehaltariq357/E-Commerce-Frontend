
import Link from "next/link";
import type { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white p-5">
        <h1 className="mb-8 text-2xl font-bold">
          Admin Panel
        </h1>

        <nav className="space-y-2">
          <Link
            href="/admin"
            className="block rounded-md px-4 py-3 hover:bg-gray-100"
          >
            Dashboard
          </Link>

          <Link
            href="/admin/products"
            className="block rounded-md px-4 py-3 hover:bg-gray-100"
          >
            Products
          </Link>

          <Link
            href="/admin/categories"
            className="block rounded-md px-4 py-3 hover:bg-gray-100"
          >
            Categories
          </Link>

          <Link
            href="/admin/orders"
            className="block rounded-md px-4 py-3 hover:bg-gray-100"
          >
            Orders
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}

