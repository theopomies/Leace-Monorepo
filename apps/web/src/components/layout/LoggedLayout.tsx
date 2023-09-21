import { NavBar } from "./navbar/NavBar";
import Head from "next/head";
import { Role } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { BanMessage } from "../moderation/ban/BanMessage";
import { NotificationButton } from "../shared/button/Notification";
import { NovuProvider } from "@novu/notification-center";

export interface LoggedLayoutProps {
  children: React.ReactNode;
  title: string;
  roles?: Role[];
}

export function LoggedLayout({
  children,
  title,
  roles = [],
}: LoggedLayoutProps) {
  const router = useRouter();

  // Convert router.asPath to a url encoded string
  const from = encodeURIComponent(router.asPath);

  return (
    <>
      <SignedIn>
        <AuthorizedLayout title={title} roles={roles}>
          {children}
        </AuthorizedLayout>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn
          afterSignInUrl={`/users/create?from=${from}`}
          afterSignUpUrl={"/users/create"}
        />
      </SignedOut>
    </>
  );
}

const AuthorizedLayout = ({
  title,
  children,
  roles,
}: {
  title: string;
  children: ReactNode;
  roles?: Role[];
}) => {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();
  const router = useRouter();

  useEffect(() => {
    if (session && !session.role) router.push("/");
  }, [session, router]);

  if (isLoading || !session) {
    return <Loader />;
  }

  if (
    roles &&
    roles.length > 0 &&
    (!session.role || (roles && !roles.includes(session.role)))
  ) {
    children = <div>Not authorized</div>;
  }

  return (
    <>
      <Head>
        <title>{title ?? "Leace"}</title>
      </Head>
      <NovuProvider
        subscriberId={session?.userId}
        applicationIdentifier={"jSSfV5eCMrsu"}
      >
        <NotificationButton />

        <div className="flex min-h-screen flex-row bg-gray-100">
          <NavBar userId={session.userId} />
          {session && session.ban ? <BanMessage ban={session.ban} /> : children}
        </div>
      </NovuProvider>
    </>
  );
};
