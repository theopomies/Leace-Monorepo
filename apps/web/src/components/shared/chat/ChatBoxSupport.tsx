import { trpc } from "../../../utils/trpc";
import { ChatBox } from "./ChatBox";

export interface ChatBoxSupportProps {
  conversationId: string;
  userId: string;
  chatOn: boolean | undefined;
}

export const ChatBoxSupport = ({
  conversationId,
  ...rest
}: ChatBoxSupportProps) => {
  const { data } = trpc.moderation.support.getConversation.useQuery({
    conversationId,
  });

  if (!data) return null;

  return <ChatBox conversation={data} {...rest} isSupport />;
};
