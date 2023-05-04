import { trpc } from "../../../utils/trpc";
import { ChatInput } from "./ChatInput";

export interface ChatInputSupportProps {
  conversationId: string;
}

export const ChatInputSupport = ({ conversationId }: ChatInputSupportProps) => {
  const utils = trpc.useContext();
  const sendMessage = trpc.moderation.support.sendMessage.useMutation({
    onSuccess() {
      utils.moderation.support.getConversation.invalidate();
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
