export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface Order {
  id: number;
  userId: number;
  addressId: number | null;
  status: OrderStatus;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  address: OrderAddress | null;
  orderItems: OrderItem[];
  payment: Payment | null;
}


export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  variantId?: number;
  productName: string;
  price: number;
  quantity: number;
  variantSize?: string | null;
  variantColor?: string | null;
  product?: OrderProduct;
  variant: OrderVariant | null;
}

export interface CreateOrderInput {
  addressId: number;
}

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export type PaymentMethod = "COD" | "STRIPE";

export interface OrderAddress {
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

export interface OrderProduct {
  id: number;
  name: string;
  price: string;
  slug: string;
}

export interface OrderVariant {
  id: number;
  productId: number;
  size: string | null;
  color: string | null;
  stock: number;
  sku: string;
}

export interface Payment {
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
