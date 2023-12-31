import { Role } from "@prisma/client";
import { LoggedLayout } from "../../../../components/layout/LoggedLayout";
import { useRouter } from "next/router";
import { CertificationPostPage } from "../../../../components/moderation/certification/CertificationPostPage";

export default function CertificationPostView() {
  const router = useRouter();
  const { postId } = router.query;

  if (!postId || typeof postId !== "string") {
    return <div>Invalid User ID</div>;
  }

  return (
    <LoggedLayout
      title="Post Certification | Leace"
      roles={[Role.ADMIN, Role.MODERATOR]}
    >
      <CertificationPostPage postId={postId} />
    </LoggedLayout>
  );
}
