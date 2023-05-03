import { ConversationType } from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import { Button } from "../button/Button";

export interface EndOfConversationProps {
  conversationId: string;
  conversationType: ConversationType;
}

export const EndOfConversation = ({
  conversationId,
  conversationType,
}: EndOfConversationProps) => {
  const utils = trpc.useContext();
  const { mutate } = trpc.support.endOfConversation.useMutation({
    onSuccess() {
      utils.conversation.getType.invalidate();
      utils.moderation.support.getRelationships.invalidate();
      utils.support.getRelationshipsForOwner.invalidate();
      utils.support.getRelationshipsForTenant.invalidate();
    },
  });

  return (
    <div className="mt-auto flex justify-center">
      {conversationType === ConversationType.DONE ? (
        <p className="text-indigo-500">Chat Ended</p>
      ) : (
        <Button onClick={() => mutate({ conversationId })}>End Chat</Button>
      )}
    </div>
  );
};
