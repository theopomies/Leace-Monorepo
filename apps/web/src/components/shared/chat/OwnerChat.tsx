import { useMemo } from "react";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../Loader";
import { Chat } from "./Chat";
import { Role } from "@prisma/client";

export function OwnerChat({
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
    trpc.conversation.getConversation.useQuery({ conversationId });
  const sendMutation = trpc.conversation.sendMessage.useMutation({
    onSuccess() {
      utils.conversation.getConversation.invalidate();
    },
  });
  const { data: relationships, isLoading: relationshipsLoading } =
    trpc.relationship.getMatchesForOwner.useQuery({ userId });

  const { data: supportRelationships, isLoading: supportRelationshipsLoading } =
    trpc.support.getRelationshipsForOwner.useQuery({ userId });
  const sendMessage = (content: string) => {
    sendMutation.mutate({ conversationId, content });
  };

  const isLoading = useMemo(
    () =>
      conversationIsLoading ||
      relationshipsLoading ||
      supportRelationshipsLoading,
    [conversationIsLoading, relationshipsLoading, supportRelationshipsLoading],
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
      relationships={relationships}
      supportRelationships={supportRelationships}
      role={role}
      conversationId={conversationId}
    />
  );
}
