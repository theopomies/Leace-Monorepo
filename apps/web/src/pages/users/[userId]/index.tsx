import { useRouter } from "next/router";
import { LoggedLayout } from "../../../components/shared/layout/LoggedLayout";
import { ProfilePage } from "../../../components/users/ProfilePage";

const Index = () => {
  const router = useRouter();
  const { userId } = router.query;

  if (typeof userId == "object") return <div>Multiple ids are invalid.</div>;

  if (!userId) return <div>UserId is necessary</div>;

  return (
    <LoggedLayout title="Profile Page | Leace">
      <ProfilePage userId={userId} />
    </LoggedLayout>
  );
};

export default Index;
