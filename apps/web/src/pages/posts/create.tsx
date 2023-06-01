import { LoggedLayout } from "../../components/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { CreatePostPage } from "../../components/posts/CreatePostPage";

const Create = () => {
  return (
    <LoggedLayout
      title="Profile Page | Leace"
      roles={[Role.ADMIN, Role.AGENCY, Role.OWNER]}
    >
      <CreatePostPage />
    </LoggedLayout>
  );
};

export default Create;
