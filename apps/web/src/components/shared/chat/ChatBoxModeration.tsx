import { trpc } from "../../../utils/trpc";
import { ChatBox } from "./ChatBox";

export interface ChatBoxModerationProps {
  conversationId: string;
  userId: string;
}

export const ChatBoxModeration = ({
  conversationId,
  ...rest
}: ChatBoxModerationProps) => {
  const { data: messages } = trpc.moderation.conversation.getMessages.useQuery({
    conversationId,
  });

  return (
    <ChatBox
      messages={messages ?? []}
      conversationId={conversationId}
      {...rest}
      isModeration
    />
  );
};
