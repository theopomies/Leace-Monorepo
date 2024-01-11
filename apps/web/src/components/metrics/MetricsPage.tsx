import { Metrics } from "./Metrics";

export interface MetricsPageProps {
  userId: string;
}

export function MetricsPage({ userId }: MetricsPageProps) {
  return <Metrics userId={userId} />;
}
