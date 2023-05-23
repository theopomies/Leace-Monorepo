import { Role } from "@prisma/client";
import { LoggedLayout } from "../../../components/layout/LoggedLayout";
import { useRouter } from "next/router";
import { AdminUserPage } from "../../../components/moderation/administration/AdminUserPage";

export default function AdminUserView() {
  const router = useRouter();
  const { userId } = router.query;

  if (!userId || typeof userId !== "string") {
    return <div>Invalid User ID</div>;
  }

  return (
    <LoggedLayout title="User Administration | Leace" roles={[Role.ADMIN]}>
      <AdminUserPage userId={userId} />
    </LoggedLayout>
  );
}
