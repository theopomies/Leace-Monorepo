import { LoggedLayout } from "../components/layout/LoggedLayout";
import { Home } from "../components/home/Home";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";
import mixpanel from "../utils/mixpanel";

import React from "react";

const Index = () => {
  const { data: session } = trpc.auth.getSession.useQuery();
  const router = useRouter();

  useEffect(() => {
    mixpanel.track("Page View", {
      path: router.asPath,
      title: "Home Page",
      userId: session?.userId,
    });
  }, [router.asPath, session?.userId]);

  return (
    <LoggedLayout title="Home | Leace">
      <Home />
    </LoggedLayout>
  );
};

export default Index;
