import { LoggedLayout } from "../../../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { CreatePostPage } from "../../../../components/posts/CreatePostPage";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { trpc } from "../../../../utils/trpc";
import mixpanel from "../../../../utils/mixpanel";

const CreatePostView = () => {
  const { data: session } = trpc.auth.getSession.useQuery();
  const router = useRouter();

  useEffect(() => {
    mixpanel.track("pageview", {
      path: router.asPath,
      title: "Create Post Page",
      userId: session?.userId,
    });
  }, [router.asPath, session?.userId]);

  const { userId } = router.query;

  if (!userId || typeof userId !== "string") {
    return <div>Invalid userId</div>;
  }

  return (
    <LoggedLayout
      title="Profile Page | Leace"
      roles={[Role.ADMIN, Role.AGENCY, Role.OWNER]}
    >
      <CreatePostPage userId={userId} />
    </LoggedLayout>
  );
};

export default CreatePostView;
