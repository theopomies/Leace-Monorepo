import { useRouter } from "next/router";
import { LoggedLayout } from "../../../components/layout/LoggedLayout";
import { UserPage } from "../../../components/users/UserPage";

const Index = () => {
  const router = useRouter();
  const { userId } = router.query;

  if (typeof userId == "object") return <div>Multiple ids are invalid.</div>;

  if (!userId) return <div>UserId is necessary</div>;

  return (
    <LoggedLayout title="Profile Page | Leace">
      <UserPage userId={userId} />
    </LoggedLayout>
  );
};

export default Index;
