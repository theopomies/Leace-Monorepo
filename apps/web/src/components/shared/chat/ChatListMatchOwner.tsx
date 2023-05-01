import { Dispatch, SetStateAction } from "react";
import { trpc } from "../../../utils/trpc";
import { ChatList } from "./ChatList";

export interface ChatListMatchOwnerProps {
  userId: string;
  setConversationId: Dispatch<SetStateAction<string>>;
}

export const ChatListMatchOwner = ({
  userId,
  setConversationId,
}: ChatListMatchOwnerProps) => {
  const { data: relationships } = trpc.relationship.getMatchesForOwner.useQuery(
    { userId },
    {
      onSuccess(data) {
        if (data && data[0] && data[0].conversation)
          setConversationId(data[0].conversation.id);
      },
    },
  );

  const { data: supportRelationships } =
    trpc.support.getRelationshipsForOwner.useQuery(
      { userId },
      {
        onSuccess(data) {
          if (data && data[0] && data[0].conversation)
            setConversationId(data[0].conversation.id);
        },
      },
    );

  return (
    <ChatList
      relationships={relationships}
      supportRelationships={supportRelationships}
      setConversationId={setConversationId}
      userId={userId}
    />
  );
};
