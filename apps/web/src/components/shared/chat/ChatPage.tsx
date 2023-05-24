import { Role } from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import { Loader } from "../Loader";
import { TenantChat } from "./TenantChat";
import { OwnerChat } from "./OwnerChat";

export function ChatPage({
  userId,
  conversationId,
}: {
  userId: string;
  conversationId: string;
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
      />
    );
  }
  return <div>Not implemented</div>;
}
