import type { DashboardData } from "@/types/dashboard";

const graphBaseUrl = "https://graph.microsoft.com/v1.0";

export async function fetchMicrosoftTodoDashboard(accessToken: string): Promise<DashboardData> {
  const listsResponse = await fetch(`${graphBaseUrl}/me/todo/lists`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!listsResponse.ok) {
    throw new Error("تعذر جلب قوائم Microsoft To Do");
  }

  const lists = await listsResponse.json();

  return {
    employees: [],
    currentTasks: [],
    completedTasks: [],
    updatedAt: new Date().toISOString(),
  };
}
