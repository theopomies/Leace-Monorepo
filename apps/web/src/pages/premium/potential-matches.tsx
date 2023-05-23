import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { PotentialMatches } from "../../components/dashboard/PotentialMatches";
import { Loader } from "../../components/shared/Loader";

export default function OccupiedClientPage() {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();

  if (isLoading) return <Loader />;
  return (
    <LoggedLayout title="Potential Match | Leace" roles={[Role.AGENCY]}>
      {!!session && <PotentialMatches userId={session.userId} />}
    </LoggedLayout>
  );
}
