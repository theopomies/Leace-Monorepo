import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { OccupiedPropertiesList } from "../../components/dashboard/OccupiedPropertiesList";
import { Loader } from "../../components/shared/Loader";

export default function AvailablePage() {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();

  if (isLoading) return <Loader />;

  return (
    <LoggedLayout title="Occupied | Leace" roles={[Role.AGENCY]}>
      {!!session && <OccupiedPropertiesList userId={session.userId} />}
    </LoggedLayout>
  );
}
