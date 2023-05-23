import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { PotentialMatches } from "../../components/premium/PotentialMatchesAgencyOwner";
import { Loader } from "../../components/shared/Loader";
import Premium from "../premium";

export default function OccupiedClientPage() {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();
  const { data: me } = trpc.user.getUserById.useQuery({
    userId: session?.userId ?? "",
  });
  if (!me?.isPremium) {
    return <Premium />;
  }
  if (isLoading) return <Loader />;
  return (
    <LoggedLayout
      title="Potential Match | Leace"
      roles={[Role.AGENCY, Role?.OWNER]}
    >
      {!!session && <PotentialMatches userId={session.userId} />}
    </LoggedLayout>
  );
}
