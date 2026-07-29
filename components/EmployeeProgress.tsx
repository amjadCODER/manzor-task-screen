"use client";

import type { Employee } from "@/types/dashboard";
import { getCompletionRate } from "@/lib/dashboard";
import { Donut } from "./Donut";

export function EmployeeProgress({ employees, onSelect }: { employees: Employee[]; onSelect: (employee: Employee) => void }) {
  return (
    <section className="glass-panel flex min-h-0 flex-col rounded-[26px] p-3 sm:rounded-[32px] sm:p-4 xl:p-5">
      <div className="mb-3 shrink-0">
        <h2 className="text-xl font-black text-white xl:text-2xl">تقدم الموظفين</h2>
        <p className="mt-1 text-xs text-slate-300 xl:text-sm">اضغط على الموظف لعرض مهامه كاملة</p>
      </div>

      <div className="employee-progress-grid grid min-h-0 flex-1 grid-cols-2 gap-2 overflow-visible sm:grid-cols-3 xl:gap-3">
        {employees.map((employee) => (
          <button
            type="button"
            onClick={() => onSelect(employee)}
            key={employee.id}
            className="employee-progress-card min-h-[132px] rounded-2xl border border-white/10 bg-white/[0.07] p-2 text-center transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/[0.11] xl:min-h-[145px] xl:rounded-3xl xl:p-3"
          >
            <Donut value={getCompletionRate(employee)} label={employee.name} size="sm" />
            <p className="mt-1 text-[10px] text-slate-300 xl:text-xs">{employee.completedToday} من {employee.totalToday} مهام</p>
            <p className="mt-1 text-[10px] font-bold text-cyan-200 xl:text-[11px]">عرض التفاصيل</p>
          </button>
        ))}
      </div>
    </section>
  );
}
