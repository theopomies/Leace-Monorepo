import { Dispatch, SetStateAction } from "react";
import { trpc } from "../../../utils/trpc";
import { ChatList } from "./ChatList";

export interface ChatListMatchProps {
  userId: string;
  setConversationId: Dispatch<SetStateAction<string>>;
}

export const ChatListMatch = ({
  userId,
  setConversationId,
}: ChatListMatchProps) => {
  const { data: relationships } = trpc.relationship.getMatch.useQuery(
    undefined,
    {
      onSuccess(data) {
        if (data && data[0] && data[0].conversation)
          setConversationId(data[0].conversation.id);
      },
    },
  );

  if (!relationships) return <div>No conversations</div>;

  return (
    <ChatList
      relationships={relationships}
      setConversationId={setConversationId}
      userId={userId}
    />
  );
};
