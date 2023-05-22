import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { Income } from "../../components/dashboard/Income";
import { Loader } from "../../components/shared/Loader";

export default function ExpensesPage() {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();

  if (isLoading) return <Loader />;

  return (
    <LoggedLayout title="Incomes | Leace" roles={[Role.AGENCY]}>
      {!!session && <Income userId={session.userId} />}
    </LoggedLayout>
  );
}
