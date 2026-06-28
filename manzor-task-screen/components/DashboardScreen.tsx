"use client";

import type { DashboardData } from "@/types/dashboard";
import { getTopEmployee, getTotals } from "@/lib/dashboard";
import { useDashboard } from "@/hooks/useDashboard";
import { CompletedTasks } from "./CompletedTasks";
import { CurrentTasks } from "./CurrentTasks";
import { EmployeeProgress } from "./EmployeeProgress";
import { FooterStats } from "./FooterStats";
import { Header } from "./Header";
import { TopPerformer } from "./TopPerformer";

export function DashboardScreen({ initialData }: { initialData: DashboardData }) {
  const { data, isRefreshing } = useDashboard(initialData);
  const topEmployee = getTopEmployee(data.employees);
  const totals = getTotals(data.employees);

  return (
    <main className="soft-grid h-screen w-screen overflow-hidden p-4 text-white xl:p-6" dir="rtl">
      <section className="relative flex h-full w-full flex-col gap-4 overflow-hidden rounded-[42px] border border-white/10 bg-[#040816]/75 p-4 shadow-[0_30px_120px_rgba(0,0,0,0.45)] xl:gap-5 xl:p-5">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-40 h-[34rem] w-[34rem] rounded-full bg-purple-500/25 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />

        <Header />

        <section className="relative z-10 grid min-h-0 flex-1 grid-cols-12 gap-4 xl:gap-5">
          <div className="col-span-5 min-h-0">
            <CurrentTasks tasks={data.currentTasks} />
          </div>

          <div className="col-span-4 min-h-0">
            <EmployeeProgress employees={data.employees} />
          </div>

          <div className="col-span-3 flex min-h-0 flex-col gap-4 xl:gap-5">
            <TopPerformer employee={topEmployee} />
            <CompletedTasks tasks={data.completedTasks} />
          </div>
        </section>

        <FooterStats {...totals} />

        <div className="pointer-events-none absolute bottom-6 left-8 z-20 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-slate-300 backdrop-blur-xl">
          {isRefreshing ? "جاري التحديث..." : "تحديث تلقائي كل 15 ثانية"}
        </div>
      </section>
    </main>
  );
}
