import { trpc } from "../../utils/trpc";
import { ChatBox } from "./ChatBox";

export interface ChatBoxModerationProps {
  conversationId: string;
  userId: string;
  chatOn: boolean | undefined;
}

export const ChatBoxModeration = ({
  conversationId,
  ...rest
}: ChatBoxModerationProps) => {
  const { data: messages } = trpc.moderation.getMessages.useQuery({
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
