import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AuthInitializer } from "./components/auth/AuthInitializer"
import { CartInitializer } from "./components/cart/CartInitializer";
import { Toaster } from "@/components/ui/sonner"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopEase | Modern Online Store",
  description:
    "Shop the latest products with a seamless, secure, and modern online shopping experience.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <CartInitializer />
          <AuthInitializer>
            {children}
          </AuthInitializer>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
