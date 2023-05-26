import { useRouter } from "next/router";
import { Role } from "@prisma/client";
import { LoggedLayout } from "../../../../../../../components/layout/LoggedLayout";
import { AdminChat } from "../../../../../../../components/shared/chat/AdminChat";

export default function AdminUserConversationPage() {
  const router = useRouter();
  const { userId, conversationId } = router.query;

  if (!userId || typeof userId !== "string") {
    return <div>Invalid User ID</div>;
  }
  if (!conversationId || typeof conversationId !== "string") {
    return <div>Invalid Conversation ID</div>;
  }

  return (
    <LoggedLayout
      title="User Conversation | Leace"
      roles={[Role.ADMIN, Role.MODERATOR]}
    >
      <div className="flex h-screen w-full justify-center p-4">
        <AdminChat userId={userId} conversationId={conversationId} />
      </div>
    </LoggedLayout>
  );
}
