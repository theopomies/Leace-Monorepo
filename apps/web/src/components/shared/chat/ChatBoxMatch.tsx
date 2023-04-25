import { trpc } from "../../../utils/trpc";
import { ChatBox } from "./ChatBox";

export interface ChatBoxMatch {
  conversationId: string;
  userId: string;
  chatOn: boolean | undefined;
}

export const ChatBoxMatch = ({ conversationId, ...rest }: ChatBoxMatch) => {
  const { data: messages } = trpc.conversation.getMessages.useQuery({
    conversationId,
  });

  return (
    <ChatBox
      messages={messages ?? []}
      conversationId={conversationId}
      {...rest}
    />
  );
};
