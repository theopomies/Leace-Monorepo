/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { LoggedLayout } from "../../../components/layout/LoggedLayout";
import { UpdateUserPage } from "../../../components/users/UpdateUserPage";
import { useEffect } from "react";
import { trpc } from "../../../utils/trpc";
import mixpanel from "../../../utils/mixpanel";

const Update = () => {
  const { data: session } = trpc.auth.getSession.useQuery();
  const router = useRouter();

  useEffect(() => {
    mixpanel.track("pageview", {
      path: router.asPath,
      title: "Update User Page",
      userId: session?.userId,
    });
  }, [router.asPath, session?.userId]);

  const { userId } = router.query;

  if (typeof userId != "string" || !userId) {
    return <div>Invalid userId</div>;
  }

  return (
    <LoggedLayout title="Profile Page | Leace">
      <UpdateUserPage userId={userId} />
    </LoggedLayout>
  );
};

export default Update;
