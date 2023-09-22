import { useMemo } from "react";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../Loader";
import { Chat } from "./Chat";
import { Role } from "@prisma/client";
import { OwnerContractPopover } from "./contracts/OwnerContractPopover";
import { ReportDialog } from "./ReportDialog";

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
  const utils = trpc.useContext();
  const { data: conversation, isLoading: conversationIsLoadingOrNotEnabled } =
    trpc.conversation.getConversation.useQuery(
      {
        conversationId: conversationId ?? "",
      },
      { enabled: !!conversationId },
    );
  const conversationIsLoading = useMemo(
    () => conversationIsLoadingOrNotEnabled && !!conversationId,
    [conversationIsLoadingOrNotEnabled, conversationId],
  );
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

  const isLoading = useMemo(
    () =>
      conversationIsLoading ||
      relationshipsLoading ||
      postsLoading ||
      supportRelationshipsLoading,
    [
      conversationIsLoading,
      relationshipsLoading,
      supportRelationshipsLoading,
      postsLoading,
    ],
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
          {relationship && (
            <ReportDialog
              title={relationship.user.firstName ?? "User"}
              onReport={({ reason, description }) =>
                report.mutate({
                  userId: relationship.user.id,
                  reason,
                  desc: description,
                })
              }
            />
          )}
          <OwnerContractPopover relationship={relationship} />
        </div>
      }
    />
  );
}
