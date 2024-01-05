import { Role } from "@prisma/client";
import { TenantChat } from "./TenantChat";
import { OwnerChat } from "./OwnerChat";

export interface ChatPageProps {
  role: Role;
  userId: string;
  conversationId?: string;
  postId?: string;
}

export function ChatPage({
  role,
  userId,
  conversationId,
  postId,
}: ChatPageProps) {
  if (role === Role.TENANT) {
    return (
      <TenantChat userId={userId} conversationId={conversationId} role={role} />
    );
  }
  if (role === Role.OWNER || role === Role.AGENCY) {
    return (
      <OwnerChat
        userId={userId}
        conversationId={conversationId}
        role={role}
        postId={postId}
      />
    );
  }
  return <div>Not implemented</div>;
}
