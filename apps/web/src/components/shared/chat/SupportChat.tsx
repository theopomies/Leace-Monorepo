import { useMemo } from "react";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../Loader";
import { Chat } from "./Chat";
import { Role } from "@prisma/client";

export function SupportChat({
  userId,
  conversationId,
  role,
}: {
  userId: string;
  conversationId: string;
  role: Role;
}) {
  const utils = trpc.useContext();
  const { data: conversation, isLoading: conversationIsLoading } =
    trpc.moderation.support.getConversation.useQuery({
      conversationId,
    });
  const sendMutation = trpc.moderation.support.sendMessage.useMutation({
    onSuccess() {
      utils.moderation.support.getConversation.invalidate();
    },
  });
  const { data: supportRelationships, isLoading: supportRelationshipsLoading } =
    trpc.moderation.support.getRelationships.useQuery({ userId });

  const sendMessage = (content: string) => {
    sendMutation.mutate({ conversationId, content });
  };

  const isLoading = useMemo(
    () => conversationIsLoading || supportRelationshipsLoading,
    [conversationIsLoading, supportRelationshipsLoading],
  );

  if (isLoading) {
    return <Loader />;
  }

  if (!conversation) {
    return <div>Conversation not found</div>; // TODO: 404
  }

  return (
    <Chat
      userId={userId}
      messages={conversation.messages}
      onSend={sendMessage}
      supportRelationships={supportRelationships}
      role={role}
      conversationId={conversationId}
      conversationLink="/support/[conversationId]"
    />
  );
}
