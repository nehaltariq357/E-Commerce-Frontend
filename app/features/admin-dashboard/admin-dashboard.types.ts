
export interface DashboardOrders {
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  orders: DashboardOrders;
  totalRevenue: number;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}

