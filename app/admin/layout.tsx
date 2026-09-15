"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface AdminLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: DashboardIcon, exact: true },
  { href: "/admin/products", label: "Products", icon: ProductsIcon, exact: false },
  { href: "/admin/categories", label: "Categories", icon: CategoriesIcon, exact: false },
  { href: "/admin/orders", label: "Orders", icon: OrdersIcon, exact: false },
];

function DashboardIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75a3 3 0 013-3h1.5a3 3 0 013 3v1.5a3 3 0 01-3 3h-1.5a3 3 0 01-3-3v-1.5zM3.75 15.75a3 3 0 013-3h1.5a3 3 0 013 3v1.5a3 3 0 01-3 3h-1.5a3 3 0 01-3-3v-1.5zM12.75 6.75a3 3 0 013-3h1.5a3 3 0 013 3v1.5a3 3 0 01-3 3h-1.5a3 3 0 01-3-3v-1.5zM12.75 15.75a3 3 0 013-3h1.5a3 3 0 013 3v1.5a3 3 0 01-3 3h-1.5a3 3 0 01-3-3v-1.5z" />
    </svg>
  );
}
function ProductsIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-8.25 4.5-8.25-4.5M20.25 7.5l-8.25-4.5-8.25 4.5M20.25 7.5v9l-8.25 4.5m0-9L3.75 7.5m8.25 4.5v9M3.75 7.5v9l8.25 4.5" />
    </svg>
  );
}
function CategoriesIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
    </svg>
  );
}
function OrdersIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-2.25-1.5-2.25 1.5-2.25-1.5-2.25 1.5-2.25-1.5-2.25 1.5-2.25-1.5-2.25 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
    </svg>
  );
}
function MenuIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
    </svg>
  );
}
function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
        const active = isActive(pathname, href, exact);

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`group flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 ${
              active
                ? "bg-zinc-900 text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            <Icon
              className={`h-[18px] w-[18px] flex-shrink-0 ${
                active ? "text-white" : "text-zinc-400 group-hover:text-zinc-600"
              }`}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-50">

      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-zinc-200 bg-white p-5 lg:flex lg:flex-col">
        <h1 className="mb-8 px-1 text-xl font-semibold tracking-tight text-zinc-900">
          Admin Panel
        </h1>

        <NavLinks pathname={pathname} />
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 lg:hidden">
        <h1 className="text-base font-semibold tracking-tight text-zinc-900">
          Admin Panel
        </h1>
        <button
          type="button"
          onClick={() => setIsMobileNavOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileNavOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-zinc-200 bg-white p-5 lg:hidden"
            >
              <div className="mb-8 flex items-center justify-between px-1">
                <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                  Admin Panel
                </h1>
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen(false)}
                  aria-label="Close menu"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100"
                >
                  <XIcon className="h-4.5 w-4.5" />
                </button>
              </div>

              <NavLinks
                pathname={pathname}
                onNavigate={() => setIsMobileNavOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="min-w-0 flex-1 pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}