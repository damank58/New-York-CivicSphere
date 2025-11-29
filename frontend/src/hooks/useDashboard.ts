import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "../services/api";
import type { DashboardResponse } from "../types/dashboard";

export const useDashboard = () =>
  useQuery<DashboardResponse>({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 1000 * 60 * 5,
  });

