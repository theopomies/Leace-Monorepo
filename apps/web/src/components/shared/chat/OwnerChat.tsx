import { Role } from "@prisma/client";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../Loader";
import { Chat } from "./Chat";
import { MatchActions } from "./MatchActions";
import { OwnerContractPopover } from "./contracts/OwnerContractPopover";

export function OwnerChat({
  userId,
  conversationId,
  role,
  postId,
}: {
  userId: string;
  conversationId?: string;
  role: Role;
  postId?: string;
}) {
  const router = useRouter();
  const utils = trpc.useContext();
  const { data: conversation } = trpc.conversation.getConversation.useQuery(
    {
      conversationId: conversationId ?? "",
    },
    { enabled: !!conversationId, refetchInterval: 5000 },
  );
  const sendMutation = trpc.conversation.sendMessage.useMutation({
    onSuccess() {
      utils.conversation.getConversation.invalidate();
    },
  });
  const { data: relationships, isLoading: relationshipsLoading } =
    trpc.relationship.getMatchesForOwner.useQuery(
      { userId },
      { refetchOnWindowFocus: true },
    );

  const { data: supportRelationships, isLoading: supportRelationshipsLoading } =
    trpc.support.getRelationshipsForOwner.useQuery({ userId });
  const sendMessage = (content: string) => {
    if (conversationId) sendMutation.mutate({ conversationId, content });
  };
  const { data: posts, isLoading: postsLoading } =
    trpc.post.getPostsByUserId.useQuery({ userId });

  const relationshipsFiltered = useMemo(() => {
    if (!relationships) {
      return [];
    }
    return relationships.filter(
      (r) =>
        r.id === conversation?.relationId ||
        r.postId === postId ||
        postId === undefined,
    );
  }, [relationships, conversation?.relationId, postId]);

  const report = trpc.report.reportUserById.useMutation();
  const deleteRelationship =
    trpc.relationship.deleteRelationForOwner.useMutation();

  const isLoading = useMemo(
    () => relationshipsLoading || postsLoading || supportRelationshipsLoading,
    [relationshipsLoading, supportRelationshipsLoading, postsLoading],
  );

  const relationship = useMemo(() => {
    return relationshipsFiltered.find((r) => r.id === conversation?.relationId);
  }, [relationshipsFiltered, conversation?.relationId]);

  if (isLoading) {
    return <Loader />;
  }

  const sendHandler = conversation ? sendMessage : undefined;

  const contact = relationship?.user
    ? {
        name:
          relationship.user.firstName + " " + relationship.user.lastName ??
          "Anonymous user",
        link: `/users/${relationship.user.id}`,
      }
    : undefined;

  const onDeleteMatch = async (relationshipId: string) => {
    await deleteRelationship.mutateAsync({ userId, relationshipId });
    router.push(`/users/${userId}/matches`);
  };

  return (
    <Chat
      userId={userId}
      messages={conversation?.messages}
      onSend={sendHandler}
      relationships={relationshipsFiltered}
      supportRelationships={supportRelationships}
      role={role}
      conversationId={conversationId}
      contact={contact}
      posts={posts}
      postId={postId}
      additionnalBarComponent={
        <div className="flex items-center gap-8">
          <OwnerContractPopover relationship={relationship} />
          {relationship && (
            <MatchActions
              fullName={
                `${relationship.user.firstName} ${relationship.user.lastName}` ??
                "User"
              }
              onReport={({ reason, description }) =>
                report.mutate({
                  userId: relationship.user.id,
                  reason,
                  desc: description,
                })
              }
              onDelete={() => onDeleteMatch(relationship.id)}
            />
          )}
        </div>
      }
    />
  );
}
