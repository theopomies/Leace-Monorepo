import { Dispatch, SetStateAction } from "react";
import { trpc } from "../../../utils/trpc";
import { ChatList } from "./ChatList";

export interface ChatListMatchTenantProps {
  userId: string;
  conversationId: string;
  setConversationId: Dispatch<SetStateAction<string>>;
}

export const ChatListMatchTenant = ({
  userId,
  conversationId,
  setConversationId,
}: ChatListMatchTenantProps) => {
  const { data: relationships } =
    trpc.relationship.getMatchesForTenant.useQuery(
      { userId },
      {
        onSuccess(data) {
          if (!conversationId && data && data[0] && data[0].conversation)
            setConversationId(data[0].conversation.id);
        },
      },
    );

  const { data: supportRelationships } =
    trpc.support.getRelationshipsForTenant.useQuery(
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
