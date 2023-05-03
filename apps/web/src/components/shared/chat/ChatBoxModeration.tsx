import { Conversation } from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import { ChatBox } from "./ChatBox";

export interface ChatBoxModerationProps {
  conversation: Conversation;
  userId: string;
}

export const ChatBoxModeration = ({
  conversation,
  ...rest
}: ChatBoxModerationProps) => {
  const { data: messages } = trpc.moderation.conversation.getMessages.useQuery({
    conversationId: conversation.id,
  });

  return (
    <ChatBox conversation={conversation} messages={messages ?? []} {...rest} />
  );
};
