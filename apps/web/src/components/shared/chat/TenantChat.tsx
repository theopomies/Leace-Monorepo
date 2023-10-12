import { useMemo, useState } from "react";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../Loader";
import { Chat } from "./Chat";
import { Role } from "@prisma/client";
import { TenantContractPopover } from "./contracts/TenantContractPopover";
import { ReportDialog } from "./ReportDialog";
import { Button } from "../button/Button";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";

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

  const user = trpc.user.getUserById.useQuery({ userId: userId }).data;
  const [localLikeCount, setLocalLikeCount] = useState<number>(user?.like ?? 0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

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

  // const likeMutation = trpc.user.updateUserById.useMutation({
  //   onSuccess() {
  //     utils.user.getUserById.invalidate({ userId });
  //   },
  // });

  // Gestionnaire de clic pour "like"
  const handleLikeClick = () => {
    setLocalLikeCount(prev => hasLiked ? prev - 1 : prev + 1);
    setHasLiked(!hasLiked);

    // // Mettre à jour côté serveur
    // likeMutation.mutate({
    //   userId,
    //   like: !hasLiked // nouvelle valeur de "like" pour l'utilisateur
    // });
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

  const [liked, setLiked] = useState(false);
  const likeMutation = trpc.user.updateUserById.useMutation({
    onSuccess() {
      utils.user.getUserById.invalidate({ userId });
      setLiked(true);
    },
  });

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
          {user && user?.role === Role.TENANT && (
            <div className="flex items-center">
              <span className="text-lg font-semibold">
                {localLikeCount}
              </span>
              {hasLiked ? (
                <AiFillLike onClick={handleLikeClick} className="text-blue-500 ml-2 cursor-pointer" />
              ) : (
                <AiOutlineLike onClick={handleLikeClick} className="text-blue-500 ml-2 cursor-pointer" />
              )}
            </div>
          )}
          {relationship &&
            (relationship.lease?.isSigned ? (
              relationship.post.createdBy.role == Role.AGENCY &&
              !liked && (
                <Button
                  onClick={() =>
                    likeMutation.mutate({
                      userId: relationship.post.createdBy.id,
                    })
                  }
                >
                  Like Agency
                </Button>
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
