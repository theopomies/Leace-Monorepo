import { LoggedLayout } from "../../../../components/layout/LoggedLayout";
import { useRouter } from "next/router";
import { ChatPage } from "../../../../components/shared/chat/ChatPage";

const Matches = () => {
  const router = useRouter();
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
