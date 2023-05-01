import { Dispatch, SetStateAction } from "react";
import { trpc } from "../../../utils/trpc";
import { ChatList } from "./ChatList";

export interface ChatListSupportProps {
  userId: string;
  setConversationId: Dispatch<SetStateAction<string>>;
}

export const ChatListSupport = ({
  userId,
  setConversationId,
}: ChatListSupportProps) => {
  const { data: supportRelationships } =
    trpc.moderation.support.getRelationships.useQuery(
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
      supportRelationships={supportRelationships}
      setConversationId={setConversationId}
      userId={userId}
    />
  );
};
