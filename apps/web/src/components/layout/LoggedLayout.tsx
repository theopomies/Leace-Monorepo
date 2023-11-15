import { NavBar } from "./navbar/NavBar";
import Head from "next/head";
import { Role } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { Loader } from "../shared/Loader";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { ReactNode } from "react";
import { useRouter } from "next/router";
import { BanMessage } from "../moderation/ban/BanMessage";
import { ToastDescription, ToastTitle, useToast } from "../shared/toast/Toast";
import { OnboardingStatus } from "@leace/api/src/utils/types";

export interface LoggedLayoutProps {
  children: React.ReactNode;
  title: string;
  roles?: Role[];
  navbar?: boolean;
}

export function LoggedLayout({
  children,
  title,
  roles = [],
  navbar = true,
}: LoggedLayoutProps) {
  const router = useRouter();

  // Convert router.asPath to a url encoded string
  const from = encodeURIComponent(router.asPath);

  return (
    <>
      <SignedIn>
        <AuthorizedLayout title={title} roles={roles} navbar={navbar}>
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
  navbar,
}: {
  title: string;
  children: ReactNode;
  roles?: Role[];
  navbar: boolean;
}) => {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();
  const { data: onboardingStatus } =
    trpc.onboarding.getUserOnboardingStatus.useQuery(
      {
        userId: session?.userId ?? "",
      },
      {
        enabled: !!session?.userId,
      },
    );
  const router = useRouter();
  const { renderToast } = useToast();

  if (isLoading || !session) {
    return <Loader />;
  }

  if (!router.pathname.startsWith("/onboarding")) {
    if (
      !session.role ||
      (onboardingStatus !== undefined &&
        onboardingStatus !== OnboardingStatus.COMPLETE)
    ) {
      router.push("/onboarding");
      return <Loader />;
    }

    if (roles && roles.length > 0 && roles && !roles.includes(session.role)) {
      router.push("/");
      renderToast(
        <>
          <ToastTitle>Unauthorized</ToastTitle>
          <ToastDescription>
            Oops, looks like you tried going somewhere you weren&apos;t invited
          </ToastDescription>
        </>,
      );
      return <Loader />;
    }
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
  } else if (router.pathname.startsWith("/certification")) {
    activePage = "Certification";
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
      <div className="flex h-screen bg-gray-100">
        {navbar && <NavBar session={session} activePage={activePage} />}
        {session && session.ban ? <BanMessage ban={session.ban} /> : children}
      </div>
    </>
  );
};
