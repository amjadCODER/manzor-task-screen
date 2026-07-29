"use client";

import type { Employee, EmployeeTask } from "@/types/dashboard";

const priorityStyle = {
  مرنة: "border-emerald-300/20 bg-emerald-400/15 text-emerald-100",
  متوسطة: "border-amber-300/20 bg-amber-400/15 text-amber-100",
  قصوى: "border-rose-300/20 bg-rose-400/15 text-rose-100",
};

const statusLabel = { pending: "لم تبدأ", in_progress: "جاري العمل", completed: "منجزة" };

export function EmployeeTaskModal({ employee, tasks, onClose }: { employee: Employee; tasks: EmployeeTask[]; onClose: () => void }) {
  const completed = tasks.filter((task) => task.status === "completed").length;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-md" onClick={onClose}>
      <section className="glass-panel max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-[32px]" onClick={(event) => event.stopPropagation()}>
        <header className="flex items-center justify-between border-b border-white/10 p-5">
          <div>
            <p className="text-sm font-bold text-cyan-200">مهام اليوم</p>
            <h2 className="mt-1 text-3xl font-black text-white">{employee.name}</h2>
            <p className="mt-1 text-sm text-slate-300">انجز {completed} من {tasks.length} مهام</p>
          </div>
          <button onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-2xl text-white">×</button>
        </header>
        <div className="no-scrollbar max-h-[68vh] space-y-3 overflow-y-auto p-5">
          {tasks.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-slate-300">ما اضاف مهام اليوم للحين</div>
          ) : tasks.map((task) => (
            <article key={task.id} className="rounded-3xl border border-white/10 bg-white/[0.07] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className={`text-lg font-black ${task.status === "completed" ? "text-slate-400 line-through" : "text-white"}`}>{task.title}</h3>
                  {task.notes && <p className="mt-2 text-sm leading-6 text-slate-300">{task.notes}</p>}
                </div>
                <div className="flex gap-2">
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold ${priorityStyle[task.priority]}`}>{task.priority}</span>
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-bold text-slate-200">{statusLabel[task.status]}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
