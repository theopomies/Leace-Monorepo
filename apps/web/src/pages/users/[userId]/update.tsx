/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { LoggedLayout } from "../../../components/layout/LoggedLayout";
import { UpdateUserPage } from "../../../components/users/UpdateUserPage";

const Update = () => {
  const router = useRouter();
  const { userId } = router.query;

  if (typeof userId != "string" || !userId) {
    return <div>Invalid userId</div>;
  }

  return (
    <LoggedLayout title="Profile Page | Leace">
      <UpdateUserPage userId={userId} />
    </LoggedLayout>
  );
};

export default Update;
