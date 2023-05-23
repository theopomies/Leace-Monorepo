import { LoggedLayout } from "../../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { MatchesPage } from "../../../components/users/matches/MatchesPage";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { useEffect, useState } from "react";
import { useSession } from "@clerk/nextjs";

const Delete = () => {
  const session = useSession();
  const router = useRouter();
  const { userId } = router.query;
  const [redirecting, setRedirecting] = useState(false);

  const deleteUser = trpc.user.deleteUserById.useMutation();

  const children = userId && typeof userId == "string";

  useEffect(() => {
    if (!session.isLoaded || !session || redirecting || !session.isSignedIn) {
      return;
    }
    setRedirecting(true);

    if (userId && typeof userId == "string") {
      deleteUser
        .mutateAsync({ userId })
        .catch((err) => {
          console.error(err);
        })
        .then(() => {
          router.reload();
        });
    }
  }, [session, deleteUser, router, userId, redirecting]);

  return (
    <LoggedLayout
      title="Delete Account"
      roles={[Role.AGENCY, Role.OWNER, Role.TENANT, Role.ADMIN]}
    >
      {children}
    </LoggedLayout>
  );
};

export default Delete;
