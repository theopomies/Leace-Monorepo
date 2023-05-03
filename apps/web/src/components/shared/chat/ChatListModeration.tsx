import { Dispatch, SetStateAction } from "react";
import { trpc } from "../../../utils/trpc";
import { ChatList } from "./ChatList";
import { Conversation } from "@prisma/client";

export interface ChatListModerationProps {
  userId: string;
  conversation: Conversation | undefined;
  setConversation: Dispatch<SetStateAction<Conversation | undefined>>;
}

export const ChatListModeration = ({
  userId,
  conversation,
  setConversation,
}: ChatListModerationProps) => {
  const { data: relationships } =
    trpc.moderation.relationship.getMatches.useQuery(
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
    />
  );
};
