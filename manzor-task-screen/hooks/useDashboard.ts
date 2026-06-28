"use client";

import { useEffect, useState } from "react";
import type { DashboardData } from "@/types/dashboard";

export function useDashboard(initialData: DashboardData) {
  const [data, setData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    async function refresh() {
      setIsRefreshing(true);
      try {
        const response = await fetch("/api/dashboard", { cache: "no-store" });
        if (response.ok) {
          setData(await response.json());
        }
      } finally {
        setIsRefreshing(false);
      }
    }

    const timer = window.setInterval(refresh, 15000);
    return () => window.clearInterval(timer);
  }, []);

  return { data, isRefreshing };
}
