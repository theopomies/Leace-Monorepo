import { LoggedLayout } from "../../../components/shared/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { MatchesPage } from "../../../components/users/matches/MatchesPage";
import { useRouter } from "next/router";

const Matches = () => {
  const router = useRouter();
  const { userId } = router.query;

  const children =
    userId && typeof userId == "string" ? (
      <MatchesPage userId={userId} />
    ) : (
      <>UserId is required</>
    );

  return (
    <LoggedLayout
      title="Mes Matchs"
      roles={[Role.AGENCY, Role.OWNER, Role.TENANT, Role.ADMIN]}
    >
      {children}
    </LoggedLayout>
  );
};

export default Matches;
