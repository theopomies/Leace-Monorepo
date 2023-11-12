/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { LoggedLayout } from "../../../components/layout/LoggedLayout";
import { UpdateUserPage } from "../../../components/users/UpdateUserPage";
import { useEffect } from "react";
import { trpc } from "../../../utils/trpc";
import mixpanel from "../../../utils/mixpanel";
import { Loader } from "../../../components/shared/Loader";

const Update = () => {
  const router = useRouter();
  const { data: session, isLoading: sessionIsLoading } =
    trpc.auth.getSession.useQuery();

  useEffect(() => {
    if (session && !sessionIsLoading) {
      mixpanel.track("Page View", {
        path: router.asPath,
        title: "Update User Page",
        userId: session?.userId,
      });
    }
  }, [router.asPath, session, sessionIsLoading]);

  if (sessionIsLoading) return <Loader />;

  if (!session) return <div>Not logged in</div>;

  const { userId } = router.query;

  if (typeof userId != "string" || !userId) return <div>Invalid userId</div>;

  return (
    <LoggedLayout title="Profile Page | Leace">
      <UpdateUserPage userId={userId} />
    </LoggedLayout>
  );
};

export default Update;
