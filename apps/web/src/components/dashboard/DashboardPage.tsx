import { Dashboard } from "./Dashboard";

export interface DashboardPageProps {
  userId: string;
}

export function DashboardPage({ userId }: DashboardPageProps) {
  return <Dashboard userId={userId} />;
}
