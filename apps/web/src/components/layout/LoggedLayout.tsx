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

  let activePage = "Home";

  if (router.pathname.startsWith("/dashboard")) {
    activePage = "Dashboard";
  } else if (router.pathname.startsWith("/users/[userId]/posts")) {
    activePage = "My Posts";
  } else if (router.pathname.startsWith("/users/[userId]/matches")) {
    activePage = "Matches";
  } else if (router.pathname.startsWith("/moderation/reports")) {
    activePage = "Moderation";
  } else if (router.pathname.startsWith("/users/[userId]")) {
    activePage = "Profile";
  } else if (router.pathname.startsWith("/premium")) {
    activePage = "Premium";
  } else if (router.pathname.startsWith("/support")) {
    activePage = "Support";
  } else {
    activePage = "Home";
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

        <div className="flex h-screen bg-gray-100">
          <NavBar userId={session.userId} activePage={activePage} />
          {session && session.ban ? <BanMessage ban={session.ban} /> : children}
        </div>
      </NovuProvider>
    </>
  );
};
