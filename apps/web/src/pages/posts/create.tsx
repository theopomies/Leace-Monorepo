import { LoggedLayout } from "../../components/shared/layout/LoggedLayout";
import { Role } from "@prisma/client";
import { CreatePost } from "../../components/posts/CreatePost";

const Create = () => {
  return (
    <LoggedLayout
      title="Profile Page | Leace"
      roles={[Role.ADMIN, Role.AGENCY, Role.OWNER]}
    >
      <CreatePost />
    </LoggedLayout>
  );
};

export default Create;
