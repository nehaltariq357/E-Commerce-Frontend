
export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED";

export type PaymentMethod =
  | "COD"
  | "STRIPE";

export interface AdminOrderUser {
  id: number;
  name: string;
  email: string;
}

export interface AdminOrderAddress {
  id: number;
  userId: number;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrderProduct {
  id: number;
  name: string;
  price: string;
  slug: string;
}

export interface AdminOrderVariant {
  id: number;
  productId: number;
  size: string | null;
  color: string | null;
  stock: number;
  sku: string;
}

export interface AdminOrderItem {
  id: number;
  orderId: number;
  productId: number;
  variantId: number | null;
  productName: string;
  price: string;
  quantity: number;
  variantSize: string | null;
  variantColor: string | null;
  product: AdminOrderProduct;
  variant: AdminOrderVariant | null;
}

export interface AdminOrderPayment {
  id: number;
  orderId: number;
  amount: string;
  status: PaymentStatus;
  method: PaymentMethod;
  transactionId: string | null;
  stripeSessionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrder {
  id: number;
  userId: number;
  addressId: number | null;
  status: OrderStatus;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;

  user: AdminOrderUser;
  address: AdminOrderAddress | null;
  orderItems: AdminOrderItem[];
  payments: AdminOrderPayment | null;
}

