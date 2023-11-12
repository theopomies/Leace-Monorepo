import { LoggedLayout } from "../../../../components/layout/LoggedLayout";
import { useRouter } from "next/router";
import { ChatPage } from "../../../../components/shared/chat/ChatPage";
import { trpc } from "../../../../utils/trpc";
import { useEffect } from "react";
import mixpanel from "../../../../utils/mixpanel";
import { Loader } from "../../../../components/shared/Loader";

const Matches = () => {
  const router = useRouter();
  const { data: session, isLoading: sessionIsLoading } =
    trpc.auth.getSession.useQuery();

  useEffect(() => {
    if (session && !sessionIsLoading) {
      mixpanel.track("Page View", {
        path: router.asPath,
        title: "Matches Page",
        userId: session?.userId,
      });
    }
  }, [router.asPath, session, sessionIsLoading]);

  if (sessionIsLoading) return <Loader />;

  if (!session || !session.role) return <div>Not logged in</div>;

  const { userId } = router.query;

  if (typeof userId != "string" || !userId) {
    return <div>UserId is required</div>;
  }

  const postId = router.query.postId as string | undefined;

  return (
    <LoggedLayout title="Chat | Leace">
      <div className="flex h-screen w-full justify-center p-4">
        <ChatPage role={session.role} userId={userId} postId={postId} />
      </div>
    </LoggedLayout>
  );
};

export default Matches;
