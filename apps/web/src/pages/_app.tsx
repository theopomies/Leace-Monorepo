// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { trpc } from "../utils/trpc";
import { ToastProvider } from "../components/shared/toast/Toast";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <ClerkProvider {...pageProps}>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
