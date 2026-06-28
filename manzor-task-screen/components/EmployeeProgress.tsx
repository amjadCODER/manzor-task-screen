import type { Employee } from "@/types/dashboard";
import { getCompletionRate } from "@/lib/dashboard";
import { Donut } from "./Donut";

export function EmployeeProgress({ employees }: { employees: Employee[] }) {
  return (
    <section className="glass-panel flex min-h-0 flex-col rounded-[32px] p-5">
      <div className="mb-4 shrink-0">
        <h2 className="text-2xl font-black text-white">تقدم الموظفين</h2>
        <p className="mt-1 text-sm text-slate-300">نسبة إنجاز اليوم لكل موظف</p>
      </div>

      <div className="no-scrollbar grid min-h-0 flex-1 grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 overflow-y-auto pr-1">
        {employees.map((employee) => (
          <article key={employee.id} className="rounded-3xl border border-white/10 bg-white/[0.07] p-4 text-center">
            <Donut value={getCompletionRate(employee)} label={employee.name} size="sm" />
            <p className="mt-2 text-xs text-slate-300">
              {employee.completedToday} من {employee.totalToday} مهام
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
