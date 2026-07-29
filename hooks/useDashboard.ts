"use client";

import { useCallback, useEffect, useState } from "react";
import type { DashboardData } from "@/types/dashboard";

export function useDashboard(initialData: DashboardData) {
  const [data, setData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/dashboard?t=${Date.now()}`, { cache: "no-store" });
      if (response.ok) setData(await response.json());
    } catch (error) {
      console.error("Failed to refresh dashboard", error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 10000);
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  return { data, isRefreshing, refresh };
}
