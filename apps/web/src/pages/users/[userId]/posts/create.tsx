import { LoggedLayout } from "../../../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { CreatePostPage } from "../../../../components/posts/CreatePostPage";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { trpc } from "../../../../utils/trpc";
import mixpanel from "../../../../utils/mixpanel";
import { Loader } from "../../../../components/shared/Loader";

const CreatePostView = () => {
  const router = useRouter();
  const { data: session, isLoading: sessionIsLoading } =
    trpc.auth.getSession.useQuery();

  useEffect(() => {
    if (session && !sessionIsLoading) {
      mixpanel.track("Page View", {
        path: router.asPath,
        title: "Create Post Page",
        userId: session?.userId,
      });
    }
  }, [router.asPath, session, sessionIsLoading]);

  if (sessionIsLoading) return <Loader />;

  if (!session) return <div>Not logged in</div>;

  const { userId } = router.query;

  if (!userId || typeof userId !== "string") {
    return <div>Invalid userId</div>;
  }

  return (
    <LoggedLayout
      title="Profile Page | Leace"
      roles={[Role.ADMIN, Role.AGENCY, Role.OWNER]}
    >
      <CreatePostPage />
    </LoggedLayout>
  );
};

export default CreatePostView;
