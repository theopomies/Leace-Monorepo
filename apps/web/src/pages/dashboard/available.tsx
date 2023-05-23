import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { AvailablePropertiesList } from "../../components/dashboard/AvailablePropertiesList";
import { Loader } from "../../components/shared/Loader";

export default function AvailablePage() {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();

  if (isLoading) return <Loader />;

  return (
    <LoggedLayout title="Available | Leace" roles={[Role.AGENCY]}>
      {!!session && <AvailablePropertiesList userId={session.userId} />}
    </LoggedLayout>
  );
}
