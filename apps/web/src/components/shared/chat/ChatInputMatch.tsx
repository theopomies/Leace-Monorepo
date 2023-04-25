import { trpc } from "../../../utils/trpc";
import { ChatInput } from "./ChatInput";

export interface ChatInputMatchProps {
  conversationId: string;
}

export const ChatInputMatch = ({ conversationId }: ChatInputMatchProps) => {
  const utils = trpc.useContext();
  const sendMessage = trpc.conversation.sendMessage.useMutation({
    onSuccess() {
      utils.conversation.getMessages.invalidate({
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
