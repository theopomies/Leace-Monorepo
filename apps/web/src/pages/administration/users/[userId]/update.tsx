/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { LoggedLayout } from "../../../../components/layout/LoggedLayout";
import { UpdateAdminUserPage } from "../../../../components/moderation/administration/UpdateAdminUserPage";
import { Role } from "@prisma/client";

const UpdateAdminUserView = () => {
  const router = useRouter();
  const { userId } = router.query;

  if (typeof userId != "string" || !userId) {
    return <div>Invalid userId</div>;
  }

  return (
    <LoggedLayout title="Profile Page | Leace" roles={[Role.ADMIN]}>
      <UpdateAdminUserPage userId={userId} />
    </LoggedLayout>
  );
};

export default UpdateAdminUserView;
