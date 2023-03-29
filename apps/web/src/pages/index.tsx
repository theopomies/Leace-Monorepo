import { LoggedLayout } from "../components/shared/layout/LoggedLayout";
import { Home } from "../components/home/Home";

const Index = () => {
  return (
    <LoggedLayout title="Home | Leace">
      <Home />
    </LoggedLayout>
  );
};

export default Index;
