import { LoggedLayout } from "../../../../components/layout/LoggedLayout";
import { useRouter } from "next/router";
import { ChatPage } from "../../../../components/shared/chat/ChatPage";
import { trpc } from "../../../../utils/trpc";
import { useEffect } from "react";
import mixpanel from "../../../../utils/mixpanel";

const Matches = () => {
  const router = useRouter();

  const { data: session } = trpc.auth.getSession.useQuery();

  useEffect(() => {
    mixpanel.track("Page View", {
      path: router.asPath,
      title: "Matches Page",
      userId: session?.userId,
    });
  }, [router.asPath, session?.userId]);

  const { userId } = router.query;

  if (typeof userId != "string" || !userId) {
    return <div>UserId is required</div>;
  }

  const postId = router.query.postId as string | undefined;

  return (
    <LoggedLayout title="Chat | Leace">
      <div className="flex h-screen w-full justify-center p-4">
        <ChatPage userId={userId} postId={postId} />
      </div>
    </LoggedLayout>
  );
};

export default Matches;
