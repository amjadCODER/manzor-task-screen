import type { CompletedTask } from "@/types/dashboard";

export function CompletedTasks({ tasks }: { tasks: CompletedTask[] }) {
  return (
    <section className="glass-panel flex min-h-0 flex-1 flex-col rounded-[32px] p-5">
      <div className="mb-4 flex shrink-0 items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">آخر المهام المكتملة</h2>
          <p className="mt-1 text-xs text-slate-300">آخر إنجاز من كل قائمة</p>
        </div>
        <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-100">
          اليوم
        </span>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {tasks.map((task) => (
          <article key={task.id} className="rounded-3xl border border-white/10 bg-white/[0.07] p-4">
            <p className="line-clamp-2 text-sm font-bold leading-6 text-white">{task.title}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
              <span className="font-bold text-cyan-100">{task.employeeName}</span>
              <span>{task.completedAt}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
