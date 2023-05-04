import { trpc } from "../../../utils/trpc";
import { ChatBox } from "./ChatBox";

export interface ChatBoxMatch {
  conversationId: string;
  userId: string;
  chatOn: boolean | undefined;
}

export const ChatBoxMatch = ({ conversationId, ...rest }: ChatBoxMatch) => {
  const { data } = trpc.conversation.getConversation.useQuery({
    conversationId,
  });

  if (!data) return null;

  return <ChatBox conversation={data} {...rest} />;
};
