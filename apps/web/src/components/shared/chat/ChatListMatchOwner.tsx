import { Dispatch, SetStateAction } from "react";
import { trpc } from "../../../utils/trpc";
import { ChatList } from "./ChatList";

export interface ChatListMatchOwnerProps {
  userId: string;
  conversationId: string;
  setConversationId: Dispatch<SetStateAction<string>>;
}

export const ChatListMatchOwner = ({
  userId,
  conversationId,
  setConversationId,
}: ChatListMatchOwnerProps) => {
  const { data: relationships } = trpc.relationship.getMatchesForOwner.useQuery(
    { userId },
    {
      onSuccess(data) {
        if (!conversationId && data && data[0] && data[0].conversation)
          setConversationId(data[0].conversation.id);
      },
    },
  );

  const { data: supportRelationships } =
    trpc.support.getRelationshipsForOwner.useQuery(
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
      supportRelationships={supportRelationships}
    />
  );
};
