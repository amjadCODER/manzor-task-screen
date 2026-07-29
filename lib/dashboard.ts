import type { CompletedTask, CurrentTask, DashboardData, Employee } from "@/types/dashboard";

// نفس ارقام الايدي والاسماء المستخدمة في نظام منظور Vault.
export const employees: Employee[] = [
  { id: "1001", name: "امجاد", role: "مديرة التقنية", activeTask: "لم تضف مهام اليوم", completedToday: 0, totalToday: 0, averageMinutes: 0, status: "available" },
  { id: "1002", name: "امين", role: "فريق منظور", activeTask: "لم يضف مهام اليوم", completedToday: 0, totalToday: 0, averageMinutes: 0, status: "available" },
  { id: "1003", name: "طلال", role: "فريق منظور", activeTask: "لم يضف مهام اليوم", completedToday: 0, totalToday: 0, averageMinutes: 0, status: "available" },
  { id: "1004", name: "عماد", role: "فريق منظور", activeTask: "لم يضف مهام اليوم", completedToday: 0, totalToday: 0, averageMinutes: 0, status: "available" },
  { id: "1005", name: "بشير", role: "فريق منظور", activeTask: "لم يضف مهام اليوم", completedToday: 0, totalToday: 0, averageMinutes: 0, status: "available" },
  { id: "1006", name: "منير", role: "فريق منظور", activeTask: "لم يضف مهام اليوم", completedToday: 0, totalToday: 0, averageMinutes: 0, status: "available" },
  { id: "1007", name: "عبد الوهاب", role: "فريق منظور", activeTask: "لم يضف مهام اليوم", completedToday: 0, totalToday: 0, averageMinutes: 0, status: "available" },
  { id: "1008", name: "عهد", role: "فريق منظور", activeTask: "لم تضف مهام اليوم", completedToday: 0, totalToday: 0, averageMinutes: 0, status: "available" },
  { id: "1009", name: "حساب المتدرب", role: "متدرب", activeTask: "لم يضف مهام اليوم", completedToday: 0, totalToday: 0, averageMinutes: 0, status: "available" },
];

// المهام الفعلية تضاف من شاشة كل موظف، لذلك لا نعرض بيانات تجريبية باسم موظفين سابقين.
export const currentTasks: CurrentTask[] = [];
export const completedTasks: CompletedTask[] = [];

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

export function getTopEmployee(items: Employee[]): Employee | undefined {
  const employeesWithTasks = items.filter((employee) => employee.totalToday > 0);
  if (!employeesWithTasks.length) return undefined;

  return [...employeesWithTasks].sort((a, b) => {
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
    current: items.filter((employee) => employee.totalToday > employee.completedToday).length,
    completed,
    assigned,
    rate,
  };
}
