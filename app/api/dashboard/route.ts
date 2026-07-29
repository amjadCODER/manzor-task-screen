import { NextResponse } from "next/server";
import { employees } from "@/lib/dashboard";
import type { DashboardData, EmployeeTask } from "@/types/dashboard";

export const dynamic = "force-dynamic";

function todayKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Riyadh" });
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return NextResponse.json({ employees, currentTasks: [], completedTasks: [], updatedAt: new Date().toISOString() } satisfies DashboardData);
  }

  try {
    const response = await fetch(
      `${url}/rest/v1/tasks?select=id,employee_id,title,priority,status,task_date,created_at&task_date=eq.${todayKey()}&order=created_at.desc`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" },
    );

    if (!response.ok) throw new Error(await response.text());

    const rows = (await response.json()) as Array<{
      id: string;
      employee_id: string;
      title: string;
      priority: EmployeeTask["priority"];
      status: EmployeeTask["status"];
      created_at: string;
    }>;

    const hydratedEmployees = employees.map((employee) => {
      const tasks = rows.filter((task) => task.employee_id === employee.id);
      const completed = tasks.filter((task) => task.status === "completed");
      const active = tasks.find((task) => task.status === "in_progress") || tasks.find((task) => task.status === "pending");
      return {
        ...employee,
        activeTask: active?.title || "لم يضف مهام اليوم",
        completedToday: completed.length,
        totalToday: tasks.length,
        status: active ? "active" as const : "available" as const,
      };
    });

    const currentTasks = rows
      .filter((task) => task.status !== "completed")
      .map((task) => ({
        id: task.id,
        title: task.title,
        employeeName: employees.find((item) => item.id === task.employee_id)?.name || task.employee_id,
        priority: task.priority === "قصوى" ? "عالية" as const : task.priority === "متوسطة" ? "متوسطة" as const : "عادية" as const,
        startedAt: task.created_at,
      }));

    const completedTasks = rows
      .filter((task) => task.status === "completed")
      .map((task) => ({
        id: task.id,
        title: task.title,
        employeeName: employees.find((item) => item.id === task.employee_id)?.name || task.employee_id,
        completedAt: task.created_at,
      }));

    return NextResponse.json({ employees: hydratedEmployees, currentTasks, completedTasks, updatedAt: new Date().toISOString() } satisfies DashboardData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ employees, currentTasks: [], completedTasks: [], updatedAt: new Date().toISOString() } satisfies DashboardData);
  }
}
