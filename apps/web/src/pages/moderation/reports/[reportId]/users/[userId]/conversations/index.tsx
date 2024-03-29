import { useRouter } from "next/router";
import { AdminChat } from "../../../../../../../components/shared/chat/AdminChat";
import { LoggedLayout } from "../../../../../../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";

export default function AdminUserConversationsPage() {
  const router = useRouter();
  const { userId, reportId } = router.query;

  if (!userId || typeof userId !== "string") {
    return <div>Invalid User ID</div>;
  }

  return (
    <LoggedLayout
      title="User Conversations | Leace"
      roles={[Role.ADMIN, Role.MODERATOR]}
    >
      <div className="flex h-screen w-full justify-center p-4">
        <AdminChat userId={userId} url={`/moderation/reports/${reportId}`} />
      </div>
    </LoggedLayout>
  );
}
