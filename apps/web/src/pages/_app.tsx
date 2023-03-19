// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { trpc } from "../utils/trpc";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <ClerkProvider
      publishableKey={"pk_test_Y2VydGFpbi1jcmFiLTU0LmNsZXJrLmFjY291bnRzLmRldiQ"}
    >
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
