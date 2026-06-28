import type { Employee } from "@/types/dashboard";
import { getCompletionRate } from "@/lib/dashboard";

export function TopPerformer({ employee }: { employee: Employee }) {
  return (
    <section className="glass-panel rounded-[32px] p-5">
      <p className="text-sm font-bold text-cyan-200">أسرع موظف اليوم</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-5xl font-black leading-none text-white">{employee.name}</h2>
          <p className="mt-3 text-sm text-slate-300">
            أنجز {employee.completedToday} مهمة بمتوسط {employee.averageMinutes} دقيقة
          </p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-amber-300/20 bg-amber-300/15 text-4xl">
          🏆
        </div>
      </div>
      <div className="mt-5 h-2 rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500"
          style={{ width: `${getCompletionRate(employee)}%` }}
        />
      </div>
    </section>
  );
}
