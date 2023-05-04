import { Conversation, ConversationType } from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import { Button } from "../button/Button";

export interface EndOfConversationProps {
  conversation: Conversation;
}

export const EndOfConversation = ({ conversation }: EndOfConversationProps) => {
  const utils = trpc.useContext();
  const { mutate } = trpc.support.endOfConversation.useMutation({
    onSuccess() {
      utils.moderation.support.getConversation.invalidate();
      utils.conversation.getConversation.invalidate();
    },
  });

  return (
    <div className="mt-auto flex justify-center">
      {conversation.type === ConversationType.DONE ? (
        <p className="text-indigo-500">Chat Ended</p>
      ) : (
        <Button onClick={() => mutate({ conversationId: conversation.id })}>
          End Chat
        </Button>
      )}
    </div>
  );
};
