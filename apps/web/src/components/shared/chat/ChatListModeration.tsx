import { Dispatch, SetStateAction } from "react";
import { trpc } from "../../../utils/trpc";
import { ChatList } from "./ChatList";

export interface ChatListModerationProps {
  userId: string;
  chatOn?: boolean;
  setConversationId: Dispatch<SetStateAction<string>>;
}

export const ChatListModeration = ({
  userId,
  chatOn, // TODO CHANGER CETTE MERDE
  setConversationId,
}: ChatListModerationProps) => {
  const { data: relationships } = trpc.moderation.getMatch.useQuery(
    chatOn ? undefined : { id: userId },
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
