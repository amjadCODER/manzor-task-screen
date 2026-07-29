"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { DashboardData, Employee, EmployeeTask } from "@/types/dashboard";
import { getTopEmployee, getTotals } from "@/lib/dashboard";
import { getTasks, todayKey } from "@/lib/task-store";
import { useDashboard } from "@/hooks/useDashboard";
import { CompletedTasks } from "./CompletedTasks";
import { CurrentTasks } from "./CurrentTasks";
import { EmployeeProgress } from "./EmployeeProgress";
import { EmployeeTaskModal } from "./EmployeeTaskModal";
import { FooterStats } from "./FooterStats";
import { Header } from "./Header";
import { TopPerformer } from "./TopPerformer";

export function DashboardScreen({ initialData }: { initialData: DashboardData }) {
  const router = useRouter();
  const { data, isRefreshing } = useDashboard(initialData);
  const [allTasks, setAllTasks] = useState<EmployeeTask[]>([]);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [activeEmployeeId, setActiveEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    setActiveEmployeeId(localStorage.getItem("manzor_active_employee"));

    const refreshLocal = () => setAllTasks(getTasks().filter((task) => task.date === todayKey()));
    refreshLocal();
    window.addEventListener("storage", refreshLocal);
    window.addEventListener("manzor-data-updated", refreshLocal);
    return () => {
      window.removeEventListener("storage", refreshLocal);
      window.removeEventListener("manzor-data-updated", refreshLocal);
    };
  }, []);

  const employees = useMemo(() => data.employees.map((employee) => {
    const tasks = allTasks.filter((task) => task.employeeId === employee.id);
    if (!tasks.length) return employee;
    return {
      ...employee,
      activeTask: tasks.find((task) => task.status === "in_progress")?.title || tasks.find((task) => task.status !== "completed")?.title || "تم انجاز مهام اليوم",
      completedToday: tasks.filter((task) => task.status === "completed").length,
      totalToday: tasks.length,
    };
  }), [data.employees, allTasks]);

  const topEmployee = getTopEmployee(employees);
  const totals = getTotals(employees);

  async function enterFullscreen() {
    try {
      await document.documentElement.requestFullscreen?.();
      const orientation = screen.orientation as ScreenOrientation & { lock?: (orientation: string) => Promise<void> };
      await orientation.lock?.("landscape");
    } catch { /* المتصفح قد يمنع تثبيت الاتجاه */ }
  }

  return (
    <main className="monitor-page soft-grid h-screen w-screen overflow-y-auto overflow-x-hidden p-2 text-white sm:p-3 xl:p-4" dir="rtl">
      <section className="relative flex min-h-full w-full flex-col gap-3 overflow-visible rounded-[28px] border border-white/10 bg-[#040816]/75 p-3 shadow-[0_30px_120px_rgba(0,0,0,0.45)] sm:rounded-[42px] sm:p-4 xl:gap-4 xl:p-5">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-40 h-[34rem] w-[34rem] rounded-full bg-purple-500/25 blur-3xl" />
        <Header />

        <div className="absolute left-4 top-4 z-40 flex gap-2">
          <button onClick={enterFullscreen} title="شاشة كاملة بالعرض" className="rounded-2xl border border-white/15 bg-black/35 px-3 py-2 text-sm font-black text-white backdrop-blur-xl">⛶</button>
          <button onClick={() => router.push(activeEmployeeId ? `/employee/${activeEmployeeId}` : "/")} title={activeEmployeeId ? "فتح مساحتي" : "دخول الموظف"} className="rounded-2xl border border-white/15 bg-black/35 px-3 py-2 text-sm font-black text-white backdrop-blur-xl">{activeEmployeeId ? "مساحتي" : "دخول"}</button>
        </div>

        <section className="relative z-10 grid flex-1 grid-cols-1 gap-3 lg:grid-cols-12 xl:gap-4">
          <div className="min-h-[260px] lg:col-span-4 lg:min-h-0"><CurrentTasks tasks={data.currentTasks} /></div>
          <div className="min-h-[620px] lg:col-span-5 lg:min-h-0"><EmployeeProgress employees={employees} onSelect={setSelected} /></div>
          <div className="flex min-h-[360px] flex-col gap-3 lg:col-span-3 lg:min-h-0 xl:gap-4"><TopPerformer employee={topEmployee} /><CompletedTasks tasks={data.completedTasks} /></div>
        </section>
        <FooterStats {...totals} />
        <div className="pointer-events-none absolute bottom-4 left-5 z-20 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[10px] font-bold text-slate-300 backdrop-blur-xl sm:text-xs">
          {isRefreshing ? "جاري التحديث..." : "تحديث تلقائي كل 15 ثانية"}
        </div>
      </section>
      {selected && <EmployeeTaskModal employee={selected} tasks={allTasks.filter((task) => task.employeeId === selected.id)} onClose={() => setSelected(null)} />}
    </main>
  );
}
