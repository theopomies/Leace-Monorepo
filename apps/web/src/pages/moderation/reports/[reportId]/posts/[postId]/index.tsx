import { Role } from "@prisma/client";
import { LoggedLayout } from "../../../../../../components/layout/LoggedLayout";
import { useRouter } from "next/router";
import { ModeratioPostPage } from "../../../../../../components/moderation/moderation/ModerationPostPage";

export default function ModerationPostView() {
  const router = useRouter();
  const { reportId, postId } = router.query;

  if (!reportId || typeof reportId !== "string") {
    return <div>Invalid Report ID</div>;
  }

  if (!postId || typeof postId !== "string") {
    return <div>Invalid User ID</div>;
  }

  return (
    <LoggedLayout
      title="User Moderation | Leace"
      roles={[Role.ADMIN, Role.MODERATOR]}
    >
      <ModeratioPostPage reportId={reportId} postId={postId} />
    </LoggedLayout>
  );
}
