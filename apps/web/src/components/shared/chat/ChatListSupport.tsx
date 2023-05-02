import { Dispatch, SetStateAction } from "react";
import { trpc } from "../../../utils/trpc";
import { ChatList } from "./ChatList";

export interface ChatListSupportProps {
  userId: string;
  conversationId: string;
  setConversationId: Dispatch<SetStateAction<string>>;
}

export const ChatListSupport = ({
  userId,
  conversationId,
  setConversationId,
}: ChatListSupportProps) => {
  const { data: supportRelationships } =
    trpc.moderation.support.getRelationships.useQuery(
      { userId },
      {
        onSuccess(data) {
          if (!conversationId && data && data[0] && data[0].conversation)
            setConversationId(data[0].conversation.id);
        },
      },
    );

  return (
    <ChatList
      userId={userId}
      conversationId={conversationId}
      setConversationId={setConversationId}
      supportRelationships={supportRelationships}
    />
  );
};
