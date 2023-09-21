import { LoggedLayout } from "../components/layout/LoggedLayout";
import { Home } from "../components/home/Home";

import React from "react";
import { NovuProvider } from "@novu/notification-center";
import { trpc } from "../utils/trpc";

const Index = () => {
  const { data: session } = trpc.auth.getSession.useQuery();
  return (
    <NovuProvider
      subscriberId={session?.userId}
      applicationIdentifier={"jSSfV5eCMrsu"}
    >
      <LoggedLayout title="Home | Leace">
        <Home />
      </LoggedLayout>
    </NovuProvider>
  );
};

export default Index;
