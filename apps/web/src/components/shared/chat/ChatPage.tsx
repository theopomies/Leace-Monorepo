import { Role } from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../Loader";
import { TenantChat } from "./TenantChat";
import { OwnerChat } from "./OwnerChat";

export function ChatPage({
  userId,
  conversationId,
  postId,
}: {
  userId: string;
  conversationId?: string;
  postId?: string;
}) {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (!session || !session.role) {
    return <div>Not logged in, shouldn&apos;t appear</div>;
  }

  if (session.role === Role.TENANT) {
    return (
      <TenantChat
        userId={userId}
        conversationId={conversationId}
        role={session.role}
      />
    );
  }
  if (session.role === Role.OWNER || session.role === Role.AGENCY) {
    return (
      <OwnerChat
        userId={userId}
        conversationId={conversationId}
        role={session.role}
        postId={postId}
      />
    );
  }
  return <div>Not implemented</div>;
}
