import { Role } from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../Loader";
import { Chat } from "./Chat";
import { useMemo } from "react";

export function AdminChat({
  userId,
  conversationId = "",
  url,
}: {
  userId: string;
  conversationId?: string;
  url: string;
}) {
  const { data: user, isLoading: userLoading } =
    trpc.moderation.user.getUserById.useQuery(userId);

  const { data: relationships, isLoading: relationshipsLoading } =
    trpc.moderation.relationship.getMatches.useQuery({ userId });

  const { data: supportRelationships, isLoading: supportRelationshipsLoading } =
    trpc.moderation.support.getRelationships.useQuery({ userId });

  const { data: conversation, isLoading: conversationIsLoading } =
    trpc.moderation.conversation.getConversation.useQuery(
      { conversationId },
      { retry: false },
    );

  const isLoading = useMemo(
    () =>
      userLoading ||
      relationshipsLoading ||
      supportRelationshipsLoading ||
      conversationIsLoading,
    [
      userLoading,
      relationshipsLoading,
      supportRelationshipsLoading,
      conversationIsLoading,
    ],
  );

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  if (
    user.role !== Role.TENANT &&
    user.role !== Role.OWNER &&
    user.role !== Role.AGENCY
  ) {
    return <div>User is not a tenant or owner/agency</div>;
  }

  return (
    <Chat
      userId={userId}
      role={Role.ADMIN}
      relationships={relationships}
      supportRelationships={supportRelationships}
      conversationLink={`${url}/users/[userId]/conversations/[conversationId]`}
      conversationId={conversationId}
      messages={conversation?.messages}
    />
  );
}
