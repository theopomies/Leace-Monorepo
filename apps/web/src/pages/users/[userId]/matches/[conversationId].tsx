import { useRouter } from "next/router";
import { LoggedLayout } from "../../../../components/layout/LoggedLayout";
import { Loader } from "../../../../components/shared/Loader";
import { Chat } from "../../../../components/shared/chat";
import { trpc } from "../../../../utils/trpc";

const ChatAll = () => {
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

  return (
    <LoggedLayout title="Chat | Leace">
      <div className="flex h-screen w-full justify-center p-4">
        <UserChat userId={userId} conversationId={conversationId} />
      </div>
    </LoggedLayout>
  );
};

export default ChatAll;

const UserChat = ({
  userId,
  conversationId,
}: {
  userId: string;
  conversationId: string;
}) => {
  const utils = trpc.useContext();
  const { data: conversation, isLoading } =
    trpc.conversation.getConversation.useQuery({ conversationId });
  const sendMutation = trpc.conversation.sendMessage.useMutation({
    onSuccess() {
      utils.conversation.getConversation.invalidate();
    },
  });
  const { data: relationship } = trpc.relationship.getMatchesForTenant.useQuery(
    { userId },
  );

  const sendMessage = (content: string) => {
    sendMutation.mutate({ conversationId, content });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!conversation) {
    return <div>Conversation not found</div>; // TODO: 404
  }

  return (
    <Chat
      userId={userId}
      messages={conversation.messages}
      onSend={sendMessage}
    />
  );
};
