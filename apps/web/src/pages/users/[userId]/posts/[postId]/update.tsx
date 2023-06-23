import { useRouter } from "next/router";
import { Role } from "@prisma/client";
import { LoggedLayout } from "../../../../../components/layout/LoggedLayout";
import { UpdatePostPage } from "../../../../../components/posts/UpdatePostPage";

const UpdatePostView = () => {
  const router = useRouter();
  const { postId } = router.query;

  if (typeof postId != "string" || !postId) {
    return <div>Invalid postId</div>;
  }

  return (
    <LoggedLayout
      title="Update Post | Leace"
      roles={[Role.ADMIN, Role.OWNER, Role.AGENCY]}
    >
      <UpdatePostPage postId={postId} />
    </LoggedLayout>
  );
};

export default UpdatePostView;
