import { LoggedLayout } from "../../../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { CreatePostPage } from "../../../../components/posts/CreatePostPage";
import { useRouter } from "next/router";

const CreatePostView = () => {
  const router = useRouter();
  const { userId } = router.query;

  if (!userId || typeof userId !== "string") {
    return <div>Invalid userId</div>;
  }

  return (
    <LoggedLayout
      title="Profile Page | Leace"
      roles={[Role.ADMIN, Role.AGENCY, Role.OWNER]}
    >
      <CreatePostPage userId={userId} />
    </LoggedLayout>
  );
};

export default CreatePostView;
