export type TaskStatus = "current" | "completed" | "late";

export type Employee = {
  id: string;
  name: string;
  role: string;
  activeTask: string;
  completedToday: number;
  totalToday: number;
  averageMinutes: number;
  status: "active" | "focused" | "available";
};

export type CompletedTask = {
  id: string;
  title: string;
  employeeName: string;
  completedAt: string;
};

export type CurrentTask = {
  id: string;
  title: string;
  employeeName: string;
  priority: "عالية" | "متوسطة" | "عادية";
  startedAt: string;
};

export type DashboardData = {
  employees: Employee[];
  currentTasks: CurrentTask[];
  completedTasks: CompletedTask[];
  updatedAt: string;
};
