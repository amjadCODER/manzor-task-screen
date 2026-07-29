import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import type { EmployeeTask } from "@/types/dashboard";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

type TaskRow = {
  id: string;
  employee_id: string;
  title: string;
  notes: string | null;
  priority: EmployeeTask["priority"];
  status: EmployeeTask["status"];
  task_date: string;
  created_at: string;
};

function currentWorkdayKey() {
  const shifted = new Date(Date.now() - 8 * 60 * 60 * 1000);
  return shifted.toLocaleDateString("en-CA", { timeZone: "Asia/Riyadh" });
}

function archiveId(employeeId: string, taskDate: string) {
  const hash = createHash("sha256").update(`manzor-daily:${employeeId}:${taskDate}`).digest("hex");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

function statusLabel(status: EmployeeTask["status"]) {
  if (status === "completed") return "منجزة";
  if (status === "in_progress") return "جاري العمل";
  return "لم تبدأ";
}

async function archiveOldTasks() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase environment variables are missing");

  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
  const workday = currentWorkdayKey();
  const query = new URLSearchParams({
    select: "id,employee_id,title,notes,priority,status,task_date,created_at",
    task_date: `lt.${workday}`,
    order: "task_date.asc,created_at.asc",
  });

  const tasksResponse = await fetch(`${url}/rest/v1/tasks?${query}`, { headers, cache: "no-store" });
  if (!tasksResponse.ok) throw new Error(await tasksResponse.text());
  const tasks = (await tasksResponse.json()) as TaskRow[];
  if (!tasks.length) return { archivedTasks: 0, createdPlans: 0, workday };

  const groups = new Map<string, TaskRow[]>();
  for (const task of tasks) {
    const groupKey = `${task.employee_id}:${task.task_date}`;
    const group = groups.get(groupKey) || [];
    group.push(task);
    groups.set(groupKey, group);
  }

  const plans = [...groups.values()].map((group) => {
    const first = group[0];
    const completed = group.filter((task) => task.status === "completed").length;
    const lines = group.map((task, index) => {
      const note = task.notes?.trim() ? `\n   ملاحظة: ${task.notes.trim()}` : "";
      return `${index + 1}. ${task.title}\n   الحالة: ${statusLabel(task.status)} | الاولوية: ${task.priority}${note}`;
    });
    return {
      id: archiveId(first.employee_id, first.task_date),
      employee_id: first.employee_id,
      plan_type: "daily",
      title: `مهام يوم ${first.task_date}`,
      details: `ملخص تلقائي لمهام اليوم\nالمنجز: ${completed} من ${group.length}\n\n${lines.join("\n\n")}`,
    };
  });

  const plansResponse = await fetch(`${url}/rest/v1/plans?on_conflict=id`, {
    method: "POST",
    headers: { ...headers, Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify(plans),
    cache: "no-store",
  });
  if (!plansResponse.ok) throw new Error(await plansResponse.text());

  const deleteResponse = await fetch(`${url}/rest/v1/tasks?task_date=lt.${encodeURIComponent(workday)}`, {
    method: "DELETE",
    headers: { ...headers, Prefer: "return=minimal" },
    cache: "no-store",
  });
  if (!deleteResponse.ok) throw new Error(await deleteResponse.text());

  return { archivedTasks: tasks.length, createdPlans: plans.length, workday };
}

export async function GET() {
  try {
    return NextResponse.json(await archiveOldTasks());
  } catch (error) {
    console.error("Daily archive failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Daily archive failed" }, { status: 500 });
  }
}

export const POST = GET;
