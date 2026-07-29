"use client";

import type { EmployeePlan, EmployeeTask, PlanType } from "@/types/dashboard";

const TASKS_KEY = "manzor_employee_tasks";
const PLANS_KEY = "manzor_employee_plans";

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]") as T[];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("manzor-data-updated"));
}

export function getTasks(employeeId?: string): EmployeeTask[] {
  const tasks = read<EmployeeTask>(TASKS_KEY);
  return employeeId ? tasks.filter((task) => task.employeeId === employeeId) : tasks;
}

export function saveTask(task: EmployeeTask) {
  const tasks = read<EmployeeTask>(TASKS_KEY);
  write(TASKS_KEY, [task, ...tasks.filter((item) => item.id !== task.id)]);
}

export function updateTaskStatus(id: string, status: EmployeeTask["status"]) {
  const tasks = read<EmployeeTask>(TASKS_KEY).map((task) => task.id === id ? { ...task, status } : task);
  write(TASKS_KEY, tasks);
}

export function deleteTask(id: string) {
  write(TASKS_KEY, read<EmployeeTask>(TASKS_KEY).filter((task) => task.id !== id));
}

export function getPlans(employeeId?: string, type?: PlanType): EmployeePlan[] {
  let plans = read<EmployeePlan>(PLANS_KEY);
  if (employeeId) plans = plans.filter((plan) => plan.employeeId === employeeId);
  if (type) plans = plans.filter((plan) => plan.type === type);
  return plans;
}

export function savePlan(plan: EmployeePlan) {
  const plans = read<EmployeePlan>(PLANS_KEY);
  write(PLANS_KEY, [plan, ...plans.filter((item) => item.id !== plan.id)]);
}

export function deletePlan(id: string) {
  write(PLANS_KEY, read<EmployeePlan>(PLANS_KEY).filter((plan) => plan.id !== id));
}

export function exportExcelSheet(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (value: string | number) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const table = `\uFEFF<html dir="rtl"><head><meta charset="UTF-8"></head><body><table border="1"><thead><tr>${headers.map((h) => `<th>${escape(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escape(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></body></html>`;
  const blob = new Blob([table], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.xls`;
  link.click();
  URL.revokeObjectURL(url);
}
