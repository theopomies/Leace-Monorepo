import { useRouter } from "next/router";
import { LoggedLayout } from "../../../../components/layout/LoggedLayout";
import { UpdateAdminPostPage } from "../../../../components/moderation/administration/UpdateAdminPostPage";
import { Role } from "@prisma/client";

const UpdateAdminPostView = () => {
  const router = useRouter();
  const { postId } = router.query;

  if (typeof postId != "string" || !postId) {
    return <div>Invalid postId</div>;
  }

  return (
    <LoggedLayout title="Update Post | Leace" roles={[Role.ADMIN]}>
      <UpdateAdminPostPage postId={postId} />
    </LoggedLayout>
  );
};

export default UpdateAdminPostView;
