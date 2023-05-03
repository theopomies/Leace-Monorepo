import { Conversation } from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import { ChatBox } from "./ChatBox";

export interface ChatBoxSupportProps {
  conversation: Conversation;
  userId: string;
  chatOn: boolean | undefined;
  isSupport: boolean;
}

export const ChatBoxSupport = ({
  conversation,
  ...rest
}: ChatBoxSupportProps) => {
  const { data: supportMessages } =
    trpc.moderation.support.getMessages.useQuery({
      conversationId: conversation.id,
    });

  return (
    <ChatBox
      conversation={conversation}
      messages={supportMessages ?? []}
      {...rest}
      isSupport
    />
  );
};
