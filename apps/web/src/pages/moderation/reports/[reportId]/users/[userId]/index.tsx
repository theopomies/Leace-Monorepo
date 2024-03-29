import { Role } from "@prisma/client";
import { useRouter } from "next/router";
import { LoggedLayout } from "../../../../../../components/layout/LoggedLayout";
import { ModerationUserPage } from "../../../../../../components/moderation/moderation/ModerationUserPage";

export default function ModerationUserView() {
  const router = useRouter();
  const { reportId, userId } = router.query;

  if (!reportId || typeof reportId !== "string") {
    return <div>Invalid Report ID</div>;
  }

  if (!userId || typeof userId !== "string") {
    return <div>Invalid User ID</div>;
  }

  return (
    <LoggedLayout
      title="User Moderation | Leace"
      roles={[Role.ADMIN, Role.MODERATOR]}
    >
      <ModerationUserPage reportId={reportId} userId={userId} />
    </LoggedLayout>
  );
}
