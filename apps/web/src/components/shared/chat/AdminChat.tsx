import { Role } from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../Loader";
import { Chat } from "./Chat";

export function AdminChat({
  userId,
  conversationId = "",
}: {
  userId: string;
  conversationId?: string;
}) {
  const { data: user, isLoading } =
    trpc.moderation.user.getUserById.useQuery(userId);

  const { data: relationships, isLoading: relationshipsLoading } =
    trpc.moderation.relationship.getMatches.useQuery({ userId });

  const { data: supportRelationships, isLoading: supportRelationshipsLoading } =
    trpc.moderation.support.getRelationships.useQuery({ userId });

  const { data: conversation, isLoading: conversationIsLoading } =
    trpc.moderation.conversation.getConversation.useQuery({ conversationId });

  if (
    isLoading ||
    relationshipsLoading ||
    supportRelationshipsLoading ||
    conversationIsLoading
  ) {
    return <Loader />;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  if (user.role !== Role.TENANT && user.role !== Role.OWNER) {
    return <div>User is not a tenant or owner</div>;
  }

  return (
    <Chat
      userId={userId}
      role={Role.ADMIN}
      relationships={relationships}
      supportRelationships={supportRelationships}
      conversationLink="/administration/users/[userId]/conversations/[conversationId]"
      conversationId={conversationId}
      messages={conversation?.messages}
    />
  );
}