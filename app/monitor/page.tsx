import { DashboardScreen } from "@/components/DashboardScreen";
import { getDashboardData } from "@/lib/dashboard";

export default function MonitorPage() {
  return <DashboardScreen initialData={getDashboardData()} />;
}
