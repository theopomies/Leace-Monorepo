import { useSession } from "@clerk/nextjs";
import { LoggedLayout } from "../../../components/shared/layout/LoggedLayout";
import { ProfilePage as ProfilePageRaw } from "../../../components/users/ProfilePage";

const Index = () => {
  return (
    <LoggedLayout title="Profile Page | Leace">
      <ProfilePage />
    </LoggedLayout>
  );
};

const ProfilePage = () => {
  const session = useSession();

  if (!session.session) {
    return <div>Not found</div>;
  }

  return <ProfilePageRaw userId={session.session.user.id} />;
};

export default Index;
