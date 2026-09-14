
import { api } from "../../lib/api";
import type { DashboardResponse } from "./admin-dashboard.types";

export const getDashboardStats = async () => {
  return api<DashboardResponse>("/admin/dashboard");
};

