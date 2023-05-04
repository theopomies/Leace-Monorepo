import { Dispatch, SetStateAction } from "react";
import { trpc } from "../../../utils/trpc";
import { ChatList } from "./ChatList";

export interface ChatListModerationProps {
  userId: string;
  conversationId: string;
  setConversationId: Dispatch<SetStateAction<string>>;
}

export const ChatListModeration = ({
  userId,
  conversationId,
  setConversationId,
}: ChatListModerationProps) => {
  const { data: relationships } =
    trpc.moderation.relationship.getMatches.useQuery(
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
      relationships={relationships}
    />
  );
};
