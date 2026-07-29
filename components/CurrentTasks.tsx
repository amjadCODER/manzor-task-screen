import type { CurrentTask } from "@/types/dashboard";

const priorityClass = {
  عالية: "bg-rose-400/15 text-rose-100 border-rose-300/20",
  متوسطة: "bg-amber-400/15 text-amber-100 border-amber-300/20",
  عادية: "bg-cyan-400/15 text-cyan-100 border-cyan-300/20",
};

export function CurrentTasks({ tasks }: { tasks: CurrentTask[] }) {
  return (
    <section className="glass-panel flex min-h-0 flex-col rounded-[32px] p-5">
      <div className="mb-4 flex shrink-0 items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">المهام الجارية</h2>
          <p className="mt-1 text-sm text-slate-300">أول مهمة فعالة من قائمة كل موظف</p>
        </div>
        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100">
          {tasks.length} مهام
        </span>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {tasks.map((task) => (
          <article key={task.id} className="task-card rounded-3xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="line-clamp-2 text-lg font-black leading-snug text-white">{task.title}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-300">
                  <span>الموظف: <strong className="text-cyan-100">{task.employeeName}</strong></span>
                  <span className="h-1 w-1 rounded-full bg-slate-500" />
                  <span>بدأت: {task.startedAt}</span>
                </div>
              </div>
              <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${priorityClass[task.priority]}`}>
                {task.priority}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
