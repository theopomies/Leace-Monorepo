import { Role } from "@prisma/client";
import { LoggedLayout } from "../../../../components/layout/LoggedLayout";
import { useRouter } from "next/router";
import { AdminPostPage } from "../../../../components/moderation/administration/AdminPostPage";

export default function AdminPostView() {
  const router = useRouter();
  const { postId } = router.query;

  if (!postId || typeof postId !== "string") {
    return <div>Invalid Post ID</div>;
  }

  return (
    <LoggedLayout title="Post Administration | Leace" roles={[Role.ADMIN]}>
      <AdminPostPage postId={postId} />
    </LoggedLayout>
  );
}
