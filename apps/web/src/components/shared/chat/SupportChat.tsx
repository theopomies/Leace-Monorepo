import { useMemo } from "react";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../Loader";
import { Chat } from "./Chat";
import { Role } from "@prisma/client";

export function SupportChat({
  userId,
  conversationId = "",
  role,
}: {
  userId: string;
  conversationId?: string;
  role: Role;
}) {
  const { data: supportRelationships, isLoading: supportRelationshipsLoading } =
    trpc.moderation.support.getRelationships.useQuery({ userId });

  const {
    data: conversation,
    isLoading: conversationIsLoading,
    refetch: refetchConversation,
  } = trpc.moderation.support.getConversation.useQuery(
    { conversationId },
    {
      refetchOnWindowFocus: false,
      retry: false,
    },
  );

  const sendMutation = trpc.moderation.support.sendMessage.useMutation({
    onSuccess() {
      refetchConversation();
    },
  });

  const sendMessage = (content: string) => {
    if (!conversationId) {
      return;
    }
    sendMutation.mutate({ conversationId, content });
  };

  const isLoading = useMemo(
    () => conversationIsLoading || supportRelationshipsLoading,
    [conversationIsLoading, supportRelationshipsLoading],
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Chat
      userId={userId}
      messages={conversation?.messages}
      onSend={conversationId !== "" ? sendMessage : undefined}
      supportRelationships={supportRelationships}
      role={role}
      conversationId={conversationId}
      conversationLink="/support/[conversationId]"
    />
  );
}
