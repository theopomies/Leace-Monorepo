import { LoggedLayout } from "../components/layout/LoggedLayout";
import { Home } from "../components/home/Home";

import React from "react";

const Index = () => {
  return (
    <LoggedLayout title="Home | Leace">
      <Home />
    </LoggedLayout>
  );
};

export default Index;
