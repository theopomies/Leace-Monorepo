import { Role } from "@prisma/client";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../Loader";
import { Chat } from "./Chat";
import { MatchActions } from "./MatchActions";
import { TenantContractPopover } from "./contracts/TenantContractPopover";

export function TenantChat({
  userId,
  conversationId = "",
  role,
}: {
  userId: string;
  conversationId?: string;
  role: Role;
}) {
  const router = useRouter();
  const utils = trpc.useContext();
  const { data: conversation } = trpc.conversation.getConversation.useQuery(
    { conversationId: conversationId ?? "" },
    { enabled: !!conversationId, refetchInterval: 4000 },
  );
  const sendMutation = trpc.conversation.sendMessage.useMutation({
    onSuccess() {
      utils.conversation.getConversation.invalidate();
    },
  });
  const { data: relationships, isLoading: relationshipsLoading } =
    trpc.relationship.getMatchesForTenant.useQuery(
      { userId },
      { refetchOnWindowFocus: true },
    );

  const { data: supportRelationships, isLoading: supportRelationshipsLoading } =
    trpc.support.getRelationshipsForTenant.useQuery({ userId });
  const sendMessage = (content: string) => {
    sendMutation.mutate({ conversationId, content });
  };

  const report = trpc.report.reportPostById.useMutation();
  const deleteRelationship =
    trpc.relationship.deleteRelationForTenant.useMutation();

  const isLoading = useMemo(
    () => relationshipsLoading || supportRelationshipsLoading,
    [relationshipsLoading, supportRelationshipsLoading],
  );

  const relationship = useMemo(() => {
    if (!relationships) {
      return undefined;
    }
    return relationships.find((r) => r.id === conversation?.relationId);
  }, [relationships, conversation]);

  if (isLoading) {
    return <Loader />;
  }

  const sendHandler = conversation ? sendMessage : undefined;

  const contact = relationship
    ? {
        name:
          relationship.post.createdBy.firstName +
          " - " +
          (relationship.post.title || "Untitled Post"),
        link: `/posts/${relationship.post.id}`,
      }
    : undefined;

  const onDelete = async (relationshipId: string) => {
    await deleteRelationship.mutateAsync({ userId, relationshipId });
    router.push(`/users/${userId}/matches`);
  };

  return (
    <Chat
      userId={userId}
      messages={conversation?.messages}
      onSend={sendHandler}
      relationships={relationships}
      supportRelationships={supportRelationships}
      role={role}
      conversationId={conversationId}
      contact={contact}
      additionnalBarComponent={
        <div className="flex items-center gap-8">
          <TenantContractPopover relationship={relationship} />
          {relationship && (
            <MatchActions
              fullName={
                `${relationship.post.createdBy.firstName} ${relationship.post.createdBy.lastName}` ??
                "User"
              }
              onReport={({ reason, description }) =>
                report.mutate({
                  postId: relationship.post.id,
                  reason,
                  desc: description,
                })
              }
              onDelete={() => onDelete(relationship.id)}
            />
          )}
        </div>
      }
    />
  );
}
