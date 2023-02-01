import { LoggedLayout } from "../components/LoggedLayout";
import { Home } from "../components/Home";

const Index = () => {
  return (
    <LoggedLayout title="Home | Leace">
      <Home />
    </LoggedLayout>
  );
};

export default Index;
