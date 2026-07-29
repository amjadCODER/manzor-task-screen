"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { employees } from "@/lib/dashboard";
import {
  deletePlan,
  deleteTask,
  exportExcelSheet,
  getPlans,
  getTasks,
  savePlan,
  saveTask,
  todayKey,
  updateTaskStatus,
} from "@/lib/task-store";
import type {
  EmployeePlan,
  EmployeeTask,
  PlanType,
  TaskPriority,
  TaskStatus,
} from "@/types/dashboard";

const tabs: { key: "tasks" | PlanType; label: string }[] = [
  { key: "tasks", label: "مهام اليوم" },
  { key: "daily", label: "الخطة اليومية" },
  { key: "weekly", label: "الخطة الاسبوعية" },
  { key: "annual", label: "الخطة السنوية" },
];

const planLabels: Record<PlanType, string> = {
  daily: "اليومية",
  weekly: "الاسبوعية",
  annual: "السنوية",
};

const priorityClasses: Record<TaskPriority, string> = {
  مرنة: "border-emerald-300/20 bg-emerald-400/15 text-emerald-100",
  متوسطة: "border-amber-300/20 bg-amber-400/15 text-amber-100",
  قصوى: "border-rose-300/20 bg-rose-400/15 text-rose-100",
};

export default function EmployeeWorkspace() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const employee = employees.find((item) => item.id === params.id);

  const [activeTab, setActiveTab] = useState<"tasks" | PlanType>("tasks");
  const [tasks, setTasks] = useState<EmployeeTask[]>([]);
  const [plans, setPlans] = useState<EmployeePlan[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskNotes, setTaskNotes] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("متوسطة");
  const [planTitle, setPlanTitle] = useState("");
  const [planDetails, setPlanDetails] = useState("");

  useEffect(() => {
    if (!employee) return;

    const refreshData = () => {
      setTasks(
        getTasks(employee.id).filter((task) => task.date === todayKey()),
      );
      setPlans(getPlans(employee.id));
    };

    refreshData();
    window.addEventListener("manzor-data-updated", refreshData);

    return () => {
      window.removeEventListener("manzor-data-updated", refreshData);
    };
  }, [employee]);

  const visiblePlans = useMemo(() => {
    if (activeTab === "tasks") return [];

    return plans.filter((plan) => plan.type === activeTab);
  }, [plans, activeTab]);

  const completed = tasks.filter(
    (task) => task.status === "completed",
  ).length;

  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  if (!employee) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6 text-white">
        <div className="glass-panel rounded-3xl p-10 text-center">
          <h1 className="text-2xl font-black">رقم الموظف غير موجود</h1>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-5 rounded-2xl bg-cyan-500 px-5 py-3 font-black"
          >
            رجوع للدخول
          </button>
        </div>
      </main>
    );
  }

  const currentEmployee = employee;

  function refresh() {
    setTasks(
      getTasks(currentEmployee.id).filter(
        (task) => task.date === todayKey(),
      ),
    );

    setPlans(getPlans(currentEmployee.id));
  }

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanTitle = taskTitle.trim();
    const cleanNotes = taskNotes.trim();

    if (!cleanTitle) return;

    saveTask({
      id: crypto.randomUUID(),
      employeeId: currentEmployee.id,
      title: cleanTitle,
      notes: cleanNotes,
      priority,
      status: "pending",
      date: todayKey(),
    });

    setTaskTitle("");
    setTaskNotes("");
    setPriority("متوسطة");
    refresh();
  }

  function addPlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (activeTab === "tasks") return;

    const cleanTitle = planTitle.trim();
    const cleanDetails = planDetails.trim();

    if (!cleanTitle || !cleanDetails) return;

    savePlan({
      id: crypto.randomUUID(),
      employeeId: currentEmployee.id,
      type: activeTab,
      title: cleanTitle,
      details: cleanDetails,
      createdAt: new Date().toISOString(),
    });

    setPlanTitle("");
    setPlanDetails("");
    refresh();
  }

  function exportCurrent() {
    if (activeTab === "tasks") {
      exportExcelSheet(
        `مهام-${currentEmployee.name}-${todayKey()}`,
        [
          "رقم الموظف",
          "الموظف",
          "المهمة",
          "الاولوية",
          "الحالة",
          "التاريخ",
          "الملاحظات",
        ],
        tasks.map((task) => [
          currentEmployee.id,
          currentEmployee.name,
          task.title,
          task.priority,
          task.status === "completed"
            ? "منجزة"
            : task.status === "in_progress"
              ? "جاري العمل"
              : "لم تبدأ",
          task.date,
          task.notes || "",
        ]),
      );

      return;
    }

    exportExcelSheet(
      `الخطة-${planLabels[activeTab]}-${currentEmployee.name}`,
      [
        "رقم الموظف",
        "الموظف",
        "نوع الخطة",
        "العنوان",
        "التفاصيل",
        "تاريخ الاضافة",
      ],
      visiblePlans.map((plan) => [
        currentEmployee.id,
        currentEmployee.name,
        planLabels[plan.type],
        plan.title,
        plan.details,
        new Date(plan.createdAt).toLocaleDateString("ar-SA"),
      ]),
    );
  }

  async function fullscreenLandscape() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.();
      }

      const orientation = screen.orientation as ScreenOrientation & {
        lock?: (value: "landscape") => Promise<void>;
      };

      await orientation.lock?.("landscape");
    } catch {
      // بعض المتصفحات لا تسمح بتثبيت اتجاه الشاشة
    }
  }

  return (
    <main
      className="soft-grid h-screen overflow-y-auto p-3 text-white sm:p-5"
      dir="rtl"
    >
      <section className="mx-auto w-full max-w-7xl">
        <header className="glass-panel sticky top-3 z-30 flex items-center justify-between rounded-[28px] p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 p-2">
              <Image
                src="/logo.png"
                alt="منظور"
                width={60}
                height={60}
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <p className="text-xs font-bold text-cyan-200">
                {currentEmployee.id}
              </p>

              <h1 className="text-xl font-black sm:text-3xl">
                هلا {currentEmployee.name}
              </h1>

              <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                {currentEmployee.role}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.push("/monitor")}
              className="rounded-2xl border border-cyan-300/25 bg-cyan-400/10 px-3 py-3 text-xs font-black text-cyan-100 sm:px-4 sm:text-sm"
            >
              شاشة المتابعة
            </button>

            <button
              type="button"
              onClick={fullscreenLandscape}
              className="rounded-2xl border border-white/15 bg-white/10 px-3 py-3 text-lg font-black"
              aria-label="فتح شاشة كاملة"
            >
              ⛶
            </button>
          </div>
        </header>

        <section className="mt-4 grid gap-4 lg:grid-cols-[1fr_330px]">
          <div className="space-y-4">
            <nav className="glass-panel no-scrollbar flex gap-2 overflow-x-auto rounded-[24px] p-2">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`min-w-max rounded-2xl px-4 py-3 text-sm font-black transition ${
                    activeTab === tab.key
                      ? "bg-gradient-to-l from-cyan-400 to-purple-600 text-white"
                      : "bg-white/[0.06] text-slate-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {activeTab === "tasks" ? (
              <section className="glass-panel rounded-[28px] p-4 sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-black">مهام اليوم</h2>

                    <p className="mt-1 text-sm text-slate-300">
                      حدث الحالة اول باول عشان تظهر بشاشة المتابعة
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={exportCurrent}
                    className="rounded-2xl border border-emerald-300/25 bg-emerald-400/10 px-4 py-3 text-sm font-black text-emerald-100"
                  >
                    تصدير اكسل
                  </button>
                </div>

                <div className="space-y-3">
                  {tasks.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-slate-300">
                      ما اضفت مهام اليوم للحين
                    </div>
                  )}

                  {tasks.map((task) => (
                    <article
                      key={task.id}
                      className="rounded-3xl border border-white/10 bg-white/[0.07] p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3
                            className={`text-lg font-black ${
                              task.status === "completed"
                                ? "text-slate-400 line-through"
                                : "text-white"
                            }`}
                          >
                            {task.title}
                          </h3>

                          {task.notes && (
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                              {task.notes}
                            </p>
                          )}
                        </div>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${
                            priorityClasses[task.priority]
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {(
                          [
                            "pending",
                            "in_progress",
                            "completed",
                          ] as TaskStatus[]
                        ).map((status) => (
                          <button
                            type="button"
                            key={status}
                            onClick={() => {
                              updateTaskStatus(task.id, status);
                              refresh();
                            }}
                            className={`rounded-xl px-3 py-2 text-xs font-black ${
                              task.status === status
                                ? "bg-cyan-400 text-slate-950"
                                : "bg-white/10 text-slate-200"
                            }`}
                          >
                            {status === "pending"
                              ? "لم تبدأ"
                              : status === "in_progress"
                                ? "جاري العمل"
                                : "منجزة"}
                          </button>
                        ))}

                        <button
                          type="button"
                          onClick={() => {
                            deleteTask(task.id);
                            refresh();
                          }}
                          className="mr-auto rounded-xl bg-rose-400/10 px-3 py-2 text-xs font-black text-rose-200"
                        >
                          حذف
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : (
              <section className="glass-panel rounded-[28px] p-4 sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-black">
                      الخطة {planLabels[activeTab]}
                    </h2>

                    <p className="mt-1 text-sm text-slate-300">
                      تقدر تضيف اكثر من بند وتصدرها كملف اكسل
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={exportCurrent}
                    className="rounded-2xl border border-emerald-300/25 bg-emerald-400/10 px-4 py-3 text-sm font-black text-emerald-100"
                  >
                    تصدير اكسل
                  </button>
                </div>

                <div className="space-y-3">
                  {visiblePlans.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-slate-300">
                      ما اضفت شي في هالخطة للحين
                    </div>
                  )}

                  {visiblePlans.map((plan) => (
                    <article
                      key={plan.id}
                      className="rounded-3xl border border-white/10 bg-white/[0.07] p-4"
                    >
                      <h3 className="text-lg font-black">{plan.title}</h3>

                      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                        {plan.details}
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          deletePlan(plan.id);
                          refresh();
                        }}
                        className="mt-4 rounded-xl bg-rose-400/10 px-3 py-2 text-xs font-black text-rose-200"
                      >
                        حذف
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-4">
            <section className="glass-panel rounded-[28px] p-5">
              <p className="text-sm font-bold text-cyan-200">
                انجاز اليوم
              </p>

              <div className="mt-4 flex items-end justify-between">
                <p className="text-5xl font-black">{progress}%</p>

                <p className="text-sm text-slate-300">
                  {completed} من {tasks.length}
                </p>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-cyan-400 to-purple-600"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </section>

            {activeTab === "tasks" ? (
              <form
                onSubmit={addTask}
                className="glass-panel rounded-[28px] p-5"
              >
                <h2 className="text-xl font-black">اضافة مهمة</h2>

                <input
                  value={taskTitle}
                  onChange={(event) => setTaskTitle(event.target.value)}
                  placeholder="اسم المهمة"
                  className="mt-4 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-300/50"
                />

                <textarea
                  value={taskNotes}
                  onChange={(event) => setTaskNotes(event.target.value)}
                  placeholder="ملاحظات اختيارية"
                  rows={4}
                  className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-300/50"
                />

                <label className="mt-3 block text-sm font-bold text-slate-300">
                  الاولوية
                </label>

                <select
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value as TaskPriority)
                  }
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[#10172a] px-4 py-3 text-white outline-none"
                >
                  <option value="مرنة">مرنة</option>
                  <option value="متوسطة">متوسطة</option>
                  <option value="قصوى">قصوى</option>
                </select>

                <button
                  type="submit"
                  className="mt-4 w-full rounded-2xl bg-gradient-to-l from-cyan-400 to-purple-600 px-4 py-3 font-black"
                >
                  اضافة المهمة
                </button>
              </form>
            ) : (
              <form
                onSubmit={addPlan}
                className="glass-panel rounded-[28px] p-5"
              >
                <h2 className="text-xl font-black">اضافة للخطة</h2>

                <input
                  value={planTitle}
                  onChange={(event) => setPlanTitle(event.target.value)}
                  placeholder="عنوان البند"
                  className="mt-4 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-300/50"
                />

                <textarea
                  value={planDetails}
                  onChange={(event) => setPlanDetails(event.target.value)}
                  placeholder="تفاصيل الخطة"
                  rows={7}
                  className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-300/50"
                />

                <button
                  type="submit"
                  className="mt-4 w-full rounded-2xl bg-gradient-to-l from-cyan-400 to-purple-600 px-4 py-3 font-black"
                >
                  حفظ بالخطة
                </button>
              </form>
            )}
          </aside>
        </section>
      </section>
    </main>
  );
}