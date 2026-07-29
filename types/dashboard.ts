export type TaskStatus = "pending" | "in_progress" | "completed";
export type TaskPriority = "مرنة" | "متوسطة" | "قصوى";
export type PlanType = "daily" | "weekly" | "annual";

export type EmployeeTask = {
  id: string;
  employeeId: string;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  date: string;
  notes?: string;
};

export type EmployeePlan = {
  id: string;
  employeeId: string;
  type: PlanType;
  title: string;
  details: string;
  createdAt: string;
};

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
