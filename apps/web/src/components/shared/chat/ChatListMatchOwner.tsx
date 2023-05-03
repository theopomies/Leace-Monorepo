import { Dispatch, SetStateAction } from "react";
import { trpc } from "../../../utils/trpc";
import { ChatList } from "./ChatList";
import { Conversation } from "@prisma/client";

export interface ChatListMatchOwnerProps {
  userId: string;
  conversation: Conversation | undefined;
  setConversation: Dispatch<SetStateAction<Conversation | undefined>>;
}

export const ChatListMatchOwner = ({
  userId,
  conversation,
  setConversation,
}: ChatListMatchOwnerProps) => {
  const { data: relationships } = trpc.relationship.getMatchesForOwner.useQuery(
    { userId },
    {
      onSuccess(data) {
        if (!conversation && data && data[0] && data[0].conversation)
          setConversation(data[0].conversation);
      },
    },
  );

  const { data: supportRelationships } =
    trpc.support.getRelationshipsForOwner.useQuery(
      { userId },
      {
        onSuccess(data) {
          if (!conversation && data && data[0] && data[0].conversation)
            setConversation(data[0].conversation);
        },
      },
    );

  return (
    <ChatList
      userId={userId}
      conversation={conversation}
      setConversation={setConversation}
      relationships={relationships}
      supportRelationships={supportRelationships}
    />
  );
};
