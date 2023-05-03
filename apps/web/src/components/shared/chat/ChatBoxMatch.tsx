import { Conversation } from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import { ChatBox } from "./ChatBox";

export interface ChatBoxMatch {
  conversation: Conversation;
  userId: string;
  chatOn: boolean | undefined;
}

export const ChatBoxMatch = ({ conversation, ...rest }: ChatBoxMatch) => {
  const { data: messages } = trpc.conversation.getMessages.useQuery({
    conversationId: conversation.id,
  });

  return (
    <ChatBox conversation={conversation} messages={messages ?? []} {...rest} />
  );
};
