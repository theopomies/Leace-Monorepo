import { useMemo, useState } from "react";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../Loader";
import { Chat } from "./Chat";
import { Role } from "@prisma/client";
import { TenantContractPopover } from "./contracts/TenantContractPopover";
import { ReportDialog } from "./ReportDialog";
import { Button } from "../button/Button";

function LikeButton({ agencyId }: { agencyId: string }) {
  const [label, setLabel] = useState("Recommend this agency");
  const mutation = trpc.post.likeAgency.useQuery({
    agencyId,
  });

  const handleClick = () => {
    // mutation.mutate();
    setLabel("Thank you!");
  };

  return (
    <Button onClick={handleClick} disabled={mutation.isLoading}>
      {label}
    </Button>
  );
}

export function TenantChat({
  userId,
  conversationId = "",
  role,
}: {
  userId: string;
  conversationId?: string;
  role: Role;
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
    trpc.relationship.getMatchesForTenant.useQuery({ userId });

  const { data: supportRelationships, isLoading: supportRelationshipsLoading } =
    trpc.support.getRelationshipsForTenant.useQuery({ userId });
  const sendMessage = (content: string) => {
    sendMutation.mutate({ conversationId, content });
  };

  const report = trpc.report.reportPostById.useMutation();

  const isLoading = useMemo(
    () =>
      conversationIsLoading ||
      relationshipsLoading ||
      supportRelationshipsLoading,
    [conversationIsLoading, relationshipsLoading, supportRelationshipsLoading],
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

  if (!relationship) {
    return <div>Relationship not found</div>; // TODO: 404
  }

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
          {relationship &&
            (relationship.lease?.isSigned ? (
              relationship.post.createdBy.role == Role.AGENCY && (
                <LikeButton agencyId={relationship?.post.createdBy.id} />
              )
            ) : (
              <ReportDialog
                title={relationship.post.title ?? "title"}
                onReport={({ reason, description }) =>
                  report.mutate({
                    postId: relationship.post.id,
                    reason,
                    desc: description,
                  })
                }
              />
            ))}
          <TenantContractPopover relationship={relationship} />
        </div>
      }
    />
  );
}
