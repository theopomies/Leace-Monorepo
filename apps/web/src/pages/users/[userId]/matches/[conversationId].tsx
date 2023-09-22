import { useRouter } from "next/router";
import { LoggedLayout } from "../../../../components/layout/LoggedLayout";
import { ChatPage } from "../../../../components/shared/chat/ChatPage";

export default function MatchChat() {
  const router = useRouter();
  const { userId, conversationId } = router.query;

  if (
    !userId ||
    !conversationId ||
    typeof userId !== "string" ||
    typeof conversationId !== "string"
  ) {
    return <div>BAD REQ</div>;
  }

  const postId = router.query.postId as string | undefined;

  return (
    <LoggedLayout title="Chat | Leace">
      <div className="flex h-screen w-full justify-center p-4">
        <ChatPage
          userId={userId}
          conversationId={conversationId}
          postId={postId}
        />
      </div>
    </LoggedLayout>
  );
}
