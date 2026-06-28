import { DashboardScreen } from "@/components/DashboardScreen";
import { getDashboardData } from "@/lib/dashboard";

export default function Home() {
  return <DashboardScreen initialData={getDashboardData()} />;
}
