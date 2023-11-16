import { useEffect } from "react";
import { MarketingPage } from "../components/marketing/MarketingPage";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import mixpanel from "../utils/mixpanel";

const MarketingIndex = () => {
  const { data: session } = trpc.auth.getSession.useQuery();

  const router = useRouter();

  useEffect(() => {
    mixpanel.track("Page View", {
      path: router.asPath,
      title: "Marketing Page",
      userId: session?.userId,
    });
  }, [router.asPath, session?.userId]);

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [router, session]);

  return <MarketingPage />;
};

export default MarketingIndex;
