import { LoggedLayout } from "../components/LoggedLayout";
import { Home } from "../components/Home";

const Index = () => {
  return (
    <LoggedLayout>
      <Home />
    </LoggedLayout>
  );
};

export default Index;
