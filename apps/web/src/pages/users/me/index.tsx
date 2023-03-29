import { LoggedLayout } from "../../../components/shared/layout/LoggedLayout";
import ProfilePage from "../../../components/users/ProfilePage";

const Index = () => {
  return (
    <LoggedLayout title="Profile Page | Leace">
      <ProfilePage />
    </LoggedLayout>
  );
};

export default Index;
