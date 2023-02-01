// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import ModNavBar from "../components/Moderation/ModNavBar";
import { useRouter } from "next/router";

import { trpc } from "../utils/trpc";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  return (
    <SessionProvider session={session}>
      {router.pathname.includes("moderation") ? <ModNavBar /> : <></>}
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
