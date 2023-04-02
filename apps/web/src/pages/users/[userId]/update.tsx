/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { LoggedLayout } from "../../../components/shared/layout/LoggedLayout";
import { UpdateUserPage } from "../../../components/users/update/UpdateUserPage";

const Update = () => {
  const router = useRouter();
  const { userId } = router.query;

  const children =
    userId && typeof userId == "string" ? (
      <UpdateUserPage userId={userId} />
    ) : (
      <div>Invalid userId</div>
    );

  return <LoggedLayout title="Profile Page | Leace">{children}</LoggedLayout>;
};

export default Update;
