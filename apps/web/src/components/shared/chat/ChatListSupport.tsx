import { Dispatch, SetStateAction } from "react";
import { trpc } from "../../../utils/trpc";
import { ChatList } from "./ChatList";
import { Conversation } from "@prisma/client";

export interface ChatListSupportProps {
  userId: string;
  conversation: Conversation | undefined;
  setConversation: Dispatch<SetStateAction<Conversation | undefined>>;
}

export const ChatListSupport = ({
  userId,
  conversation,
  setConversation,
}: ChatListSupportProps) => {
  const { data: supportRelationships } =
    trpc.moderation.support.getRelationships.useQuery(
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
      supportRelationships={supportRelationships}
    />
  );
};
