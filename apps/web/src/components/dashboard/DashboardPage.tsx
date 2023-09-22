import { Dashboard } from "./NewDashboard";

export interface DashboardPageProps {
  userId: string;
}

export function DashboardPage({ userId }: DashboardPageProps) {
  return <Dashboard />;
}
