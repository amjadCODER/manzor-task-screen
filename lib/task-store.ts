"use client";

import type { EmployeePlan, EmployeeTask, PlanType } from "@/types/dashboard";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function headers(extra?: HeadersInit): HeadersInit {
  if (!url || !key) throw new Error("Supabase environment variables are missing");
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!url) throw new Error("Supabase URL is missing");
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: headers(init?.headers),
    cache: "no-store",
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase request failed: ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function todayKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Riyadh" });
}

type TaskRow = {
  id: string;
  employee_id: string;
  title: string;
  notes: string | null;
  priority: EmployeeTask["priority"];
  status: EmployeeTask["status"];
  task_date: string;
};

type PlanRow = {
  id: string;
  employee_id: string;
  plan_type: PlanType;
  title: string;
  details: string;
  created_at: string;
};

function mapTask(row: TaskRow): EmployeeTask {
  return {
    id: row.id,
    employeeId: row.employee_id,
    title: row.title,
    notes: row.notes || "",
    priority: row.priority,
    status: row.status,
    date: row.task_date,
  };
}

function mapPlan(row: PlanRow): EmployeePlan {
  return {
    id: row.id,
    employeeId: row.employee_id,
    type: row.plan_type,
    title: row.title,
    details: row.details,
    createdAt: row.created_at,
  };
}

export async function getTasks(employeeId?: string): Promise<EmployeeTask[]> {
  const filters = ["select=id,employee_id,title,notes,priority,status,task_date", "order=created_at.desc"];
  if (employeeId) filters.push(`employee_id=eq.${encodeURIComponent(employeeId)}`);
  const rows = await request<TaskRow[]>(`tasks?${filters.join("&")}`);
  return rows.map(mapTask);
}

export async function saveTask(task: EmployeeTask): Promise<void> {
  await request<TaskRow[]>("tasks", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      id: task.id,
      employee_id: task.employeeId,
      title: task.title,
      notes: task.notes || null,
      priority: task.priority,
      status: task.status,
      task_date: task.date,
    }),
  });
}

export async function updateTaskStatus(id: string, status: EmployeeTask["status"]): Promise<void> {
  await request<void>(`tasks?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ status }),
  });
}

export async function deleteTask(id: string): Promise<void> {
  await request<void>(`tasks?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  });
}

export async function getPlans(employeeId?: string, type?: PlanType): Promise<EmployeePlan[]> {
  const filters = ["select=id,employee_id,plan_type,title,details,created_at", "order=created_at.desc"];
  if (employeeId) filters.push(`employee_id=eq.${encodeURIComponent(employeeId)}`);
  if (type) filters.push(`plan_type=eq.${encodeURIComponent(type)}`);
  const rows = await request<PlanRow[]>(`plans?${filters.join("&")}`);
  return rows.map(mapPlan);
}

export async function savePlan(plan: EmployeePlan): Promise<void> {
  await request<PlanRow[]>("plans", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      id: plan.id,
      employee_id: plan.employeeId,
      plan_type: plan.type,
      title: plan.title,
      details: plan.details,
    }),
  });
}

export async function deletePlan(id: string): Promise<void> {
  await request<void>(`plans?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  });
}

export function exportExcelSheet(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (value: string | number) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const table = `\uFEFF<html dir="rtl"><head><meta charset="UTF-8"></head><body><table border="1"><thead><tr>${headers.map((h) => `<th>${escape(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escape(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></body></html>`;
  const blob = new Blob([table], { type: "application/vnd.ms-excel;charset=utf-8" });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `${filename}.xls`;
  link.click();
  URL.revokeObjectURL(downloadUrl);
}
