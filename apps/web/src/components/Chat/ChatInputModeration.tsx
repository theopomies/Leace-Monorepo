import { trpc } from "../../utils/trpc";
import { ChatInput } from "./ChatInput";

export interface ChatInputModerationProps {
  conversationId: string;
}

export const ChatInputModeration = ({
  conversationId,
}: ChatInputModerationProps) => {
  const utils = trpc.useContext();
  const sendMessage = trpc.moderation.sendMessage.useMutation({
    onSuccess() {
      utils.moderation.getMessages.invalidate({
        conversationId: conversationId,
      });
    },
  });

  const onSend = (content: string) => {
    sendMessage.mutate({
      conversationId,
      content,
    });
  };

  return <ChatInput onSend={onSend} />;
};
