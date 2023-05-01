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
  const { data: supportMessages } =
    trpc.moderation.support.getMessages.useQuery({
      conversationId,
    });

  return (
    <ChatBox
      messages={supportMessages ?? []}
      conversationId={conversationId}
      {...rest}
      isModeration
    />
  );
};
