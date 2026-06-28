import type { CompletedTask, CurrentTask, DashboardData, Employee } from "@/types/dashboard";

export const employees: Employee[] = [
  {
    id: "emp-001",
    name: "عهد",
    role: "تنفيذ ومتابعة",
    activeTask: "تجهيز خطة الأسبوع للمتدربات",
    completedToday: 12,
    totalToday: 15,
    averageMinutes: 18,
    status: "focused",
  },
  {
    id: "emp-002",
    name: "سحاب",
    role: "محتوى وتدقيق",
    activeTask: "مراجعة محتوى صفحة الحوكمة",
    completedToday: 8,
    totalToday: 12,
    averageMinutes: 24,
    status: "active",
  },
  {
    id: "emp-003",
    name: "وعد",
    role: "تقارير وتشغيل",
    activeTask: "رفع ملف التقرير اليومي",
    completedToday: 6,
    totalToday: 11,
    averageMinutes: 31,
    status: "active",
  },
  {
    id: "emp-004",
    name: "عماد",
    role: "حوكمة ومراجعة",
    activeTask: "اعتماد نموذج المتابعة",
    completedToday: 10,
    totalToday: 13,
    averageMinutes: 21,
    status: "focused",
  },
  {
    id: "emp-005",
    name: "أمجاد",
    role: "تقنية وربط أنظمة",
    activeTask: "تجهيز شاشة المهام المباشرة",
    completedToday: 9,
    totalToday: 10,
    averageMinutes: 16,
    status: "focused",
  },
  {
    id: "emp-006",
    name: "مازن",
    role: "متابعة مشاريع",
    activeTask: "تحديث بيانات متابعة الجمعيات",
    completedToday: 5,
    totalToday: 9,
    averageMinutes: 35,
    status: "available",
  },
];

export const currentTasks: CurrentTask[] = employees.map((employee, index) => ({
  id: `current-${employee.id}`,
  title: employee.activeTask,
  employeeName: employee.name,
  priority: index % 3 === 0 ? "عالية" : index % 3 === 1 ? "متوسطة" : "عادية",
  startedAt: `${9 + index}:0${index}`,
}));

export const completedTasks: CompletedTask[] = [
  { id: "done-001", title: "إنهاء تصميم البانر الرئيسي", employeeName: "عهد", completedAt: "08:42" },
  { id: "done-002", title: "اعتماد نموذج المتابعة", employeeName: "عماد", completedAt: "08:36" },
  { id: "done-003", title: "تدقيق محتوى صفحة الخدمة", employeeName: "سحاب", completedAt: "08:29" },
  { id: "done-004", title: "رفع ملف التقرير اليومي", employeeName: "وعد", completedAt: "08:21" },
  { id: "done-005", title: "تنسيق شاشة العرض الداخلية", employeeName: "أمجاد", completedAt: "08:14" },
  { id: "done-006", title: "إغلاق مهمة المتابعة الصباحية", employeeName: "مازن", completedAt: "08:05" },
  { id: "done-007", title: "مراجعة بيانات القوائم", employeeName: "عهد", completedAt: "07:58" },
  { id: "done-008", title: "تحديث حالة المشروع", employeeName: "عماد", completedAt: "07:44" },
];

export function getDashboardData(): DashboardData {
  return {
    employees,
    currentTasks,
    completedTasks,
    updatedAt: new Date().toISOString(),
  };
}

export function getCompletionRate(employee: Employee) {
  if (!employee.totalToday) return 0;
  return Math.round((employee.completedToday / employee.totalToday) * 100);
}

export function getTopEmployee(items: Employee[]) {
  return [...items].sort((a, b) => {
    if (b.completedToday !== a.completedToday) return b.completedToday - a.completedToday;
    return a.averageMinutes - b.averageMinutes;
  })[0];
}

export function getTotals(items: Employee[]) {
  const completed = items.reduce((sum, employee) => sum + employee.completedToday, 0);
  const assigned = items.reduce((sum, employee) => sum + employee.totalToday, 0);
  const rate = assigned ? Math.round((completed / assigned) * 100) : 0;

  return {
    employees: items.length,
    current: items.length,
    completed,
    assigned,
    rate,
  };
}
